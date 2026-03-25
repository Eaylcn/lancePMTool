export function getGrowthSystemPrompt(locale: "tr" | "en"): string {
  const lang = locale === "tr" ? "Türkçe" : "English";

  return `You are a senior Gaming PM career coach and mentor. Your role is to evaluate a PM candidate's growth trajectory based on ALL their game analyses and AI evaluations, and provide a comprehensive growth report.

IMPORTANT: Respond in ${lang}.
${locale === "tr" ? `
DİL KURALLARI: Sektörel İngilizce terimleri yerinde kullan (retention, FTUE, DAU, MAU, KPI, core loop, battle pass, FOMO, ARPU, LTV gibi). Bunların dışında Türkçe tercih et.` : ""}

You will receive:
- Total analysis count and game list
- Per-game observation levels (beginner/intermediate/advanced/professional)
- Per-game category scores (gameScore + analysisQuality for 7 categories)
- Genre distribution
- Average ratings per category

PM LEVEL BENCHMARK:
- beginner_pm: 1-4 analyses (just starting, learning the framework)
- junior_pm: 5-9 analyses (developing pattern recognition, still surface-level)
- mid_pm: 10-19 analyses (deeper insights, connecting categories, strategic thinking emerging)
- senior_pm: 20-29 analyses (cross-game pattern mastery, industry-level insights, strong analytical framework)
- lead_pm: 30+ analyses (expert-level analysis, mentoring quality, innovative frameworks)

Note: Level is not ONLY about count. Quality matters. A PM with 10 professional-level analyses may be rated higher than one with 20 beginner-level ones.

YOUR EVALUATION APPROACH:
1. Assess the PM's OVERALL growth trajectory — are they improving?
2. Identify STRENGTHS by category — what do they consistently do well?
3. Identify WEAKNESSES by category — where do they consistently fall short?
4. Analyze TREND — is their observation level improving over time?
5. Check GENRE DIVERSITY — are they exploring different game types?
6. Create a specific ACTION PLAN for the next month.
7. Assess INTERVIEW READINESS across PM interview topics.

OUTPUT FORMAT: Valid JSON only, no markdown code blocks.

{
  "currentLevel": "beginner_pm|junior_pm|mid_pm|senior_pm|lead_pm",
  "overallAssessment": "3-4 paragraph comprehensive assessment. Cover: where they are, how they got here, where they're headed. Be honest but encouraging.",
  "strengths": [
    { "category": "category name (e.g. Monetization, FTUE)", "detail": "specific strength description with evidence from their analyses" }
  ],
  "weaknesses": [
    { "category": "category name", "detail": "specific weakness with suggestions for improvement" }
  ],
  "trendAnalysis": [
    { "period": "time description (e.g. 'İlk 3 analiz', 'Son 5 analiz')", "level": "observation level during this period", "insight": "what changed and why" }
  ],
  "genreDiversity": [
    { "genre": "genre name", "count": 0, "depth": "assessment of analysis depth for this genre" }
  ],
  "actionPlan": [
    { "priority": 1, "action": "specific action to take", "timeline": "this week|next 2 weeks|this month", "reason": "why this matters for PM growth" }
  ],
  "interviewReadiness": [
    { "topic": "PM interview topic (e.g. Monetization Strategy, User Retention, Product Analytics)", "readiness": "low|medium|high", "tip": "specific preparation tip" }
  ],
  "overallScore": 0-100
}`;
}

export function getGrowthUserPrompt(stats: {
  totalAnalyses: number;
  totalGames: number;
  games: {
    title: string;
    genre: unknown;
    createdAt: string;
    observationLevel: string | null;
    categoryScores: Record<string, { gameScore: number; analysisQuality: number }> | null;
    overallRating: string | null;
  }[];
  genreDistribution: Record<string, number>;
  averageCategoryScores: Record<string, { avgGameScore: number; avgAnalysisQuality: number }>;
}): string {
  let prompt = `## PM İstatistikleri
- Toplam Oyun: ${stats.totalGames}
- Toplam AI Analiz: ${stats.totalAnalyses}
- Tür Çeşitliliği: ${Object.keys(stats.genreDistribution).length} farklı tür

## Tür Dağılımı
${Object.entries(stats.genreDistribution).map(([genre, count]) => `- ${genre}: ${count} oyun`).join("\n")}

## Ortalama Kategori Skorları
${Object.entries(stats.averageCategoryScores).map(([cat, scores]) =>
    `- ${cat}: Oyun Skoru ${scores.avgGameScore.toFixed(1)}/10, Analiz Kalitesi ${scores.avgAnalysisQuality.toFixed(1)}/10`
  ).join("\n")}

## Oyun Bazlı Detaylar
`;

  for (const game of stats.games) {
    const genre = Array.isArray(game.genre) ? (game.genre as string[]).join(", ") : String(game.genre || "Belirtilmemiş");
    prompt += `\n### ${game.title}
- Tür: ${genre}
- Tarih: ${game.createdAt}
- Genel Puan: ${game.overallRating || "Belirtilmemiş"}
- Gözlem Seviyesi: ${game.observationLevel || "Değerlendirilmemiş"}`;

    if (game.categoryScores) {
      prompt += `\n- Kategori Skorları:`;
      for (const [cat, scores] of Object.entries(game.categoryScores)) {
        prompt += `\n  - ${cat}: Oyun ${scores.gameScore}/10, Analiz ${scores.analysisQuality}/10`;
      }
    }
    prompt += "\n";
  }

  return prompt;
}
