import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { analyses, gameKpis, gameCompetitors, gameTrends, aiAnalyses } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { gameId } = await params;

  const [analysis] = await db.select().from(analyses)
    .where(and(eq(analyses.gameId, gameId), eq(analyses.userId, user.id)));

  const kpis = await db.select().from(gameKpis)
    .where(and(eq(gameKpis.gameId, gameId), eq(gameKpis.userId, user.id)));

  const competitors = await db.select().from(gameCompetitors)
    .where(and(eq(gameCompetitors.gameId, gameId), eq(gameCompetitors.userId, user.id)));

  const trends = await db.select().from(gameTrends)
    .where(and(eq(gameTrends.gameId, gameId), eq(gameTrends.userId, user.id)));

  const [aiAnalysis] = await db.select().from(aiAnalyses)
    .where(and(eq(aiAnalyses.gameId, gameId), eq(aiAnalyses.userId, user.id)));

  return NextResponse.json({
    analysis: analysis || null,
    kpis,
    competitors,
    trends,
    aiAnalysis: aiAnalysis || null,
  });
}
