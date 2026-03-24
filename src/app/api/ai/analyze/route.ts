import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { games, analyses, gameKpis, gameCompetitors, gameTrends, aiAnalyses } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getAnthropicClient } from "@/lib/ai/client";
import { getAnalyzeSystemPrompt, getAnalyzeUserPrompt } from "@/lib/ai/prompts/analyze";
import { aiAnalysisResponseSchema } from "@/lib/ai/types";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    const kpis = await db.select().from(gameKpis)
      .where(and(eq(gameKpis.gameId, gameId), eq(gameKpis.userId, user.id)));

    const competitors = await db.select().from(gameCompetitors)
      .where(and(eq(gameCompetitors.gameId, gameId), eq(gameCompetitors.userId, user.id)));

    const trends = await db.select().from(gameTrends)
      .where(and(eq(gameTrends.gameId, gameId), eq(gameTrends.userId, user.id)));

    const client = getAnthropicClient();

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system: getAnalyzeSystemPrompt(validLocale),
      messages: [
        {
          role: "user",
          content: getAnalyzeUserPrompt(game, analysis, kpis, competitors, trends),
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json({ error: "No text response from AI" }, { status: 500 });
    }

    const parsed = JSON.parse(textContent.text);
    const validated = aiAnalysisResponseSchema.parse(parsed);

    // Save to DB
    const [aiAnalysis] = await db.insert(aiAnalyses).values({
      gameId,
      userId: user.id,
      executiveSummary: validated.executiveSummary,
      strengths: validated.strengths,
      weaknesses: validated.weaknesses,
      categoryScores: validated.categoryScores,
      verdicts: validated.verdicts,
      fieldReviews: validated.fieldReviews,
      observationLevel: validated.observationLevel,
      observationFeedback: validated.observationFeedback,
      pmLearnings: validated.pmLearnings,
      interviewPrep: validated.interviewPrep,
      benchmarkComparison: validated.benchmarkComparison,
      pmScenario: validated.pmScenario,
      mechanicSuggestions: validated.mechanicSuggestions,
    }).returning();

    return NextResponse.json(aiAnalysis, { status: 201 });
  } catch (error) {
    console.error("AI analyze error:", error);
    return NextResponse.json(
      { error: "AI analysis failed" },
      { status: 500 }
    );
  }
}
