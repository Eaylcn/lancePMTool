import { z } from "zod";

// Draft Fill response schema
export const draftFillResponseSchema = z.object({
  gameTitle: z.string().optional(),
  gameGenre: z.array(z.string()).optional(),
  gamePlatform: z.string().optional(),
  gameStudio: z.string().nullable().optional(),
  gameDescription: z.string().optional(),
  personalObservations: z.object({
    ftue: z.string().nullable().optional(),
    coreLoop: z.string().nullable().optional(),
    monetization: z.string().nullable().optional(),
    retention: z.string().nullable().optional(),
    ux: z.string().nullable().optional(),
    meta: z.string().nullable().optional(),
    tech: z.string().nullable().optional(),
    overall: z.string().nullable().optional(),
  }).optional(),
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
    monetizationCommentary: z.string().optional(),

    // Retention
    retentionRewards: z.string().optional(),
    retentionEnergy: z.string().optional(),
    retentionNotifications: z.string().optional(),
    retentionFomo: z.string().optional(),
    retentionSocial: z.string().optional(),
    retentionStreak: z.string().optional(),
    retentionRating: z.number().min(0).max(10).optional(),
    retentionNotes: z.string().optional(),
    retentionCommentary: z.string().optional(),

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
    period: z.string().nullable().optional(),
    downloads: z.number().nullable().optional(),
    revenue: z.number().nullable().optional(),
    dau: z.number().nullable().optional(),
    mau: z.number().nullable().optional(),
    rating: z.number().nullable().optional(),
    chartPosition: z.number().nullable().optional(),
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

// AI Analysis response schema (lenient defaults so partial AI responses don't crash)
export const aiAnalysisResponseSchema = z.object({
  executiveSummary: z.string().default(""),
  overallScoreJustification: z.string().default(""),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  categoryScores: z.record(z.string(), z.object({
    gameScore: z.number().min(0).max(10),
    analysisQuality: z.number().min(0).max(10),
    comment: z.string().default(""),
  })).default({}),
  verdicts: z.array(z.object({
    category: z.string(),
    verdict: z.string(),
    recommendation: z.string(),
  })).default([]),
  fieldReviews: z.array(z.object({
    field: z.string(),
    fieldLabel: z.string().default(""),
    issue: z.enum(["wrong_answer", "too_short", "irrelevant", "incomplete", "empty", "factually_wrong"]),
    message: z.string(),
  })).default([]),
  kpiTrendsInsight: z.string().default(""),
  observationLevel: z.enum(["beginner", "intermediate", "advanced", "professional"]).default("beginner"),
  observationFeedback: z.object({
    level: z.string().default(""),
    strengths: z.array(z.string()).default([]),
    improvements: z.array(z.string()).default([]),
    nextSteps: z.array(z.string()).default([]),
  }).default({ level: "", strengths: [], improvements: [], nextSteps: [] }),
  pmLearnings: z.array(z.object({
    topic: z.string(),
    insight: z.string(),
    actionable: z.string(),
  })).default([]),
  interviewPrep: z.object({
    talkingPoints: z.array(z.string()).default([]),
    likelyQuestions: z.array(z.object({
      question: z.string(),
      modelAnswer: z.string(),
    })).default([]),
    keyInsights: z.array(z.string()).default([]),
  }).default({ talkingPoints: [], likelyQuestions: [], keyInsights: [] }),
  benchmarkComparison: z.object({
    summary: z.string().default(""),
    comparisons: z.array(z.object({
      metric: z.string(),
      gameValue: z.string(),
      benchmark: z.string(),
      verdict: z.string(),
    })).default([]),
  }).default({ summary: "", comparisons: [] }),
  pmScenario: z.object({
    summary: z.string().default(""),
    actionItems: z.array(z.object({
      priority: z.number(),
      action: z.string(),
      rationale: z.string(),
      expectedImpact: z.string(),
    })).default([]),
  }).default({ summary: "", actionItems: [] }),
  mechanicSuggestions: z.array(z.object({
    mechanic: z.string(),
    reason: z.string(),
    implementation: z.string(),
  })).default([]),
  pmGrowthMap: z.object({
    skillGaps: z.array(z.object({
      skill: z.string(),
      currentLevel: z.number().min(1).max(5),
      targetLevel: z.number().min(1).max(5),
      suggestion: z.string(),
    })).default([]),
    growthActions: z.array(z.object({
      action: z.string(),
      timeline: z.string(),
      impact: z.string(),
    })).default([]),
    radarScores: z.record(z.string(), z.number()).default({}),
  }).default({ skillGaps: [], growthActions: [], radarScores: {} }),
  careerPrep: z.object({
    interviewQuestions: z.array(z.object({
      question: z.string(),
      context: z.string(),
      sampleAnswer: z.string(),
    })).default([]),
    portfolioTips: z.array(z.string()).default([]),
    cvHighlights: z.array(z.string()).default([]),
    industryRelevance: z.string().default(""),
  }).default({ interviewQuestions: [], portfolioTips: [], cvHighlights: [], industryRelevance: "" }),
});

export type AiAnalysisResponse = z.infer<typeof aiAnalysisResponseSchema>;

// ============================================
// Compare AI Result Schema
// ============================================
export const categoryWinnerSchema = z.object({
  winner: z.enum(["game1", "game2", "tie"]),
  game1Score: z.number().min(0).max(10),
  game2Score: z.number().min(0).max(10),
  analysis: z.string().default(""),
});

export const compareAiResultSchema = z.object({
  generalComparison: z.string().default(""),
  categoryWinners: z.object({
    ftue: categoryWinnerSchema.default({ winner: "tie", game1Score: 0, game2Score: 0, analysis: "" }),
    coreLoop: categoryWinnerSchema.default({ winner: "tie", game1Score: 0, game2Score: 0, analysis: "" }),
    monetization: categoryWinnerSchema.default({ winner: "tie", game1Score: 0, game2Score: 0, analysis: "" }),
    retention: categoryWinnerSchema.default({ winner: "tie", game1Score: 0, game2Score: 0, analysis: "" }),
    uxui: categoryWinnerSchema.default({ winner: "tie", game1Score: 0, game2Score: 0, analysis: "" }),
    metaGame: categoryWinnerSchema.default({ winner: "tie", game1Score: 0, game2Score: 0, analysis: "" }),
    technical: categoryWinnerSchema.default({ winner: "tie", game1Score: 0, game2Score: 0, analysis: "" }),
  }),
  learnings: z.array(z.string()).default([]),
  crossCategoryRecommendations: z.object({
    forGame1: z.array(z.string()).default([]),
    forGame2: z.array(z.string()).default([]),
    general: z.array(z.string()).default([]),
  }).default({ forGame1: [], forGame2: [], general: [] }),
  overallWinner: z.enum(["game1", "game2", "tie"]).default("tie"),
  overallJustification: z.string().default(""),
});

export type CompareAiResult = z.infer<typeof compareAiResultSchema>;

// ============================================
// Growth Report AI Result Schema
// ============================================
export const growthReportAiResultSchema = z.object({
  currentLevel: z.enum(["beginner_pm", "junior_pm", "mid_pm", "senior_pm", "lead_pm"]).default("beginner_pm"),
  overallAssessment: z.string().default(""),
  strengths: z.array(z.object({
    category: z.string(),
    detail: z.string(),
  })).default([]),
  weaknesses: z.array(z.object({
    category: z.string(),
    detail: z.string(),
  })).default([]),
  trendAnalysis: z.array(z.object({
    period: z.string(),
    level: z.string(),
    insight: z.string(),
  })).default([]),
  genreDiversity: z.array(z.object({
    genre: z.string(),
    count: z.number(),
    depth: z.string(),
  })).default([]),
  actionPlan: z.array(z.object({
    priority: z.number(),
    action: z.string(),
    timeline: z.string(),
    reason: z.string(),
  })).default([]),
  interviewReadiness: z.array(z.object({
    topic: z.string(),
    readiness: z.enum(["low", "medium", "high"]),
    tip: z.string(),
  })).default([]),
  overallScore: z.number().min(0).max(100).default(0),
});

export type GrowthReportAiResult = z.infer<typeof growthReportAiResultSchema>;

// ============================================
// Interview Schemas
// ============================================
export const interviewResponseSchema = z.object({
  question: z.string().default(""),
  feedback: z.object({
    score: z.number().min(0).max(10).default(0),
    strengths: z.array(z.string()).default([]),
    improvements: z.array(z.string()).default([]),
    keyTakeaway: z.string().default(""),
  }).nullable().optional(),
  isLastQuestion: z.boolean().default(false),
  questionNumber: z.number().default(1),
  totalQuestions: z.number().default(7),
});

export type InterviewResponse = z.infer<typeof interviewResponseSchema>;

export const interviewFinalFeedbackSchema = z.object({
  overallReadiness: z.enum(["low", "medium", "high"]).default("low"),
  avgScore: z.number().min(0).max(10).default(0),
  strengths: z.array(z.string()).default([]),
  improvements: z.array(z.string()).default([]),
  nextSteps: z.array(z.string()).default([]),
  summary: z.string().default(""),
});

export type InterviewFinalFeedback = z.infer<typeof interviewFinalFeedbackSchema>;

// ============================================
// Daily Tasks Schemas
// ============================================
export const taskGenerationResultSchema = z.object({
  tasks: z.array(z.object({
    type: z.enum(["analysis", "learning", "practice", "reflection"]),
    title: z.string(),
    description: z.string(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  })).default([]),
});

export type TaskGenerationResult = z.infer<typeof taskGenerationResultSchema>;

export const taskEvaluationResultSchema = z.object({
  score: z.number().min(1).max(10).default(1),
  strengths: z.array(z.string()).default([]),
  improvements: z.array(z.string()).default([]),
  keyTakeaway: z.string().default(""),
});

export type TaskEvaluationResult = z.infer<typeof taskEvaluationResultSchema>;
