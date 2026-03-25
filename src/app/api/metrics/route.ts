import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { metricAnalyses, games } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(_request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await db
      .select({
        id: metricAnalyses.id,
        gameId: metricAnalyses.gameId,
        gameTitle: games.title,
        rawMetrics: metricAnalyses.rawMetrics,
        derivedMetrics: metricAnalyses.derivedMetrics,
        aiAnalysis: metricAnalyses.aiAnalysis,
        createdAt: metricAnalyses.createdAt,
      })
      .from(metricAnalyses)
      .leftJoin(games, eq(metricAnalyses.gameId, games.id))
      .where(eq(metricAnalyses.userId, user.id))
      .orderBy(desc(metricAnalyses.createdAt));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Metrics fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
