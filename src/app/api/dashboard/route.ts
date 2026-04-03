import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import {
  games,
  aiAnalyses,
  interviewSessions,
  dailyTasks,
  taskStreaks,
  growthReports,
  profiles,
  gddSessions,
} from "@/lib/db/schema";
import { eq, desc, count, avg, and, or, isNull, sql } from "drizzle-orm";

export async function GET(_request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parallel fetch from multiple tables
    const [
      userProfile,
      userGames,
      aiAnalysisCount,
      avgObservation,
      completedInterviews,
      interviewAvgScore,
      completedTaskCount,
      userStreak,
      latestGrowthReport,
      recentGames,
      totalGddsResult,
      activeGddsResult,
      completedGddsResult,
    ] = await Promise.all([
      // User profile
      db.select({ fullName: profiles.fullName }).from(profiles).where(eq(profiles.id, user.id)),
      // Total games count (exclude templates)
      db.select({ value: count() }).from(games).where(and(eq(games.userId, user.id), or(eq(games.isTemplate, false), isNull(games.isTemplate)))),
      // Total AI analyses count
      db.select({ value: count() }).from(aiAnalyses).where(eq(aiAnalyses.userId, user.id)),
      // Average observation level
      db.select({ level: aiAnalyses.observationLevel })
        .from(aiAnalyses)
        .where(eq(aiAnalyses.userId, user.id)),
      // Completed interview sessions count
      db.select({ value: count() }).from(interviewSessions)
        .where(eq(interviewSessions.userId, user.id)),
      // Interview average score
      db.select({ value: avg(interviewSessions.avgScore) }).from(interviewSessions)
        .where(eq(interviewSessions.userId, user.id)),
      // Completed daily tasks count
      db.select({ value: count() }).from(dailyTasks)
        .where(eq(dailyTasks.userId, user.id)),
      // Current streak
      db.select().from(taskStreaks).where(eq(taskStreaks.userId, user.id)),
      // Latest growth report
      db.select({ currentLevel: growthReports.currentLevel })
        .from(growthReports)
        .where(eq(growthReports.userId, user.id))
        .orderBy(desc(growthReports.createdAt))
        .limit(1),
      // Recent 5 games with analysis flag (exclude templates)
      db.select({
        id: games.id,
        title: games.title,
        genre: games.genre,
        platform: games.platform,
        status: games.status,
        createdAt: games.createdAt,
      })
        .from(games)
        .where(and(eq(games.userId, user.id), or(eq(games.isTemplate, false), isNull(games.isTemplate))))
        .orderBy(desc(games.createdAt))
        .limit(5),
      // GDD stats
      db.select({ value: count() }).from(gddSessions).where(eq(gddSessions.userId, user.id)),
      db.select({ value: count() }).from(gddSessions).where(and(eq(gddSessions.userId, user.id), eq(gddSessions.status, "in_progress"))),
      db.select({ value: count() }).from(gddSessions).where(and(eq(gddSessions.userId, user.id), eq(gddSessions.status, "completed"))),
    ]);

    // Calculate average observation level
    const levelMap: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3, professional: 4 };
    const reverseLevelMap: Record<number, string> = { 1: "beginner", 2: "intermediate", 3: "advanced", 4: "professional" };
    let avgLevel = 0;
    if (avgObservation.length > 0) {
      const sum = avgObservation.reduce((acc, a) => acc + (levelMap[a.level as string] || 1), 0);
      avgLevel = Math.round(sum / avgObservation.length);
    }

    // Check which recent games have AI analysis
    const aiAnalyzedGameIds = new Set(
      avgObservation.length > 0
        ? (await db.select({ gameId: aiAnalyses.gameId }).from(aiAnalyses).where(eq(aiAnalyses.userId, user.id))).map(a => a.gameId)
        : []
    );

    // Build recent activity from multiple tables
    const [recentGameActivity, recentAnalysisActivity, recentGddActivity, recentInterviewActivity] = await Promise.all([
      db.select({
        title: games.title,
        createdAt: games.createdAt,
      })
        .from(games)
        .where(and(eq(games.userId, user.id), or(eq(games.isTemplate, false), isNull(games.isTemplate))))
        .orderBy(desc(games.createdAt))
        .limit(5),
      db.select({
        title: games.title,
        createdAt: aiAnalyses.createdAt,
      })
        .from(aiAnalyses)
        .innerJoin(games, eq(aiAnalyses.gameId, games.id))
        .where(eq(aiAnalyses.userId, user.id))
        .orderBy(desc(aiAnalyses.createdAt))
        .limit(5),
      db.select({
        title: gddSessions.title,
        createdAt: gddSessions.createdAt,
        updatedAt: gddSessions.updatedAt,
      })
        .from(gddSessions)
        .where(eq(gddSessions.userId, user.id))
        .orderBy(desc(gddSessions.createdAt))
        .limit(5),
      db.select({
        title: interviewSessions.topic,
        createdAt: interviewSessions.createdAt,
      })
        .from(interviewSessions)
        .where(eq(interviewSessions.userId, user.id))
        .orderBy(desc(interviewSessions.createdAt))
        .limit(5),
    ]);

    const allActivity = [
      ...recentGameActivity.map((g) => ({ type: "game_added" as const, title: g.title, createdAt: g.createdAt })),
      ...recentAnalysisActivity.map((a) => ({ type: "analysis_completed" as const, title: a.title, createdAt: a.createdAt })),
      ...recentGddActivity.map((g) => ({ type: (g.updatedAt > g.createdAt ? "gdd_updated" : "gdd_created") as string, title: g.title, createdAt: g.updatedAt > g.createdAt ? g.updatedAt : g.createdAt })),
      ...recentInterviewActivity.map((i) => ({ type: "interview_completed" as const, title: i.title, createdAt: i.createdAt })),
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    const totalGames = userGames[0]?.value ?? 0;
    const totalAnalyses = aiAnalysisCount[0]?.value ?? 0;
    const avgInterviewScore = interviewAvgScore[0]?.value ? Number(Number(interviewAvgScore[0].value).toFixed(1)) : 0;
    const streak = userStreak[0];
    const pmLevel = latestGrowthReport[0]?.currentLevel || "beginner_pm";

    return NextResponse.json({
      profile: {
        displayName: userProfile[0]?.fullName || user.email?.split("@")[0] || "PM",
      },
      stats: {
        totalGames,
        totalAnalyses,
        avgScore: avgInterviewScore,
        pmLevel,
      },
      interviewStats: {
        completedSessions: completedInterviews[0]?.value ?? 0,
        avgScore: avgInterviewScore,
      },
      taskStats: {
        streak: streak?.currentStreak ?? 0,
        longestStreak: streak?.longestStreak ?? 0,
        totalCompleted: completedTaskCount[0]?.value ?? 0,
      },
      gddStats: {
        totalGdds: totalGddsResult[0]?.value ?? 0,
        activeGdds: activeGddsResult[0]?.value ?? 0,
        completedGdds: completedGddsResult[0]?.value ?? 0,
      },
      recentGames: recentGames.map((g) => ({
        ...g,
        hasAnalysis: aiAnalyzedGameIds.has(g.id),
        createdAt: g.createdAt.toISOString(),
      })),
      recentActivity: allActivity.map((a) => ({
        type: a.type,
        title: a.title,
        createdAt: a.createdAt.toISOString(),
      })),
      observationLevel: reverseLevelMap[avgLevel] || "beginner",
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
