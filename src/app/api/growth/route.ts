import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { games, analyses, aiAnalyses } from "@/lib/db/schema";
import { eq, desc, and, or, isNull } from "drizzle-orm";

interface CategoryScore {
  gameScore: number;
  analysisQuality: number;
  comment?: string;
}

export async function GET(_request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all user data in parallel
    const [userGames, userAnalyses, allAiAnalyses, templateGames] = await Promise.all([
      db.select().from(games).where(and(eq(games.userId, user.id), or(eq(games.isTemplate, false), isNull(games.isTemplate)))).orderBy(desc(games.createdAt)),
      db.select().from(analyses).where(eq(analyses.userId, user.id)),
      db.select().from(aiAnalyses).where(eq(aiAnalyses.userId, user.id)),
      db.select({ id: games.id }).from(games).where(and(eq(games.userId, user.id), eq(games.isTemplate, true))),
    ]);

    // Filter out template game analyses
    const templateGameIds = new Set(templateGames.map(g => g.id));
    const userAiAnalyses = allAiAnalyses.filter(a => !templateGameIds.has(a.gameId));

    // Build analysis map (gameId -> analysis)
    const analysisMap = new Map(userAnalyses.map(a => [a.gameId, a]));
    const aiAnalysisMap = new Map(userAiAnalyses.map(a => [a.gameId, a]));

    // Stats
    const totalGames = userGames.length;
    const totalAnalyses = userAiAnalyses.length;
    const genreSet = new Set<string>();
    const genreCount: Record<string, number> = {};

    for (const game of userGames) {
      const genres = Array.isArray(game.genre) ? (game.genre as string[]) : [];
      for (const g of genres) {
        genreSet.add(g);
        genreCount[g] = (genreCount[g] || 0) + 1;
      }
    }

    // Calculate average observation level and quality
    const categories = ["ftue", "coreLoop", "monetization", "retention", "uxui", "metaGame", "technical"];
    const categoryTotals: Record<string, { gameScoreSum: number; analysisQualitySum: number; count: number }> = {};
    for (const cat of categories) {
      categoryTotals[cat] = { gameScoreSum: 0, analysisQualitySum: 0, count: 0 };
    }

    let observationLevelSum = 0;
    const levelMap: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3, professional: 4 };

    for (const ai of userAiAnalyses) {
      const level = ai.observationLevel as string | null;
      if (level && levelMap[level]) {
        observationLevelSum += levelMap[level];
      }

      const scores = ai.categoryScores as Record<string, CategoryScore> | null;
      if (scores) {
        for (const cat of categories) {
          if (scores[cat]) {
            categoryTotals[cat].gameScoreSum += scores[cat].gameScore || 0;
            categoryTotals[cat].analysisQualitySum += scores[cat].analysisQuality || 0;
            categoryTotals[cat].count += 1;
          }
        }
      }
    }

    const avgObservationLevel = totalAnalyses > 0
      ? observationLevelSum / totalAnalyses
      : 0;

    const avgObservationLabel = avgObservationLevel < 1.5 ? "beginner"
      : avgObservationLevel < 2.5 ? "intermediate"
      : avgObservationLevel < 3.5 ? "advanced"
      : "professional";

    // Skill radar data
    const skillRadar = categories.map(cat => ({
      category: cat,
      avgGameScore: categoryTotals[cat].count > 0
        ? Number((categoryTotals[cat].gameScoreSum / categoryTotals[cat].count).toFixed(1))
        : 0,
      avgAnalysisQuality: categoryTotals[cat].count > 0
        ? Number((categoryTotals[cat].analysisQualitySum / categoryTotals[cat].count).toFixed(1))
        : 0,
    }));

    // Observation level trend (per game, chronological)
    const observationTrend = userGames
      .filter(g => aiAnalysisMap.has(g.id))
      .map(g => {
        const ai = aiAnalysisMap.get(g.id)!;
        return {
          gameTitle: g.title,
          level: (ai.observationLevel as string) || "beginner",
          levelNumeric: levelMap[(ai.observationLevel as string) || "beginner"] || 1,
          date: g.createdAt.toISOString(),
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Evaluation history
    const evaluationHistory = userGames
      .filter(g => aiAnalysisMap.has(g.id))
      .map(g => {
        const ai = aiAnalysisMap.get(g.id)!;
        const scores = ai.categoryScores as Record<string, CategoryScore> | null;
        let avgGameScore = 0;
        let avgAnalysisQuality = 0;
        if (scores) {
          const vals = Object.values(scores);
          avgGameScore = vals.reduce((s, v) => s + (v.gameScore || 0), 0) / (vals.length || 1);
          avgAnalysisQuality = vals.reduce((s, v) => s + (v.analysisQuality || 0), 0) / (vals.length || 1);
        }
        return {
          gameId: g.id,
          gameTitle: g.title,
          avgGameScore: Number(avgGameScore.toFixed(1)),
          avgAnalysisQuality: Number(avgAnalysisQuality.toFixed(1)),
          observationLevel: (ai.observationLevel as string) || "beginner",
          date: g.createdAt.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Analysis history (all games)
    const analysisHistory = userGames.map(g => ({
      gameId: g.id,
      gameTitle: g.title,
      genre: g.genre || [],
      platform: g.platform,
      overallRating: g.overallRating,
      hasAnalysis: analysisMap.has(g.id),
      hasAiAnalysis: aiAnalysisMap.has(g.id),
      observationLevel: aiAnalysisMap.has(g.id)
        ? (aiAnalysisMap.get(g.id)!.observationLevel as string)
        : null,
      createdAt: g.createdAt.toISOString(),
    }));

    // Average analysis quality across all categories
    let totalQualitySum = 0;
    let totalQualityCount = 0;
    for (const cat of categories) {
      if (categoryTotals[cat].count > 0) {
        totalQualitySum += categoryTotals[cat].analysisQualitySum / categoryTotals[cat].count;
        totalQualityCount++;
      }
    }
    const avgAnalysisQuality = totalQualityCount > 0
      ? Number((totalQualitySum / totalQualityCount).toFixed(1))
      : 0;

    return NextResponse.json({
      stats: {
        totalGames,
        totalAnalyses,
        aiAnalyzedCount: totalAnalyses,
        averageObservationLevel: avgObservationLabel,
        averageAnalysisQuality: avgAnalysisQuality,
        genreCount: genreSet.size,
      },
      observationTrend,
      skillRadar,
      evaluationHistory,
      analysisHistory,
      genreDistribution: genreCount,
    });
  } catch (error) {
    console.error("Growth data error:", error);
    return NextResponse.json({ error: "Failed to fetch growth data" }, { status: 500 });
  }
}
