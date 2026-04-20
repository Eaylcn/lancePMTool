import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { games, analyses, gameKpis, gameCompetitors, gameTrends, aiAnalyses } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getAnthropicClient } from "@/lib/ai/client";
import { getAnalyzeSystemPrompt, getAnalyzeUserPrompt } from "@/lib/ai/prompts/analyze";
import { aiAnalysisResponseSchema } from "@/lib/ai/types";
import { requirePro } from "@/lib/auth/require-pro";

export async function POST(request: NextRequest) {
  const auth = await requirePro();
  if (!auth.ok) return auth.response;
  const user = auth.user;

  const body = await request.json();
  const { gameId, locale } = body;

  if (!gameId) {
    return NextResponse.json({ error: "gameId is required" }, { status: 400 });
  }

  const validLocale = locale === "en" ? "en" : "tr";

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI service is not configured. Please set ANTHROPIC_API_KEY in .env.local" },
      { status: 503 }
    );
  }

  try {
    // Fetch all data
    const [game] = await db.select().from(games)
      .where(and(eq(games.id, gameId), eq(games.userId, user.id)));

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const [analysis] = await db.select().from(analyses)
      .where(and(eq(analyses.gameId, gameId), eq(analyses.userId, user.id)));

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    // Minimum data validation
    const hasFtue = !!(analysis.ftueFirstImpression?.trim());
    const hasCoreLoop = !!(analysis.coreLoopDefinition?.trim());
    const hasOverall = !!(analysis.overallLearnings?.trim());
    const hasBestFeature = !!(analysis.overallBestFeature?.trim());

    if (!hasFtue && !hasCoreLoop && !hasOverall && !hasBestFeature) {
      return NextResponse.json(
        { error: "Önce bazı analiz notları doldurmalısın." },
        { status: 400 }
      );
    }

    const [kpis, competitors, trends] = await Promise.all([
      db.select().from(gameKpis)
        .where(and(eq(gameKpis.gameId, gameId), eq(gameKpis.userId, user.id))),
      db.select().from(gameCompetitors)
        .where(and(eq(gameCompetitors.gameId, gameId), eq(gameCompetitors.userId, user.id))),
      db.select().from(gameTrends)
        .where(and(eq(gameTrends.gameId, gameId), eq(gameTrends.userId, user.id))),
    ]);

    const client = getAnthropicClient();

    // Retry with backoff for overloaded/rate-limit errors
    let message;
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        message = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 16000,
          system: getAnalyzeSystemPrompt(validLocale),
          messages: [
            {
              role: "user",
              content: getAnalyzeUserPrompt(game, analysis, kpis, competitors, trends),
            },
          ],
        });
        break;
      } catch (err: unknown) {
        const status = (err as { status?: number }).status;
        if ((status === 529 || status === 429) && attempt < maxRetries - 1) {
          const wait = (attempt + 1) * 5000;
          console.log(`[AI Analyze] Retry ${attempt + 1}/${maxRetries} after ${wait}ms (status ${status})`);
          await new Promise(r => setTimeout(r, wait));
          continue;
        }
        throw err;
      }
    }

    if (!message) {
      return NextResponse.json({ error: "AI servisi yanıt vermedi" }, { status: 502 });
    }

    // Token usage logging
    console.log(`[AI Analyze] game=${game.title} | input=${message.usage.input_tokens} output=${message.usage.output_tokens}`);

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json({ error: "No text response from AI" }, { status: 500 });
    }

    // 3-stage JSON parse
    let parsed: unknown;
    const rawText = textContent.text;

    try {
      // Stage 1: Direct parse
      parsed = JSON.parse(rawText.trim());
    } catch {
      try {
        // Stage 2: Strip markdown code fences
        let jsonText = rawText.trim();
        if (jsonText.startsWith("```")) {
          jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
        }
        parsed = JSON.parse(jsonText);
      } catch {
        // Stage 3: Regex extract JSON object
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          return NextResponse.json({ error: "AI yanıtı işlenemedi" }, { status: 502 });
        }
        parsed = JSON.parse(jsonMatch[0]);
      }
    }

    const validated = aiAnalysisResponseSchema.parse(parsed);

    // Upsert: check if existing analysis exists
    const [existing] = await db.select({ id: aiAnalyses.id }).from(aiAnalyses)
      .where(and(eq(aiAnalyses.gameId, gameId), eq(aiAnalyses.userId, user.id)));

    const aiData = {
      executiveSummary: validated.executiveSummary,
      overallScoreJustification: validated.overallScoreJustification,
      strengths: validated.strengths,
      weaknesses: validated.weaknesses,
      categoryScores: validated.categoryScores,
      verdicts: validated.verdicts,
      fieldReviews: validated.fieldReviews,
      kpiTrendsInsight: validated.kpiTrendsInsight,
      observationLevel: validated.observationLevel,
      observationFeedback: validated.observationFeedback,
      pmLearnings: validated.pmLearnings,
      interviewPrep: validated.interviewPrep,
      benchmarkComparison: validated.benchmarkComparison,
      pmScenario: validated.pmScenario,
      mechanicSuggestions: validated.mechanicSuggestions,
    };

    let aiAnalysis;

    if (existing) {
      // UPDATE
      [aiAnalysis] = await db.update(aiAnalyses)
        .set(aiData)
        .where(eq(aiAnalyses.id, existing.id))
        .returning();
    } else {
      // INSERT
      [aiAnalysis] = await db.insert(aiAnalyses).values({
        gameId,
        userId: user.id,
        ...aiData,
      }).returning();
    }

    return NextResponse.json(aiAnalysis, { status: existing ? 200 : 201 });
  } catch (error) {
    console.error("AI analyze error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `AI analysis failed: ${message}` },
      { status: 500 }
    );
  }
}
