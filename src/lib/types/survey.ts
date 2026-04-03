import { z } from "zod";

// ============================================
// Question Types (shared between templates & DB)
// ============================================
export type QuestionType = "single" | "multiple" | "scale" | "text";

export interface SurveyOption {
  value: string;
  label: { tr: string; en: string };
}

export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  question: { tr: string; en: string };
  required?: boolean;
  options?: SurveyOption[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: { tr: string; en: string }; max: { tr: string; en: string } };
}

// ============================================
// Survey Settings
// ============================================
export interface SurveySettings {
  allowAnonymous?: boolean;
  showProgressBar?: boolean;
  randomizeQuestions?: boolean;
  maxResponses?: number;
}

// ============================================
// Template Types
// ============================================
export type SurveyTemplateType =
  | "player_satisfaction"
  | "beta_feedback"
  | "ux_usability"
  | "churn_analysis"
  | "feature_prioritization"
  | "monetization_perception"
  | "market_research";

export interface SurveyTemplate {
  type: SurveyTemplateType;
  title: { tr: string; en: string };
  description: { tr: string; en: string };
  icon: string;
  color: string;
  questions: SurveyQuestion[];
  estimatedMinutes: number;
}

// ============================================
// Zod Schemas
// ============================================
export const surveyQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(["single", "multiple", "scale", "text"]),
  question: z.object({ tr: z.string(), en: z.string() }),
  required: z.boolean().optional(),
  options: z
    .array(
      z.object({
        value: z.string(),
        label: z.object({ tr: z.string(), en: z.string() }),
      })
    )
    .optional(),
  scaleMin: z.number().optional(),
  scaleMax: z.number().optional(),
  scaleLabels: z
    .object({
      min: z.object({ tr: z.string(), en: z.string() }),
      max: z.object({ tr: z.string(), en: z.string() }),
    })
    .optional(),
});

export const createSurveySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  gameId: z.string().uuid().optional().nullable(),
  templateType: z.string().optional().nullable(),
  questions: z.array(surveyQuestionSchema).min(1),
  settings: z
    .object({
      allowAnonymous: z.boolean().optional(),
      showProgressBar: z.boolean().optional(),
      randomizeQuestions: z.boolean().optional(),
      maxResponses: z.number().positive().optional(),
    })
    .optional(),
  expiresAt: z.string().datetime().optional().nullable(),
});

export const updateSurveySchema = createSurveySchema.partial().extend({
  status: z.enum(["draft", "active", "expired", "closed"]).optional(),
});

export const submitSurveyResponseSchema = z.object({
  responses: z.record(z.string(), z.unknown()),
  metadata: z
    .object({
      userAgent: z.string().optional(),
      locale: z.string().optional(),
      completionTimeSeconds: z.number().optional(),
    })
    .optional(),
});

export const surveyAnalysisRequestSchema = z.object({
  surveyId: z.string().uuid(),
  analysisType: z.enum(["normal", "cross_question", "cross_survey", "trend"]),
  compareSurveyIds: z.array(z.string().uuid()).optional(),
  locale: z.string().default("tr"),
});

// ============================================
// AI Analysis Result Types
// ============================================
export interface SurveyNormalAnalysis {
  summary: string;
  keyFindings: { title: string; description: string; importance: "high" | "medium" | "low" }[];
  sentimentOverview: { positive: number; neutral: number; negative: number };
  questionBreakdown: { questionId: string; questionText: string; summary: string; insight: string }[];
  recommendations: { title: string; description: string; priority: "high" | "medium" | "low" }[];
  overallScore: number;
}

export interface SurveyCrossQuestionAnalysis {
  summary: string;
  correlations: { question1: string; question2: string; correlation: string; strength: "strong" | "moderate" | "weak" }[];
  segments: { name: string; description: string; size: string; characteristics: string[] }[];
  insights: { title: string; description: string }[];
  actionItems: { title: string; description: string; priority: "high" | "medium" | "low" }[];
}

export interface SurveyCrossSurveyComparison {
  summary: string;
  comparisonMatrix: { metric: string; values: Record<string, string> }[];
  divergences: { area: string; description: string; significance: "high" | "medium" | "low" }[];
  commonThemes: { theme: string; description: string }[];
  productSpecificInsights: { surveyTitle: string; insights: string[] }[];
}

export interface SurveyTrendAnalysis {
  summary: string;
  trendDirection: "improving" | "declining" | "stable" | "mixed";
  improvingAreas: { area: string; description: string; change: string }[];
  decliningAreas: { area: string; description: string; change: string }[];
  predictions: { area: string; prediction: string; confidence: "high" | "medium" | "low" }[];
}

export type SurveyAnalysisResult =
  | SurveyNormalAnalysis
  | SurveyCrossQuestionAnalysis
  | SurveyCrossSurveyComparison
  | SurveyTrendAnalysis;
