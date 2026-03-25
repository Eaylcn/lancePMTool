import type {
  RawMetrics,
  DerivedMetrics,
  BenchmarkComparison,
  BenchmarkMetricKey,
  GenreBenchmark,
} from "./types";
import { GENRE_BENCHMARKS, BENCHMARK_METRIC_KEYS } from "./types";

/**
 * Calculate derived metrics from raw user inputs.
 * Pure function — safe for both client and server.
 */
export function calculateDerivedMetrics(raw: RawMetrics): DerivedMetrics {
  const derived: DerivedMetrics = {};

  // ARPDAU = Revenue / DAU
  if (raw.revenue != null && raw.dau != null && raw.dau > 0) {
    derived.arpdau = Number((raw.revenue / raw.dau).toFixed(4));
  }

  // ARPU = Revenue / MAU
  if (raw.revenue != null && raw.mau != null && raw.mau > 0) {
    derived.arpu = Number((raw.revenue / raw.mau).toFixed(4));
  }

  // Stickiness = (DAU / MAU) * 100
  if (raw.dau != null && raw.mau != null && raw.mau > 0) {
    derived.stickiness = Number(((raw.dau / raw.mau) * 100).toFixed(1));
  }

  // LTV estimate = ARPDAU * average lifetime days (using D30 retention as proxy)
  // Simplified: LTV ≈ ARPDAU * (1 / (1 - D30/100)) when D30 < 100
  if (derived.arpdau != null && raw.d30Retention != null && raw.d30Retention > 0 && raw.d30Retention < 100) {
    const avgLifetimeDays = 1 / (1 - raw.d30Retention / 100);
    derived.ltv = Number((derived.arpdau * avgLifetimeDays).toFixed(2));
  } else if (derived.arpdau != null) {
    // Fallback: use 30 days as default lifetime
    derived.ltv = Number((derived.arpdau * 30).toFixed(2));
  }

  // Pass-through retention values
  if (raw.d1Retention != null) derived.d1Retention = raw.d1Retention;
  if (raw.d7Retention != null) derived.d7Retention = raw.d7Retention;
  if (raw.d30Retention != null) derived.d30Retention = raw.d30Retention;

  // Daily play time (minutes) = sessionLength (seconds) * sessionsPerDay / 60
  if (raw.sessionLength != null && raw.sessionsPerDay != null) {
    derived.dailyPlayTime = Number(((raw.sessionLength * raw.sessionsPerDay) / 60).toFixed(1));
  }

  return derived;
}

/**
 * Compare derived metrics with genre benchmarks.
 * Returns an array of comparisons with above/at/below status.
 */
export function compareWithBenchmarks(
  raw: RawMetrics,
  derived: DerivedMetrics,
  genre: string
): BenchmarkComparison[] {
  const benchmark = GENRE_BENCHMARKS[genre];
  if (!benchmark) return [];

  const comparisons: BenchmarkComparison[] = [];

  // Build a lookup of metric key -> value
  const metricValues: Partial<Record<BenchmarkMetricKey, number | undefined>> = {
    d1Retention: derived.d1Retention,
    d7Retention: derived.d7Retention,
    d30Retention: derived.d30Retention,
    stickiness: derived.stickiness,
    arpdau: derived.arpdau,
    sessionLength: raw.sessionLength,
    sessionsPerDay: raw.sessionsPerDay,
    cpi: raw.cpi,
  };

  for (const key of BENCHMARK_METRIC_KEYS) {
    const value = metricValues[key];
    if (value == null) continue;

    const range = benchmark[key];

    // CPI is inverse — lower is better
    const isInverse = key === "cpi";
    let status: "above" | "at" | "below";

    if (isInverse) {
      status = value <= range.low ? "above" : value <= range.mid ? "at" : "below";
    } else {
      status = value >= range.high ? "above" : value >= range.mid ? "at" : "below";
    }

    comparisons.push({ metric: key, value, benchmark: range, status });
  }

  return comparisons;
}

/**
 * Get available genre keys for benchmark selection.
 */
export function getAvailableGenres(): { key: string; label: string }[] {
  return Object.entries(GENRE_BENCHMARKS).map(([key, benchmark]) => ({
    key,
    label: (benchmark as GenreBenchmark).label,
  }));
}
