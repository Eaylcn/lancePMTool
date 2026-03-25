import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import {
  profiles,
  games,
  aiAnalyses,
  interviewSessions,
  dailyTasks,
  taskStreaks,
  growthReports,
} from "@/lib/db/schema";
import { eq, desc, count, and, or, isNull } from "drizzle-orm";

interface CategoryScore {
  gameScore: number;
  analysisQuality: number;
}

export async function GET(_request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      profileResult,
      gamesCount,
      allAiAnalyses,
      interviewCount,
      completedTaskCount,
      streakResult,
      latestReport,
      recentGamesList,
      recentInterviews,
      templateGamesList,
    ] = await Promise.all([
      db.select().from(profiles).where(eq(profiles.id, user.id)),
      db.select({ value: count() }).from(games).where(and(eq(games.userId, user.id), or(eq(games.isTemplate, false), isNull(games.isTemplate)))),
      db.select().from(aiAnalyses).where(eq(aiAnalyses.userId, user.id)),
      db.select({ value: count() }).from(interviewSessions).where(eq(interviewSessions.userId, user.id)),
      db.select({ value: count() }).from(dailyTasks).where(eq(dailyTasks.userId, user.id)),
      db.select().from(taskStreaks).where(eq(taskStreaks.userId, user.id)),
      db.select({ currentLevel: growthReports.currentLevel })
        .from(growthReports)
        .where(eq(growthReports.userId, user.id))
        .orderBy(desc(growthReports.createdAt))
        .limit(1),
      db.select({ id: games.id, title: games.title, genre: games.genre, createdAt: games.createdAt })
        .from(games)
        .where(and(eq(games.userId, user.id), or(eq(games.isTemplate, false), isNull(games.isTemplate))))
        .orderBy(desc(games.createdAt))
        .limit(10),
      db.select({ id: interviewSessions.id, topic: interviewSessions.topic, createdAt: interviewSessions.createdAt })
        .from(interviewSessions)
        .where(eq(interviewSessions.userId, user.id))
        .orderBy(desc(interviewSessions.createdAt))
        .limit(5),
      // Template games (separate list)
      db.select({ id: games.id, title: games.title, genre: games.genre, platform: games.platform })
        .from(games)
        .where(and(eq(games.userId, user.id), eq(games.isTemplate, true)))
        .orderBy(desc(games.createdAt)),
    ]);

    // Filter out AI analyses for template games
    const templateGameIds = new Set(templateGamesList.map(g => g.id));
    const userAiAnalyses = allAiAnalyses.filter(a => !templateGameIds.has(a.gameId));

    const profile = profileResult[0];

    // Skill radar calculation (same as growth API)
    const categories = ["ftue", "coreLoop", "monetization", "retention", "uxui", "metaGame", "technical"];
    const categoryTotals: Record<string, { gameScoreSum: number; analysisQualitySum: number; count: number }> = {};
    for (const cat of categories) {
      categoryTotals[cat] = { gameScoreSum: 0, analysisQualitySum: 0, count: 0 };
    }

    const levelMap: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3, professional: 4 };
    let observationLevelSum = 0;

    for (const ai of userAiAnalyses) {
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
    const avgObservationLevel = totalAnalyses > 0
      ? observationLevelSum / totalAnalyses
      : 0;
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

    // Build recent activity timeline
    type Activity = { type: string; title: string; date: string };
    const activities: Activity[] = [];

    for (const g of recentGamesList) {
      activities.push({ type: "game_added", title: g.title, date: g.createdAt.toISOString() });
    }
    for (const ai of userAiAnalyses.slice(0, 5)) {
      const game = recentGamesList.find(g => g.id === ai.gameId);
      activities.push({ type: "analysis_completed", title: game?.title || "—", date: ai.createdAt.toISOString() });
    }
    for (const iv of recentInterviews) {
      activities.push({ type: "interview_completed", title: iv.topic, date: iv.createdAt.toISOString() });
    }

    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const streak = streakResult[0];
    const pmLevel = latestReport[0]?.currentLevel || "beginner_pm";

    return NextResponse.json({
      profile: {
        fullName: profile?.fullName || user.user_metadata?.full_name || "",
        username: profile?.username || "",
        avatarUrl: profile?.avatarUrl || user.user_metadata?.avatar_url || "",
        title: profile?.title || "",
        bio: profile?.bio || "",
        role: profile?.role || "free",
        createdAt: profile?.createdAt?.toISOString() || "",
      },
      stats: {
        totalGames: gamesCount[0]?.value ?? 0,
        totalAnalyses,
        interviewSessions: interviewCount[0]?.value ?? 0,
        totalTasks: completedTaskCount[0]?.value ?? 0,
        currentStreak: streak?.currentStreak ?? 0,
        observationLevel,
        pmLevel,
      },
      skillRadar,
      recentActivity: activities.slice(0, 10),
      templateGames: templateGamesList.map(g => {
        const hasAnalysis = allAiAnalyses.some(a => a.gameId === g.id);
        return { id: g.id, title: g.title, genre: g.genre, platform: g.platform, hasAnalysis };
      }),
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { fullName, title, bio, username } = body;

    // Validate username uniqueness if provided
    if (username) {
      const [existing] = await db.select({ id: profiles.id })
        .from(profiles)
        .where(eq(profiles.username, username));

      if (existing && existing.id !== user.id) {
        return NextResponse.json({ error: "Username already taken" }, { status: 409 });
      }
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (fullName !== undefined) updateData.fullName = fullName;
    if (title !== undefined) updateData.title = title;
    if (bio !== undefined) updateData.bio = bio;
    if (username !== undefined) updateData.username = username;

    const [updated] = await db.update(profiles)
      .set(updateData)
      .where(eq(profiles.id, user.id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
