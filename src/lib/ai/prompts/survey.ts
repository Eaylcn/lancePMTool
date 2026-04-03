import type { SurveyQuestion } from "@/lib/types/survey";

const TR_LANG_RULES = `
DİL KURALLARI: Sektörel İngilizce terimleri yerinde kullan (NPS, churn, retention, conversion, UX, FTUE, ARPU gibi). Bunların dışında Türkçe tercih et.`;

function formatQuestions(questions: SurveyQuestion[], locale: "tr" | "en"): string {
  return questions
    .map((q, i) => {
      const text = q.question[locale] || q.question.tr;
      const type = q.type;
      let detail = `Q${i + 1} [${type}]: ${text}`;
      if (q.options) {
        detail += "\n  Options: " + q.options.map((o) => `${o.value}=${o.label[locale] || o.label.tr}`).join(", ");
      }
      if (q.scaleMin !== undefined) {
        detail += `\n  Scale: ${q.scaleMin}-${q.scaleMax}`;
      }
      return detail;
    })
    .join("\n");
}

function formatResponses(responses: Record<string, unknown>[], questions: SurveyQuestion[]): string {
  const qMap = new Map(questions.map((q) => [q.id, q]));
  const summary: string[] = [];

  for (const q of questions) {
    const answers = responses.map((r) => r[q.id]).filter((a) => a !== undefined && a !== null);
    if (answers.length === 0) continue;

    if (q.type === "scale") {
      const nums = answers.map(Number).filter((n) => !isNaN(n));
      const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
      const distribution: Record<number, number> = {};
      nums.forEach((n) => { distribution[n] = (distribution[n] || 0) + 1; });
      summary.push(`${q.id}: avg=${avg.toFixed(2)}, n=${nums.length}, dist=${JSON.stringify(distribution)}`);
    } else if (q.type === "single") {
      const counts: Record<string, number> = {};
      answers.forEach((a) => { counts[String(a)] = (counts[String(a)] || 0) + 1; });
      summary.push(`${q.id}: n=${answers.length}, ${JSON.stringify(counts)}`);
    } else if (q.type === "multiple") {
      const counts: Record<string, number> = {};
      answers.forEach((a) => {
        const arr = Array.isArray(a) ? a : [a];
        arr.forEach((v) => { counts[String(v)] = (counts[String(v)] || 0) + 1; });
      });
      summary.push(`${q.id}: n=${answers.length}, ${JSON.stringify(counts)}`);
    } else if (q.type === "text") {
      const texts = answers.map(String).filter((t) => t.length > 0);
      if (texts.length <= 10) {
        summary.push(`${q.id}: n=${texts.length}, responses=${JSON.stringify(texts)}`);
      } else {
        summary.push(`${q.id}: n=${texts.length}, sample=${JSON.stringify(texts.slice(0, 10))}`);
      }
    }
  }

  return summary.join("\n");
}

// ============================================
// 1. NORMAL ANALYSIS
// ============================================
export function getSurveyNormalAnalysisSystemPrompt(locale: "tr" | "en"): string {
  const lang = locale === "tr" ? "Türkçe" : "English";

  return `You are a senior product analyst specializing in player surveys and user research for mobile games. Your role is to analyze survey responses, identify patterns, and provide actionable insights.

IMPORTANT: Respond in ${lang}.
${locale === "tr" ? TR_LANG_RULES : ""}

YOUR APPROACH:
1. Analyze response distributions and identify key trends
2. Highlight the most significant findings (both positive and negative)
3. Calculate a sentiment overview (positive/neutral/negative percentages)
4. Provide a breakdown for each question with a summary and insight
5. Give 3-5 specific, actionable recommendations based on findings
6. Assign an overall satisfaction score (0-100)

OUTPUT FORMAT: Valid JSON only, no markdown code blocks.

{
  "summary": "3-4 paragraph comprehensive analysis of survey results",
  "keyFindings": [{ "title": "...", "description": "...", "importance": "high|medium|low" }],
  "sentimentOverview": { "positive": 0-100, "neutral": 0-100, "negative": 0-100 },
  "questionBreakdown": [{ "questionId": "...", "questionText": "...", "summary": "...", "insight": "..." }],
  "recommendations": [{ "title": "...", "description": "...", "priority": "high|medium|low" }],
  "overallScore": 0-100
}`;
}

export function getSurveyNormalAnalysisUserPrompt(
  surveyTitle: string,
  questions: SurveyQuestion[],
  responses: Record<string, unknown>[],
  locale: "tr" | "en"
): string {
  return `## Survey: ${surveyTitle}
## Total Responses: ${responses.length}

### Questions:
${formatQuestions(questions, locale)}

### Aggregated Response Data:
${formatResponses(responses, questions)}`;
}

// ============================================
// 2. CROSS-QUESTION ANALYSIS
// ============================================
export function getSurveyCrossQuestionAnalysisSystemPrompt(locale: "tr" | "en"): string {
  const lang = locale === "tr" ? "Türkçe" : "English";

  return `You are a data analyst specializing in cross-tabulation and correlation analysis for player surveys. Your role is to find hidden patterns and correlations between different survey questions.

IMPORTANT: Respond in ${lang}.
${locale === "tr" ? TR_LANG_RULES : ""}

YOUR APPROACH:
1. Look for correlations between question responses (e.g., players who rate UX low also rate satisfaction low)
2. Identify distinct player segments based on response patterns
3. Find surprising or counter-intuitive correlations
4. Provide actionable insights based on cross-question patterns

OUTPUT FORMAT: Valid JSON only, no markdown code blocks.

{
  "summary": "2-3 paragraph overview of cross-question findings",
  "correlations": [{ "question1": "...", "question2": "...", "correlation": "description of the correlation", "strength": "strong|moderate|weak" }],
  "segments": [{ "name": "segment name", "description": "...", "size": "% of respondents", "characteristics": ["key trait 1", "key trait 2"] }],
  "insights": [{ "title": "...", "description": "..." }],
  "actionItems": [{ "title": "...", "description": "...", "priority": "high|medium|low" }]
}`;
}

export function getSurveyCrossQuestionAnalysisUserPrompt(
  surveyTitle: string,
  questions: SurveyQuestion[],
  responses: Record<string, unknown>[],
  locale: "tr" | "en"
): string {
  // For cross-question analysis, send individual responses (not aggregated)
  const maxResponses = 100;
  const sampled = responses.length > maxResponses ? responses.slice(0, maxResponses) : responses;

  return `## Survey: ${surveyTitle}
## Total Responses: ${responses.length} (showing ${sampled.length})

### Questions:
${formatQuestions(questions, locale)}

### Individual Responses (for cross-tabulation):
${JSON.stringify(sampled, null, 2)}`;
}

// ============================================
// 3. CROSS-SURVEY COMPARISON
// ============================================
export function getSurveyCrossSurveyComparisonSystemPrompt(locale: "tr" | "en"): string {
  const lang = locale === "tr" ? "Türkçe" : "English";

  return `You are a senior product analyst specializing in comparative survey analysis. Your role is to compare results across different surveys or products and identify meaningful differences.

IMPORTANT: Respond in ${lang}.
${locale === "tr" ? TR_LANG_RULES : ""}

YOUR APPROACH:
1. Compare similar metrics across surveys
2. Identify significant divergences and what they mean
3. Find common themes that appear across all surveys
4. Provide product/survey-specific insights

OUTPUT FORMAT: Valid JSON only, no markdown code blocks.

{
  "summary": "2-3 paragraph comparison overview",
  "comparisonMatrix": [{ "metric": "...", "values": { "survey1_title": "value", "survey2_title": "value" } }],
  "divergences": [{ "area": "...", "description": "...", "significance": "high|medium|low" }],
  "commonThemes": [{ "theme": "...", "description": "..." }],
  "productSpecificInsights": [{ "surveyTitle": "...", "insights": ["insight1", "insight2"] }]
}`;
}

export function getSurveyCrossSurveyComparisonUserPrompt(
  surveyData: { title: string; questions: SurveyQuestion[]; responses: Record<string, unknown>[] }[],
  locale: "tr" | "en"
): string {
  return surveyData
    .map((s, i) => {
      return `## Survey ${i + 1}: ${s.title}
### Total Responses: ${s.responses.length}
### Questions:
${formatQuestions(s.questions, locale)}
### Aggregated Data:
${formatResponses(s.responses, s.questions)}`;
    })
    .join("\n\n---\n\n");
}

// ============================================
// 4. TREND ANALYSIS
// ============================================
export function getSurveyTrendAnalysisSystemPrompt(locale: "tr" | "en"): string {
  const lang = locale === "tr" ? "Türkçe" : "English";

  return `You are a trend analyst specializing in longitudinal survey data. Your role is to analyze how survey results change over time and predict future trends.

IMPORTANT: Respond in ${lang}.
${locale === "tr" ? TR_LANG_RULES : ""}

YOUR APPROACH:
1. Compare metrics across time periods
2. Identify improving and declining areas
3. Look for seasonal patterns or event-driven changes
4. Provide predictions based on observed trends

OUTPUT FORMAT: Valid JSON only, no markdown code blocks.

{
  "summary": "2-3 paragraph trend overview",
  "trendDirection": "improving|declining|stable|mixed",
  "improvingAreas": [{ "area": "...", "description": "...", "change": "+X%" }],
  "decliningAreas": [{ "area": "...", "description": "...", "change": "-X%" }],
  "predictions": [{ "area": "...", "prediction": "...", "confidence": "high|medium|low" }]
}`;
}

export function getSurveyTrendAnalysisUserPrompt(
  surveyTitle: string,
  timeSeriesData: { period: string; questions: SurveyQuestion[]; responses: Record<string, unknown>[] }[],
  locale: "tr" | "en"
): string {
  return timeSeriesData
    .map((period) => {
      return `## Period: ${period.period}
### Responses: ${period.responses.length}
### Aggregated Data:
${formatResponses(period.responses, period.questions)}`;
    })
    .join("\n\n---\n\n");
}
