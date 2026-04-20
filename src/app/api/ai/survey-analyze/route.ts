import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { surveys, surveyResponsesV2, surveyAnalyses } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { getAnthropicClient } from "@/lib/ai/client";
import { surveyAnalysisRequestSchema } from "@/lib/types/survey";
import type { SurveyQuestion } from "@/lib/types/survey";
import {
  getSurveyNormalAnalysisSystemPrompt,
  getSurveyNormalAnalysisUserPrompt,
  getSurveyCrossQuestionAnalysisSystemPrompt,
  getSurveyCrossQuestionAnalysisUserPrompt,
  getSurveyCrossSurveyComparisonSystemPrompt,
  getSurveyCrossSurveyComparisonUserPrompt,
  getSurveyTrendAnalysisSystemPrompt,
  getSurveyTrendAnalysisUserPrompt,
} from "@/lib/ai/prompts/survey";
import { requirePro } from "@/lib/auth/require-pro";

export async function POST(request: NextRequest) {
  const auth = await requirePro();
  if (!auth.ok) return auth.response;
  const user = auth.user;

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI service is not configured. Please set ANTHROPIC_API_KEY in .env.local" },
      { status: 503 }
    );
  }

  const body = await request.json();
  const parsed = surveyAnalysisRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { surveyId, analysisType, compareSurveyIds, locale: rawLocale } = parsed.data;
  const validLocale = rawLocale === "en" ? "en" : "tr";

  try {
    // Fetch main survey
    const [survey] = await db
      .select()
      .from(surveys)
      .where(and(eq(surveys.id, surveyId), eq(surveys.userId, user.id)));

    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    // Fetch responses
    const responses = await db
      .select()
      .from(surveyResponsesV2)
      .where(eq(surveyResponsesV2.surveyId, surveyId));

    if (responses.length === 0) {
      return NextResponse.json({ error: "No responses to analyze" }, { status: 400 });
    }

    const questions = survey.questions as SurveyQuestion[];
    const responseData = responses.map((r) => r.responses as Record<string, unknown>);

    // Build prompts based on analysis type
    let systemPrompt: string;
    let userPrompt: string;

    switch (analysisType) {
      case "normal": {
        systemPrompt = getSurveyNormalAnalysisSystemPrompt(validLocale);
        userPrompt = getSurveyNormalAnalysisUserPrompt(survey.title, questions, responseData, validLocale);
        break;
      }
      case "cross_question": {
        systemPrompt = getSurveyCrossQuestionAnalysisSystemPrompt(validLocale);
        userPrompt = getSurveyCrossQuestionAnalysisUserPrompt(survey.title, questions, responseData, validLocale);
        break;
      }
      case "cross_survey": {
        if (!compareSurveyIds || compareSurveyIds.length === 0) {
          return NextResponse.json({ error: "compareSurveyIds required for cross_survey analysis" }, { status: 400 });
        }
        // Fetch comparison surveys
        const compareSurveys = await db
          .select()
          .from(surveys)
          .where(and(eq(surveys.userId, user.id), inArray(surveys.id, compareSurveyIds)));

        const surveyDataArr = [
          { title: survey.title, questions, responses: responseData },
        ];

        for (const cs of compareSurveys) {
          const csResponses = await db
            .select()
            .from(surveyResponsesV2)
            .where(eq(surveyResponsesV2.surveyId, cs.id));

          surveyDataArr.push({
            title: cs.title,
            questions: cs.questions as SurveyQuestion[],
            responses: csResponses.map((r) => r.responses as Record<string, unknown>),
          });
        }

        systemPrompt = getSurveyCrossSurveyComparisonSystemPrompt(validLocale);
        userPrompt = getSurveyCrossSurveyComparisonUserPrompt(surveyDataArr, validLocale);
        break;
      }
      case "trend": {
        if (!compareSurveyIds || compareSurveyIds.length === 0) {
          return NextResponse.json({ error: "compareSurveyIds required for trend analysis" }, { status: 400 });
        }
        // Fetch all surveys for trend (ordered by date)
        const allSurveyIds = [surveyId, ...compareSurveyIds];
        const allSurveys = await db
          .select()
          .from(surveys)
          .where(and(eq(surveys.userId, user.id), inArray(surveys.id, allSurveyIds)));

        const timeSeriesData = [];
        for (const s of allSurveys.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())) {
          const sResponses = await db
            .select()
            .from(surveyResponsesV2)
            .where(eq(surveyResponsesV2.surveyId, s.id));

          timeSeriesData.push({
            period: new Date(s.createdAt).toISOString().slice(0, 10),
            questions: s.questions as SurveyQuestion[],
            responses: sResponses.map((r) => r.responses as Record<string, unknown>),
          });
        }

        systemPrompt = getSurveyTrendAnalysisSystemPrompt(validLocale);
        userPrompt = getSurveyTrendAnalysisUserPrompt(survey.title, timeSeriesData, validLocale);
        break;
      }
      default:
        return NextResponse.json({ error: "Invalid analysis type" }, { status: 400 });
    }

    // AI call with retry
    const client = getAnthropicClient();
    let message;
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        message = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 12000,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        });
        break;
      } catch (err: unknown) {
        const status = (err as { status?: number }).status;
        if ((status === 529 || status === 429) && attempt < maxRetries - 1) {
          const wait = (attempt + 1) * 5000;
          console.log(`[AI Survey] Retry ${attempt + 1}/${maxRetries} after ${wait}ms (status ${status})`);
          await new Promise((r) => setTimeout(r, wait));
          continue;
        }
        throw err;
      }
    }

    if (!message) {
      return NextResponse.json({ error: "AI servisi yanıt vermedi" }, { status: 502 });
    }

    console.log(`[AI Survey] type=${analysisType} | input=${message.usage.input_tokens} output=${message.usage.output_tokens}`);

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json({ error: "No text response from AI" }, { status: 500 });
    }

    // 3-stage JSON parse
    let parsedResult: unknown;
    const rawText = textContent.text;

    try {
      parsedResult = JSON.parse(rawText.trim());
    } catch {
      try {
        let jsonText = rawText.trim();
        if (jsonText.startsWith("```")) {
          jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
        }
        parsedResult = JSON.parse(jsonText);
      } catch {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          return NextResponse.json({ error: "AI yanıtı işlenemedi" }, { status: 502 });
        }
        parsedResult = JSON.parse(jsonMatch[0]);
      }
    }

    // Save analysis
    const [analysis] = await db.insert(surveyAnalyses).values({
      surveyId,
      userId: user.id,
      analysisType,
      compareSurveyIds: compareSurveyIds || null,
      results: parsedResult,
    }).returning();

    return NextResponse.json(analysis, { status: 201 });
  } catch (error) {
    console.error("AI survey analysis error:", error);
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Survey analysis failed: ${errMessage}` },
      { status: 500 }
    );
  }
}
