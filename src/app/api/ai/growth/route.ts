import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { games, aiAnalyses, growthReports } from "@/lib/db/schema";
import { eq, desc, and, or, isNull } from "drizzle-orm";
import { getAnthropicClient } from "@/lib/ai/client";
import { getGrowthSystemPrompt, getGrowthUserPrompt } from "@/lib/ai/prompts/growth";
import { growthReportAiResultSchema } from "@/lib/ai/types";
import { requirePro } from "@/lib/auth/require-pro";

interface CategoryScore {
  gameScore: number;
  analysisQuality: number;
}

export async function POST(request: NextRequest) {
  const auth = await requirePro();
  if (!auth.ok) return auth.response;
  const user = auth.user;

  const body = await request.json();
  const { locale } = body;
  const validLocale = locale === "en" ? "en" : "tr";

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI service is not configured. Please set ANTHROPIC_API_KEY in .env.local" },
      { status: 503 }
    );
  }

  try {
    // Fetch user's games and AI analyses (exclude templates)
    const [userGames, allAiAnalyses, templateGames] = await Promise.all([
      db.select().from(games).where(and(eq(games.userId, user.id), or(eq(games.isTemplate, false), isNull(games.isTemplate)))).orderBy(desc(games.createdAt)),
      db.select().from(aiAnalyses).where(eq(aiAnalyses.userId, user.id)),
      db.select({ id: games.id }).from(games).where(and(eq(games.userId, user.id), eq(games.isTemplate, true))),
    ]);

    const templateGameIds = new Set(templateGames.map(g => g.id));
    const userAiAnalyses = allAiAnalyses.filter(a => !templateGameIds.has(a.gameId));

    if (userAiAnalyses.length === 0) {
      return NextResponse.json(
        { error: "En az bir AI analizi gerekli. Önce bir oyun analizi yap." },
        { status: 400 }
      );
    }

    const aiMap = new Map(userAiAnalyses.map(a => [a.gameId, a]));

    // Build genre distribution
    const genreDistribution: Record<string, number> = {};
    for (const game of userGames) {
      const genres = Array.isArray(game.genre) ? (game.genre as string[]) : [];
      for (const g of genres) {
        genreDistribution[g] = (genreDistribution[g] || 0) + 1;
      }
    }

    // Build per-game data
    const categories = ["ftue", "coreLoop", "monetization", "retention", "uxui", "metaGame", "technical"];
    const avgCategoryScores: Record<string, { totalGame: number; totalAnalysis: number; count: number }> = {};
    for (const cat of categories) {
      avgCategoryScores[cat] = { totalGame: 0, totalAnalysis: 0, count: 0 };
    }

    const gamesData = userGames
      .filter(g => aiMap.has(g.id))
      .map(g => {
        const ai = aiMap.get(g.id)!;
        const scores = ai.categoryScores as Record<string, CategoryScore> | null;

        if (scores) {
          for (const cat of categories) {
            if (scores[cat]) {
              avgCategoryScores[cat].totalGame += scores[cat].gameScore || 0;
              avgCategoryScores[cat].totalAnalysis += scores[cat].analysisQuality || 0;
              avgCategoryScores[cat].count += 1;
            }
          }
        }

        return {
          title: g.title,
          genre: g.genre,
          createdAt: g.createdAt.toISOString().split("T")[0],
          observationLevel: ai.observationLevel as string | null,
          categoryScores: scores as Record<string, { gameScore: number; analysisQuality: number }> | null,
          overallRating: g.overallRating,
        };
      });

    const averageCategoryScores: Record<string, { avgGameScore: number; avgAnalysisQuality: number }> = {};
    for (const cat of categories) {
      const d = avgCategoryScores[cat];
      averageCategoryScores[cat] = {
        avgGameScore: d.count > 0 ? Number((d.totalGame / d.count).toFixed(1)) : 0,
        avgAnalysisQuality: d.count > 0 ? Number((d.totalAnalysis / d.count).toFixed(1)) : 0,
      };
    }

    const client = getAnthropicClient();

    // Retry with backoff
    let message;
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        message = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8000,
          system: getGrowthSystemPrompt(validLocale),
          messages: [
            {
              role: "user",
              content: getGrowthUserPrompt({
                totalAnalyses: userAiAnalyses.length,
                totalGames: userGames.length,
                games: gamesData,
                genreDistribution,
                averageCategoryScores,
              }),
            },
          ],
        });
        break;
      } catch (err: unknown) {
        const status = (err as { status?: number }).status;
        if ((status === 529 || status === 429) && attempt < maxRetries - 1) {
          const wait = (attempt + 1) * 5000;
          console.log(`[AI Growth] Retry ${attempt + 1}/${maxRetries} after ${wait}ms (status ${status})`);
          await new Promise(r => setTimeout(r, wait));
          continue;
        }
        throw err;
      }
    }

    if (!message) {
      return NextResponse.json({ error: "AI servisi yanıt vermedi" }, { status: 502 });
    }

    console.log(`[AI Growth] input=${message.usage.input_tokens} output=${message.usage.output_tokens}`);

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return NextResponse.json({ error: "No text response from AI" }, { status: 500 });
    }

    // 3-stage JSON parse
    let parsed: unknown;
    const rawText = textContent.text;

    try {
      parsed = JSON.parse(rawText.trim());
    } catch {
      try {
        let jsonText = rawText.trim();
        if (jsonText.startsWith("```")) {
          jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
        }
        parsed = JSON.parse(jsonText);
      } catch {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          return NextResponse.json({ error: "AI yanıtı işlenemedi" }, { status: 502 });
        }
        parsed = JSON.parse(jsonMatch[0]);
      }
    }

    const validated = growthReportAiResultSchema.parse(parsed);

    // Insert new growth report
    const [report] = await db.insert(growthReports).values({
      userId: user.id,
      currentLevel: validated.currentLevel,
      overallAssessment: validated.overallAssessment,
      strengths: validated.strengths,
      weaknesses: validated.weaknesses,
      trendAnalysis: validated.trendAnalysis,
      genreDiversity: validated.genreDiversity,
      actionPlan: validated.actionPlan,
      interviewReadiness: validated.interviewReadiness,
    }).returning();

    return NextResponse.json({ ...report, overallScore: validated.overallScore }, { status: 201 });
  } catch (error) {
    console.error("AI growth error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `AI growth report failed: ${msg}` }, { status: 500 });
  }
}
