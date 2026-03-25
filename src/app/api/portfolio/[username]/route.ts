import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  profiles,
  games,
  aiAnalyses,
  interviewSessions,
  taskStreaks,
  growthReports,
} from "@/lib/db/schema";
import { eq, desc, count, and, or, isNull } from "drizzle-orm";

interface CategoryScore {
  gameScore: number;
  analysisQuality: number;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    // Find profile by username
    const [profile] = await db.select().from(profiles)
      .where(eq(profiles.username, username));

    if (!profile) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    const userId = profile.id;

    // Parallel fetch public data
    const [
      gamesCount,
      allAiAnalyses,
      interviewCount,
      streakResult,
      latestReport,
      userGames,
      templateGamesList,
    ] = await Promise.all([
      db.select({ value: count() }).from(games).where(and(eq(games.userId, userId), or(eq(games.isTemplate, false), isNull(games.isTemplate)))),
      db.select().from(aiAnalyses).where(eq(aiAnalyses.userId, userId)),
      db.select({ value: count() }).from(interviewSessions).where(eq(interviewSessions.userId, userId)),
      db.select().from(taskStreaks).where(eq(taskStreaks.userId, userId)),
      db.select({ currentLevel: growthReports.currentLevel })
        .from(growthReports)
        .where(eq(growthReports.userId, userId))
        .orderBy(desc(growthReports.createdAt))
        .limit(1),
      db.select({ id: games.id, title: games.title, genre: games.genre, platform: games.platform })
        .from(games)
        .where(and(eq(games.userId, userId), or(eq(games.isTemplate, false), isNull(games.isTemplate))))
        .orderBy(desc(games.createdAt))
        .limit(20),
      // Template games
      db.select({ id: games.id, title: games.title, genre: games.genre, platform: games.platform })
        .from(games)
        .where(and(eq(games.userId, userId), eq(games.isTemplate, true)))
        .orderBy(desc(games.createdAt)),
    ]);

    // Filter out AI analyses for template games
    const templateGameIds = new Set(templateGamesList.map(g => g.id));
    const userAiAnalyses = allAiAnalyses.filter(a => !templateGameIds.has(a.gameId));

    // Skill radar
    const categories = ["ftue", "coreLoop", "monetization", "retention", "uxui", "metaGame", "technical"];
    const categoryTotals: Record<string, { gameScoreSum: number; analysisQualitySum: number; count: number }> = {};
    for (const cat of categories) {
      categoryTotals[cat] = { gameScoreSum: 0, analysisQualitySum: 0, count: 0 };
    }

    const levelMap: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3, professional: 4 };
    let observationLevelSum = 0;

    const aiGameIds = new Set<string>();
    for (const ai of userAiAnalyses) {
      aiGameIds.add(ai.gameId);
      const level = ai.observationLevel as string | null;
      if (level && levelMap[level]) observationLevelSum += levelMap[level];

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

    const totalAnalyses = userAiAnalyses.length;
    const avgObservationLevel = totalAnalyses > 0 ? observationLevelSum / totalAnalyses : 0;
    const observationLevel = avgObservationLevel < 1.5 ? "beginner"
      : avgObservationLevel < 2.5 ? "intermediate"
      : avgObservationLevel < 3.5 ? "advanced"
      : "professional";

    const skillRadar = categories.map(cat => ({
      category: cat,
      avgGameScore: categoryTotals[cat].count > 0
        ? Number((categoryTotals[cat].gameScoreSum / categoryTotals[cat].count).toFixed(1))
        : 0,
      avgAnalysisQuality: categoryTotals[cat].count > 0
        ? Number((categoryTotals[cat].analysisQualitySum / categoryTotals[cat].count).toFixed(1))
        : 0,
    }));

    const pmLevel = latestReport[0]?.currentLevel || "beginner_pm";

    return NextResponse.json({
      profile: {
        fullName: profile.fullName || "",
        username: profile.username || "",
        avatarUrl: profile.avatarUrl || "",
        title: profile.title || "",
        bio: profile.bio || "",
        createdAt: profile.createdAt.toISOString(),
      },
      stats: {
        totalGames: gamesCount[0]?.value ?? 0,
        totalAnalyses,
        interviewSessions: interviewCount[0]?.value ?? 0,
        currentStreak: streakResult[0]?.currentStreak ?? 0,
        observationLevel,
        pmLevel,
      },
      skillRadar,
      games: userGames.map(g => ({
        id: g.id,
        title: g.title,
        genre: g.genre,
        platform: g.platform,
        hasAnalysis: aiGameIds.has(g.id),
      })),
      templateGames: templateGamesList.map(g => ({
        id: g.id,
        title: g.title,
        genre: g.genre,
        platform: g.platform,
        hasAnalysis: allAiAnalyses.some(a => a.gameId === g.id),
      })),
    });
  } catch (error) {
    console.error("Portfolio fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
  }
}
