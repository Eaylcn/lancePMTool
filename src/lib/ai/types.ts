import { z } from "zod";

// Draft Fill response schema
export const draftFillResponseSchema = z.object({
  analysis: z.object({
    // FTUE
    ftueFirstImpression: z.string().optional(),
    ftueOnboardingType: z.string().optional(),
    ftueDuration: z.string().optional(),
    ftueFrictionPoints: z.string().optional(),
    ftuePermissionTiming: z.string().optional(),
    ftueRating: z.number().min(0).max(10).optional(),
    ftueNotes: z.string().optional(),

    // Core Loop
    coreLoopDefinition: z.string().optional(),
    coreLoopSessionLength: z.string().optional(),
    coreLoopMasteryCurve: z.string().optional(),
    coreLoopVariety: z.string().optional(),
    coreLoopRating: z.number().min(0).max(10).optional(),
    coreLoopNotes: z.string().optional(),

    // Monetization
    monetizationModel: z.string().optional(),
    monetizationIap: z.string().optional(),
    monetizationAds: z.string().optional(),
    monetizationBattlePass: z.string().optional(),
    monetizationVip: z.string().optional(),
    monetizationRating: z.number().min(0).max(10).optional(),
    monetizationNotes: z.string().optional(),

    // Retention
    retentionRewards: z.string().optional(),
    retentionEnergy: z.string().optional(),
    retentionNotifications: z.string().optional(),
    retentionFomo: z.string().optional(),
    retentionSocial: z.string().optional(),
    retentionStreak: z.string().optional(),
    retentionRating: z.number().min(0).max(10).optional(),
    retentionNotes: z.string().optional(),

    // UX/UI
    uxMenu: z.string().optional(),
    uxButtons: z.string().optional(),
    uxLoading: z.string().optional(),
    uxHud: z.string().optional(),
    uxAccessibility: z.string().optional(),
    uxRating: z.number().min(0).max(10).optional(),
    uxNotes: z.string().optional(),

    // Meta Game
    metaSystems: z.string().optional(),
    metaLongTerm: z.string().optional(),
    metaRating: z.number().min(0).max(10).optional(),
    metaNotes: z.string().optional(),

    // Technical
    techLoadTime: z.string().optional(),
    techFps: z.string().optional(),
    techBattery: z.string().optional(),
    techOffline: z.string().optional(),
    techSize: z.string().optional(),
    techRating: z.number().min(0).max(10).optional(),
    techNotes: z.string().optional(),

    // Overall
    overallBestFeature: z.string().optional(),
    overallWorstFeature: z.string().optional(),
    overallUniqueMechanic: z.string().optional(),
    overallTargetAudience: z.string().optional(),
    overallLearnings: z.string().optional(),
  }),
  genreSpecificFields: z.record(z.string(), z.record(z.string(), z.string())).optional(),
  kpis: z.object({
    period: z.string().optional(),
    downloads: z.number().optional(),
    revenue: z.number().optional(),
    dau: z.number().optional(),
    mau: z.number().optional(),
    rating: z.number().optional(),
    chartPosition: z.number().optional(),
  }).optional(),
  competitors: z.array(z.object({
    competitorName: z.string(),
    relationship: z.string(),
    notes: z.string(),
  })).optional(),
  trends: z.array(z.object({
    trendType: z.string(),
    title: z.string(),
    impact: z.string(),
    description: z.string(),
  })).optional(),
  filledFields: z.array(z.string()),
});

export type DraftFillResponse = z.infer<typeof draftFillResponseSchema>;

// AI Analysis response schema
export const aiAnalysisResponseSchema = z.object({
  executiveSummary: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  categoryScores: z.record(z.string(), z.object({
    gameScore: z.number().min(0).max(10),
    analysisQuality: z.number().min(0).max(10),
    comment: z.string(),
  })),
  verdicts: z.array(z.object({
    category: z.string(),
    verdict: z.string(),
    recommendation: z.string(),
  })),
  fieldReviews: z.record(z.string(), z.object({
    quality: z.string(),
    suggestion: z.string(),
  })),
  observationLevel: z.enum(["beginner", "intermediate", "advanced", "professional"]),
  observationFeedback: z.object({
    level: z.string(),
    strengths: z.array(z.string()),
    improvements: z.array(z.string()),
    nextSteps: z.array(z.string()),
  }),
  pmLearnings: z.array(z.object({
    topic: z.string(),
    insight: z.string(),
    actionable: z.string(),
  })),
  interviewPrep: z.array(z.object({
    question: z.string(),
    suggestedAnswer: z.string(),
    category: z.string(),
  })),
  benchmarkComparison: z.object({
    similarGames: z.array(z.string()),
    standoutFeatures: z.array(z.string()),
    industryPosition: z.string(),
  }),
  pmScenario: z.object({
    scenario: z.string(),
    challenge: z.string(),
    suggestedApproach: z.string(),
  }),
  mechanicSuggestions: z.array(z.object({
    mechanic: z.string(),
    reason: z.string(),
    implementation: z.string(),
  })),
});

export type AiAnalysisResponse = z.infer<typeof aiAnalysisResponseSchema>;
