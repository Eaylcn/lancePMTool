import type { RawMetrics, DerivedMetrics, BenchmarkComparison } from "@/lib/metrics/types";

export function getMetricAnalysisSystemPrompt(locale: "tr" | "en"): string {
  const lang = locale === "tr" ? "Türkçe" : "English";

  return `You are a senior mobile gaming KPI analyst and mentor. Your role is to analyze game metrics, identify health indicators, and provide actionable recommendations.

IMPORTANT: Respond in ${lang}.
${locale === "tr" ? `
DİL KURALLARI: Sektörel İngilizce terimleri yerinde kullan (DAU, MAU, ARPDAU, LTV, CPI, retention, ARPU, stickiness, churn gibi). Bunların dışında Türkçe tercih et.` : ""}

YOUR APPROACH:
1. Evaluate each metric against genre benchmarks — is the game healthy?
2. Identify patterns: high retention + low ARPDAU = monetization problem, high CPI + low LTV = UA sustainability risk, etc.
3. Be SPECIFIC and EDUCATIONAL — explain WHY a metric matters and WHAT to do about it.
4. Give a health score (0-100) reflecting overall game health based on the metrics.
5. Highlight risk factors that could threaten game sustainability.
6. Provide at least 3-5 actionable recommendations with expected impact.

OUTPUT FORMAT: Valid JSON only, no markdown code blocks.

{
  "summary": "3-4 paragraph comprehensive analysis of the game's metric health. Cover: current state, key strengths, critical weaknesses, and strategic outlook.",
  "healthScore": 0-100,
  "benchmarkComparison": [
    { "metric": "metric name", "value": 0, "benchmark": "genre benchmark range", "verdict": "above|at|below", "comment": "specific explanation and context" }
  ],
  "insights": ["4-6 data-driven insights about metric patterns and what they reveal about the game"],
  "recommendations": ["4-6 specific, actionable recommendations with expected impact"],
  "riskFactors": ["2-4 risk factors that could threaten the game's sustainability"]
}`;
}

export function getMetricAnalysisUserPrompt(
  rawMetrics: RawMetrics,
  derivedMetrics: DerivedMetrics,
  genre: string,
  benchmarks: BenchmarkComparison[]
): string {
  let prompt = `## Game Genre: ${genre}

## Raw Metrics (User Input)`;

  if (rawMetrics.dau != null) prompt += `\n- DAU: ${rawMetrics.dau.toLocaleString()}`;
  if (rawMetrics.mau != null) prompt += `\n- MAU: ${rawMetrics.mau.toLocaleString()}`;
  if (rawMetrics.revenue != null) prompt += `\n- Monthly Revenue: $${rawMetrics.revenue.toLocaleString()}`;
  if (rawMetrics.downloads != null) prompt += `\n- Monthly Downloads: ${rawMetrics.downloads.toLocaleString()}`;
  if (rawMetrics.cpi != null) prompt += `\n- CPI: $${rawMetrics.cpi}`;
  if (rawMetrics.d1Retention != null) prompt += `\n- D1 Retention: ${rawMetrics.d1Retention}%`;
  if (rawMetrics.d7Retention != null) prompt += `\n- D7 Retention: ${rawMetrics.d7Retention}%`;
  if (rawMetrics.d30Retention != null) prompt += `\n- D30 Retention: ${rawMetrics.d30Retention}%`;
  if (rawMetrics.sessionLength != null) prompt += `\n- Avg Session Length: ${rawMetrics.sessionLength}s`;
  if (rawMetrics.sessionsPerDay != null) prompt += `\n- Sessions Per Day: ${rawMetrics.sessionsPerDay}`;

  prompt += `\n\n## Derived Metrics (Calculated)`;
  if (derivedMetrics.arpdau != null) prompt += `\n- ARPDAU: $${derivedMetrics.arpdau}`;
  if (derivedMetrics.arpu != null) prompt += `\n- ARPU: $${derivedMetrics.arpu}`;
  if (derivedMetrics.ltv != null) prompt += `\n- Estimated LTV: $${derivedMetrics.ltv}`;
  if (derivedMetrics.stickiness != null) prompt += `\n- Stickiness (DAU/MAU): ${derivedMetrics.stickiness}%`;
  if (derivedMetrics.dailyPlayTime != null) prompt += `\n- Daily Play Time: ${derivedMetrics.dailyPlayTime} min`;

  if (benchmarks.length > 0) {
    prompt += `\n\n## Benchmark Comparison (${genre})`;
    for (const b of benchmarks) {
      const rangeStr = `${b.benchmark.low}-${b.benchmark.mid}-${b.benchmark.high}`;
      prompt += `\n- ${b.metric}: ${b.value} (benchmark: ${rangeStr}, status: ${b.status})`;
    }
  }

  return prompt;
}
