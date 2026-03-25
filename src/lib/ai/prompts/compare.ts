export function getCompareSystemPrompt(locale: "tr" | "en"): string {
  const lang = locale === "tr" ? "Türkçe" : "English";

  return `You are an expert senior Gaming Product Manager with deep industry experience. Your role is to compare two mobile games across 7 key categories, providing detailed analysis that helps a PM candidate learn comparative analysis skills.

IMPORTANT: Respond in ${lang}.
${locale === "tr" ? `
DİL KURALLARI: Sektörel İngilizce terimleri yerinde kullan (retention, FTUE, DAU, MAU, KPI, core loop, battle pass, FOMO, ARPU, LTV gibi). Bunların dışında Türkçe tercih et.` : ""}

You will receive two games with their PM analyses (across 8 categories each).

YOUR COMPARISON APPROACH:
1. Compare BOTH games objectively across 7 categories: FTUE, Core Loop, Monetization, Retention, UX/UI, Meta Game, Technical.
2. For each category, determine a winner (game1, game2, or tie) with scores (0-10) and detailed analysis.
3. Extract cross-game LEARNINGS — what can each game learn from the other?
4. Provide STRATEGIC recommendations for each game and general industry insights.
5. Be EDUCATIONAL — explain WHY one approach works better than another.
6. Use REAL industry benchmarks and examples when possible.

SCORING RULES:
- Score each game 0-10 per category based on the PM's analysis data.
- If a PM left fields empty, note it but still try to evaluate based on available data.
- Ties should be rare — push yourself to differentiate.

OUTPUT FORMAT: Valid JSON only, no markdown code blocks.

{
  "generalComparison": "3-4 paragraph comprehensive comparison overview. Cover: game positioning, target audience differences, design philosophy, market context. Be insightful.",
  "categoryWinners": {
    "ftue": { "winner": "game1|game2|tie", "game1Score": 0-10, "game2Score": 0-10, "analysis": "2-3 sentence category comparison explaining why the winner is better" },
    "coreLoop": { "winner": "...", "game1Score": 0-10, "game2Score": 0-10, "analysis": "..." },
    "monetization": { "winner": "...", "game1Score": 0-10, "game2Score": 0-10, "analysis": "..." },
    "retention": { "winner": "...", "game1Score": 0-10, "game2Score": 0-10, "analysis": "..." },
    "uxui": { "winner": "...", "game1Score": 0-10, "game2Score": 0-10, "analysis": "..." },
    "metaGame": { "winner": "...", "game1Score": 0-10, "game2Score": 0-10, "analysis": "..." },
    "technical": { "winner": "...", "game1Score": 0-10, "game2Score": 0-10, "analysis": "..." }
  },
  "learnings": ["5-7 cross-game learnings — what each game can learn from the other, with specific examples"],
  "crossCategoryRecommendations": {
    "forGame1": ["3-5 specific strategic recommendations for game 1 based on comparison"],
    "forGame2": ["3-5 specific strategic recommendations for game 2 based on comparison"],
    "general": ["3-5 general PM insights from this comparison — industry-level takeaways"]
  },
  "overallWinner": "game1|game2|tie",
  "overallJustification": "2-3 paragraph overall winner justification. Consider market positioning, execution quality, and growth potential."
}`;
}

export function getCompareUserPrompt(
  game1: { title: string; genre: unknown; platform: string | null; studio: string | null },
  analysis1: Record<string, unknown>,
  game2: { title: string; genre: unknown; platform: string | null; studio: string | null },
  analysis2: Record<string, unknown>,
): string {
  const val = (analysis: Record<string, unknown>, key: string): string => {
    const v = analysis[key];
    if (v === null || v === undefined || (typeof v === "string" && !v.trim())) {
      return "Belirtilmemiş";
    }
    return String(v);
  };

  const formatGame = (
    label: string,
    game: { title: string; genre: unknown; platform: string | null; studio: string | null },
    a: Record<string, unknown>,
  ) => `## ${label}: ${game.title}
- Tür(ler): ${Array.isArray(game.genre) ? (game.genre as string[]).join(", ") : game.genre || "Belirtilmemiş"}
- Platform: ${game.platform || "Belirtilmemiş"}
- Stüdyo: ${game.studio || "Belirtilmemiş"}

### FTUE
- İlk İzlenim: ${val(a, "ftueFirstImpression")}
- Onboarding Tipi: ${val(a, "ftueOnboardingType")}
- Süre: ${val(a, "ftueDuration")}
- Sürtünme Noktaları: ${val(a, "ftueFrictionPoints")}
- İzin Zamanlaması: ${val(a, "ftuePermissionTiming")}
- Puan: ${val(a, "ftueRating")}
- Notlar: ${val(a, "ftueNotes")}

### Core Loop
- Tanım: ${val(a, "coreLoopDefinition")}
- Oturum Süresi: ${val(a, "coreLoopSessionLength")}
- Ustalık Eğrisi: ${val(a, "coreLoopMasteryCurve")}
- Çeşitlilik: ${val(a, "coreLoopVariety")}
- Puan: ${val(a, "coreLoopRating")}
- Notlar: ${val(a, "coreLoopNotes")}

### Monetization
- Model: ${val(a, "monetizationModel")}
- IAP: ${val(a, "monetizationIap")}
- Reklamlar: ${val(a, "monetizationAds")}
- Battle Pass: ${val(a, "monetizationBattlePass")}
- VIP: ${val(a, "monetizationVip")}
- Puan: ${val(a, "monetizationRating")}
- Notlar: ${val(a, "monetizationNotes")}

### Retention
- Ödüller: ${val(a, "retentionRewards")}
- Enerji: ${val(a, "retentionEnergy")}
- Bildirimler: ${val(a, "retentionNotifications")}
- FOMO: ${val(a, "retentionFomo")}
- Sosyal: ${val(a, "retentionSocial")}
- Streak: ${val(a, "retentionStreak")}
- Puan: ${val(a, "retentionRating")}
- Notlar: ${val(a, "retentionNotes")}

### UX/UI
- Menü: ${val(a, "uxMenu")}
- Butonlar: ${val(a, "uxButtons")}
- Yükleme: ${val(a, "uxLoading")}
- HUD: ${val(a, "uxHud")}
- Erişilebilirlik: ${val(a, "uxAccessibility")}
- Puan: ${val(a, "uxRating")}
- Notlar: ${val(a, "uxNotes")}

### Meta Game
- Sistemler: ${val(a, "metaSystems")}
- Uzun Vadeli: ${val(a, "metaLongTerm")}
- Puan: ${val(a, "metaRating")}
- Notlar: ${val(a, "metaNotes")}

### Teknik
- Yükleme Süresi: ${val(a, "techLoadTime")}
- FPS: ${val(a, "techFps")}
- Batarya: ${val(a, "techBattery")}
- Çevrimdışı: ${val(a, "techOffline")}
- Boyut: ${val(a, "techSize")}
- Puan: ${val(a, "techRating")}
- Notlar: ${val(a, "techNotes")}

### Genel Değerlendirme
- En İyi Özellik: ${val(a, "overallBestFeature")}
- En Kötü Özellik: ${val(a, "overallWorstFeature")}
- Benzersiz Mekanik: ${val(a, "overallUniqueMechanic")}
- Hedef Kitle: ${val(a, "overallTargetAudience")}
- Dersler: ${val(a, "overallLearnings")}`;

  return `${formatGame("OYUN 1", game1, analysis1)}\n\n---\n\n${formatGame("OYUN 2", game2, analysis2)}`;
}
