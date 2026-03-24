import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { analyses, gameKpis, gameCompetitors, gameTrends } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { gameId, analysis: analysisData, kpis, competitors, trends } = body;

  if (!gameId) {
    return NextResponse.json({ error: "gameId is required" }, { status: 400 });
  }

  // Insert analysis
  const [analysis] = await db.insert(analyses).values({
    gameId,
    userId: user.id,
    // FTUE
    ftueFirstImpression: analysisData.ftueFirstImpression || null,
    ftueOnboardingType: analysisData.ftueOnboardingType || null,
    ftueDuration: analysisData.ftueDuration || null,
    ftueFrictionPoints: analysisData.ftueFrictionPoints || null,
    ftuePermissionTiming: analysisData.ftuePermissionTiming || null,
    ftueRating: analysisData.ftueRating?.toString() || null,
    ftueNotes: analysisData.ftueNotes || null,
    // Core Loop
    coreLoopDefinition: analysisData.coreLoopDefinition || null,
    coreLoopSessionLength: analysisData.coreLoopSessionLength || null,
    coreLoopMasteryCurve: analysisData.coreLoopMasteryCurve || null,
    coreLoopVariety: analysisData.coreLoopVariety || null,
    coreLoopRating: analysisData.coreLoopRating?.toString() || null,
    coreLoopNotes: analysisData.coreLoopNotes || null,
    // Monetization
    monetizationModel: analysisData.monetizationModel || null,
    monetizationIap: analysisData.monetizationIap || null,
    monetizationAds: analysisData.monetizationAds || null,
    monetizationBattlePass: analysisData.monetizationBattlePass || null,
    monetizationVip: analysisData.monetizationVip || null,
    monetizationRating: analysisData.monetizationRating?.toString() || null,
    monetizationNotes: analysisData.monetizationNotes || null,
    // Retention
    retentionRewards: analysisData.retentionRewards || null,
    retentionEnergy: analysisData.retentionEnergy || null,
    retentionNotifications: analysisData.retentionNotifications || null,
    retentionFomo: analysisData.retentionFomo || null,
    retentionSocial: analysisData.retentionSocial || null,
    retentionStreak: analysisData.retentionStreak || null,
    retentionRating: analysisData.retentionRating?.toString() || null,
    retentionNotes: analysisData.retentionNotes || null,
    // UX/UI
    uxMenu: analysisData.uxMenu || null,
    uxButtons: analysisData.uxButtons || null,
    uxLoading: analysisData.uxLoading || null,
    uxHud: analysisData.uxHud || null,
    uxAccessibility: analysisData.uxAccessibility || null,
    uxRating: analysisData.uxRating?.toString() || null,
    uxNotes: analysisData.uxNotes || null,
    // Meta
    metaSystems: analysisData.metaSystems || null,
    metaLongTerm: analysisData.metaLongTerm || null,
    metaRating: analysisData.metaRating?.toString() || null,
    metaNotes: analysisData.metaNotes || null,
    // Technical
    techLoadTime: analysisData.techLoadTime || null,
    techFps: analysisData.techFps || null,
    techBattery: analysisData.techBattery || null,
    techOffline: analysisData.techOffline || null,
    techSize: analysisData.techSize || null,
    techRating: analysisData.techRating?.toString() || null,
    techNotes: analysisData.techNotes || null,
    // Overall
    overallBestFeature: analysisData.overallBestFeature || null,
    overallWorstFeature: analysisData.overallWorstFeature || null,
    overallUniqueMechanic: analysisData.overallUniqueMechanic || null,
    overallTargetAudience: analysisData.overallTargetAudience || null,
    overallLearnings: analysisData.overallLearnings || null,
    // Meta fields
    genreSpecificFields: analysisData.genreSpecificFields || {},
    aiFilledFields: analysisData.aiFilledFields || [],
  }).returning();

  // Insert KPIs if provided
  if (kpis && (kpis.downloads || kpis.revenue || kpis.dau || kpis.mau)) {
    await db.insert(gameKpis).values({
      gameId,
      userId: user.id,
      period: kpis.period || null,
      downloads: kpis.downloads || null,
      revenue: kpis.revenue?.toString() || null,
      dau: kpis.dau || null,
      mau: kpis.mau || null,
      rating: kpis.rating?.toString() || null,
      chartPosition: kpis.chartPosition || null,
    });
  }

  // Insert competitors
  if (competitors && competitors.length > 0) {
    await db.insert(gameCompetitors).values(
      competitors.map((c: { competitorName: string; relationship: string; notes: string }) => ({
        gameId,
        userId: user.id,
        competitorName: c.competitorName,
        relationship: c.relationship || null,
        notes: c.notes || null,
      }))
    );
  }

  // Insert trends
  if (trends && trends.length > 0) {
    await db.insert(gameTrends).values(
      trends.map((t: { trendType: string; title: string; impact: string; description: string }) => ({
        gameId,
        userId: user.id,
        trendType: t.trendType || null,
        title: t.title || null,
        impact: t.impact || null,
        description: t.description || null,
      }))
    );
  }

  return NextResponse.json(analysis, { status: 201 });
}
