import { z } from "zod";

// ============================================
// Raw Metrics — User Input
// ============================================
export const rawMetricsSchema = z.object({
  dau: z.number().min(0).optional(),
  mau: z.number().min(0).optional(),
  revenue: z.number().min(0).optional(),
  downloads: z.number().min(0).optional(),
  cpi: z.number().min(0).optional(),
  d1Retention: z.number().min(0).max(100).optional(),
  d7Retention: z.number().min(0).max(100).optional(),
  d30Retention: z.number().min(0).max(100).optional(),
  sessionLength: z.number().min(0).optional(), // seconds
  sessionsPerDay: z.number().min(0).optional(),
});

export type RawMetrics = z.infer<typeof rawMetricsSchema>;

// ============================================
// Derived Metrics — Calculated
// ============================================
export const derivedMetricsSchema = z.object({
  arpdau: z.number().optional(),       // revenue / dau
  ltv: z.number().optional(),          // arpdau * avg_lifetime_days
  stickiness: z.number().optional(),   // dau / mau * 100
  arpu: z.number().optional(),         // revenue / mau
  d1Retention: z.number().optional(),
  d7Retention: z.number().optional(),
  d30Retention: z.number().optional(),
  dailyPlayTime: z.number().optional(), // sessionLength * sessionsPerDay (minutes)
});

export type DerivedMetrics = z.infer<typeof derivedMetricsSchema>;

// ============================================
// Metric AI Analysis — Lenient Schema
// ============================================
export const metricAiAnalysisSchema = z.object({
  summary: z.string().default(""),
  healthScore: z.number().min(0).max(100).default(0),
  benchmarkComparison: z.array(z.object({
    metric: z.string(),
    value: z.number(),
    benchmark: z.string(),
    verdict: z.enum(["above", "at", "below"]),
    comment: z.string().default(""),
  })).default([]),
  insights: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
  riskFactors: z.array(z.string()).default([]),
});

export type MetricAiAnalysis = z.infer<typeof metricAiAnalysisSchema>;

// ============================================
// Genre Benchmarks — Static Typed Constants
// ============================================
export interface BenchmarkRange {
  low: number;
  mid: number;
  high: number;
  unit: string;
}

export interface GenreBenchmark {
  label: string;
  d1Retention: BenchmarkRange;
  d7Retention: BenchmarkRange;
  d30Retention: BenchmarkRange;
  stickiness: BenchmarkRange;
  arpdau: BenchmarkRange;
  sessionLength: BenchmarkRange;  // seconds
  sessionsPerDay: BenchmarkRange;
  cpi: BenchmarkRange;
}

export const GENRE_BENCHMARKS: Record<string, GenreBenchmark> = {
  "Hyper-casual": {
    label: "Hyper-casual",
    d1Retention: { low: 25, mid: 35, high: 45, unit: "%" },
    d7Retention: { low: 5, mid: 10, high: 18, unit: "%" },
    d30Retention: { low: 1, mid: 3, high: 7, unit: "%" },
    stickiness: { low: 10, mid: 18, high: 28, unit: "%" },
    arpdau: { low: 0.02, mid: 0.05, high: 0.10, unit: "$" },
    sessionLength: { low: 120, mid: 240, high: 420, unit: "s" },
    sessionsPerDay: { low: 2, mid: 4, high: 7, unit: "" },
    cpi: { low: 0.05, mid: 0.20, high: 0.50, unit: "$" },
  },
  Casual: {
    label: "Casual",
    d1Retention: { low: 30, mid: 40, high: 50, unit: "%" },
    d7Retention: { low: 10, mid: 18, high: 28, unit: "%" },
    d30Retention: { low: 3, mid: 8, high: 15, unit: "%" },
    stickiness: { low: 12, mid: 20, high: 32, unit: "%" },
    arpdau: { low: 0.05, mid: 0.12, high: 0.25, unit: "$" },
    sessionLength: { low: 300, mid: 600, high: 1200, unit: "s" },
    sessionsPerDay: { low: 2, mid: 4, high: 7, unit: "" },
    cpi: { low: 0.30, mid: 1.00, high: 3.00, unit: "$" },
  },
  Puzzle: {
    label: "Puzzle",
    d1Retention: { low: 32, mid: 42, high: 55, unit: "%" },
    d7Retention: { low: 12, mid: 20, high: 30, unit: "%" },
    d30Retention: { low: 4, mid: 10, high: 18, unit: "%" },
    stickiness: { low: 14, mid: 22, high: 35, unit: "%" },
    arpdau: { low: 0.05, mid: 0.15, high: 0.30, unit: "$" },
    sessionLength: { low: 300, mid: 600, high: 1200, unit: "s" },
    sessionsPerDay: { low: 3, mid: 5, high: 8, unit: "" },
    cpi: { low: 0.50, mid: 1.50, high: 4.00, unit: "$" },
  },
  "Match-3": {
    label: "Match-3",
    d1Retention: { low: 35, mid: 45, high: 55, unit: "%" },
    d7Retention: { low: 15, mid: 22, high: 32, unit: "%" },
    d30Retention: { low: 5, mid: 12, high: 20, unit: "%" },
    stickiness: { low: 15, mid: 25, high: 38, unit: "%" },
    arpdau: { low: 0.08, mid: 0.18, high: 0.35, unit: "$" },
    sessionLength: { low: 360, mid: 720, high: 1500, unit: "s" },
    sessionsPerDay: { low: 3, mid: 5, high: 9, unit: "" },
    cpi: { low: 1.00, mid: 3.00, high: 6.00, unit: "$" },
  },
  RPG: {
    label: "RPG",
    d1Retention: { low: 25, mid: 35, high: 48, unit: "%" },
    d7Retention: { low: 8, mid: 15, high: 25, unit: "%" },
    d30Retention: { low: 3, mid: 8, high: 15, unit: "%" },
    stickiness: { low: 15, mid: 25, high: 40, unit: "%" },
    arpdau: { low: 0.10, mid: 0.30, high: 0.70, unit: "$" },
    sessionLength: { low: 600, mid: 1200, high: 2400, unit: "s" },
    sessionsPerDay: { low: 2, mid: 3, high: 6, unit: "" },
    cpi: { low: 1.00, mid: 3.50, high: 8.00, unit: "$" },
  },
  Strategy: {
    label: "Strategy",
    d1Retention: { low: 22, mid: 32, high: 45, unit: "%" },
    d7Retention: { low: 8, mid: 14, high: 22, unit: "%" },
    d30Retention: { low: 3, mid: 7, high: 14, unit: "%" },
    stickiness: { low: 18, mid: 28, high: 42, unit: "%" },
    arpdau: { low: 0.15, mid: 0.40, high: 0.90, unit: "$" },
    sessionLength: { low: 600, mid: 1500, high: 3000, unit: "s" },
    sessionsPerDay: { low: 2, mid: 4, high: 6, unit: "" },
    cpi: { low: 1.50, mid: 4.00, high: 10.00, unit: "$" },
  },
  Simulation: {
    label: "Simulation",
    d1Retention: { low: 28, mid: 38, high: 50, unit: "%" },
    d7Retention: { low: 10, mid: 18, high: 28, unit: "%" },
    d30Retention: { low: 3, mid: 9, high: 16, unit: "%" },
    stickiness: { low: 15, mid: 25, high: 38, unit: "%" },
    arpdau: { low: 0.08, mid: 0.20, high: 0.45, unit: "$" },
    sessionLength: { low: 480, mid: 900, high: 1800, unit: "s" },
    sessionsPerDay: { low: 2, mid: 4, high: 7, unit: "" },
    cpi: { low: 0.80, mid: 2.50, high: 6.00, unit: "$" },
  },
  Action: {
    label: "Action",
    d1Retention: { low: 22, mid: 32, high: 42, unit: "%" },
    d7Retention: { low: 7, mid: 13, high: 22, unit: "%" },
    d30Retention: { low: 2, mid: 6, high: 12, unit: "%" },
    stickiness: { low: 12, mid: 20, high: 32, unit: "%" },
    arpdau: { low: 0.05, mid: 0.15, high: 0.35, unit: "$" },
    sessionLength: { low: 420, mid: 900, high: 1800, unit: "s" },
    sessionsPerDay: { low: 2, mid: 3, high: 5, unit: "" },
    cpi: { low: 0.80, mid: 2.00, high: 5.00, unit: "$" },
  },
} as const;

// Benchmark metric keys (for iteration)
export const BENCHMARK_METRIC_KEYS = [
  "d1Retention",
  "d7Retention",
  "d30Retention",
  "stickiness",
  "arpdau",
  "sessionLength",
  "sessionsPerDay",
  "cpi",
] as const;

export type BenchmarkMetricKey = typeof BENCHMARK_METRIC_KEYS[number];

// ============================================
// Benchmark Comparison Result
// ============================================
export interface BenchmarkComparison {
  metric: BenchmarkMetricKey;
  value: number;
  benchmark: BenchmarkRange;
  status: "above" | "at" | "below";
}
