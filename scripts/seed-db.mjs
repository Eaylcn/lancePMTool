import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

async function run() {
  const users = await sql`SELECT id FROM profiles LIMIT 1`;
  if (users.length === 0) { console.log("No users"); process.exit(1); }
  const userId = users[0].id;
  console.log("User:", userId);

  const games = await sql`
    INSERT INTO games (user_id, title, studio, genre, platform, status, overall_rating, is_template)
    VALUES
      (${userId}, 'Clash Royale', 'Supercell', '["strategy","card","moba"]'::jsonb, 'both', 'completed', '8.5', true),
      (${userId}, 'Royal Match', 'Dream Games', '["match3","puzzle","casual"]'::jsonb, 'both', 'playing', '7.8', true),
      (${userId}, 'PUBG Mobile', 'Tencent Games', '["battle_royale","shooter"]'::jsonb, 'both', 'completed', '7.2', true),
      (${userId}, 'Idle Heroes', 'DH Games', '["idle","rpg"]'::jsonb, 'both', 'dropped', '5.5', true),
      (${userId}, 'Monopoly GO!', 'Scopely', '["casual","social_casino"]'::jsonb, 'both', 'playing', '6.9', true)
    RETURNING id, title
  `;
  console.log("Inserted", games.length, "games");

  // Analyses for all 5 games
  const analysesData = [
    { gameId: games[0].id, ftueRating: "8", coreLoopRating: "9", monetizationRating: "7", retentionRating: "8", uxRating: "8", metaRating: "9", techRating: "8",
      ftueFirstImpression: "Oyun hızlıca tutorial ile başlıyor.", coreLoopDefinition: "Kart toplama → deck → 1v1 savaş → kupa → sandık",
      monetizationModel: "Freemium IAP + Gold Pass", overallBestFeature: "Gerçek zamanlı PvP", overallWorstFeature: "Kart seviye farkı",
      overallTargetAudience: "Kompetitif 16-35 yaş", overallLearnings: "Kısa oturum + derin strateji mobilde etkili" },
    { gameId: games[1].id, ftueRating: "9", coreLoopRating: "8", monetizationRating: "8", retentionRating: "8", uxRating: "9", metaRating: "7", techRating: "7",
      ftueFirstImpression: "Renkli ve davetkar açılış.", coreLoopDefinition: "Puzzle çöz → yıldız → dekore et → yeni alan",
      monetizationModel: "Freemium IAP + reklam", overallBestFeature: "Görsel kalite ve dekorasyon", overallWorstFeature: "Puzzle mekaniği farksız",
      overallTargetAudience: "Casual 25-45 yaş", overallLearnings: "Meta progression sıradan loop çekici kılar" },
    { gameId: games[2].id, ftueRating: "6", coreLoopRating: "7", monetizationRating: "7", retentionRating: "6", uxRating: "5", metaRating: "6", techRating: "7",
      ftueFirstImpression: "Uzun indirme, karmaşık giriş.", coreLoopDefinition: "Lobi → atla → loot → hayatta kal → savaş",
      monetizationModel: "Freemium kozmetik + Royale Pass", overallBestFeature: "PC kalitesinde BR mobilde", overallWorstFeature: "UI karmaşıklığı",
      overallTargetAudience: "Hardcore 16-30 yaş", overallLearnings: "Uzun oturum riskli, UI basitliği kritik" },
    { gameId: games[3].id, ftueRating: "5", coreLoopRating: "5", monetizationRating: "4", retentionRating: "6", uxRating: "4", metaRating: "5", techRating: "6",
      ftueFirstImpression: "Parlak açılış, hemen ödül.", coreLoopDefinition: "Kahraman topla → takım → idle gelir → savaş → güçlendir",
      monetizationModel: "Freemium ağır IAP + VIP + gacha", overallBestFeature: "Idle gelir mekanizması", overallWorstFeature: "Agresif monetization ve VIP",
      overallTargetAudience: "Casual-midcore RPG 20-40", overallLearnings: "Idle retention güçlü ama agresif monetization kaybettirir" },
    { gameId: games[4].id, ftueRating: "7", coreLoopRating: "6", monetizationRating: "5", retentionRating: "7", uxRating: "7", metaRating: "6", techRating: "7",
      ftueFirstImpression: "Nostaljik Monopoly teması.", coreLoopDefinition: "Zar at → ilerle → para/kalkan/saldırı → sticker → albüm",
      monetizationModel: "Freemium ağır IAP + zar satın alma", overallBestFeature: "Monopoly markası + sticker ticareti", overallWorstFeature: "Şans bazlı loop, derinlik yok",
      overallTargetAudience: "Casual, sosyal 18-50 yaş", overallLearnings: "IP UA düşürür, sosyal mekanik organik büyüme" },
  ];

  for (const a of analysesData) {
    await sql`INSERT INTO analyses (game_id, user_id, ftue_first_impression, ftue_rating, core_loop_definition, core_loop_rating, monetization_model, monetization_rating, retention_rating, ux_rating, meta_rating, tech_rating, overall_best_feature, overall_worst_feature, overall_target_audience, overall_learnings)
      VALUES (${a.gameId}, ${userId}, ${a.ftueFirstImpression}, ${a.ftueRating}, ${a.coreLoopDefinition}, ${a.coreLoopRating}, ${a.monetizationModel}, ${a.monetizationRating}, ${a.retentionRating}, ${a.uxRating}, ${a.metaRating}, ${a.techRating}, ${a.overallBestFeature}, ${a.overallWorstFeature}, ${a.overallTargetAudience}, ${a.overallLearnings})`;
  }
  console.log("All 5 analyses inserted");

  // AI Analyses
  const aiData = [
    { gameId: games[0].id, summary: "Clash Royale analizi iyi. Core loop ve meta güçlü.", level: "intermediate",
      scores: { ftue:{gameScore:8,analysisQuality:7,comment:"FTUE iyi."}, coreLoop:{gameScore:9,analysisQuality:8,comment:"Core loop mükemmel."}, monetization:{gameScore:7,analysisQuality:6,comment:"Derinlik eksik."}, retention:{gameScore:8,analysisQuality:7,comment:"Klan doğru tespit."}, uxui:{gameScore:8,analysisQuality:6,comment:"UI yüzeysel."}, metaGame:{gameScore:9,analysisQuality:8,comment:"Meta kapsamlı."}, technical:{gameScore:8,analysisQuality:5,comment:"Teknik eksik."} },
      strengths: ["Core loop derinlikli","Meta kapsamlı","Rekabetçi dinamikler iyi"], weaknesses: ["Monetization yüzeysel","Teknik eksik","Rakip karşılaştırma yok"] },
    { gameId: games[1].id, summary: "Royal Match FTUE ve UX konusunda güçlü.", level: "intermediate",
      scores: { ftue:{gameScore:9,analysisQuality:8,comment:"FTUE detaylı."}, coreLoop:{gameScore:8,analysisQuality:7,comment:"Dekorasyon farkı anlaşılmış."}, monetization:{gameScore:8,analysisQuality:6,comment:"Conversion eksik."}, retention:{gameScore:8,analysisQuality:6,comment:"Derinlik eksik."}, uxui:{gameScore:9,analysisQuality:8,comment:"UI/UX güçlü."}, metaGame:{gameScore:7,analysisQuality:6,comment:"Sosyal atlanmış."}, technical:{gameScore:8,analysisQuality:5,comment:"Teknik eksik."} },
      strengths: ["FTUE keskin","UI/UX detaylı","Meta anlaşılmış"], weaknesses: ["Monetization yetersiz","Teknik eksik","Pazar analizi yok"] },
    { gameId: games[2].id, summary: "PUBG Mobile ehrli ve eleştirel analiz.", level: "beginner",
      scores: { ftue:{gameScore:6,analysisQuality:7,comment:"Sorunlar doğru."}, coreLoop:{gameScore:7,analysisQuality:6,comment:"Session length eksik."}, monetization:{gameScore:7,analysisQuality:6,comment:"RP conversion eksik."}, retention:{gameScore:6,analysisQuality:6,comment:"Sosyal doğru."}, uxui:{gameScore:5,analysisQuality:7,comment:"Eleştiri cesur."}, metaGame:{gameScore:6,analysisQuality:5,comment:"Meta yüzeysel."}, technical:{gameScore:7,analysisQuality:5,comment:"Teknik eksik."} },
      strengths: ["UX eleştirisi cesur","FTUE tespiti iyi","Tutarlı"], weaknesses: ["Yüzeysel","Teknik yetersiz","Metrik eksik"] },
    { gameId: games[3].id, summary: "Idle Heroes monetization konusunda cesur analiz.", level: "intermediate",
      scores: { ftue:{gameScore:5,analysisQuality:7,comment:"Bilgi bombardımanı doğru."}, coreLoop:{gameScore:5,analysisQuality:6,comment:"Idle mekanik doğru."}, monetization:{gameScore:4,analysisQuality:8,comment:"VIP eleştirisi güçlü."}, retention:{gameScore:6,analysisQuality:7,comment:"FOMO doğru."}, uxui:{gameScore:4,analysisQuality:7,comment:"Feature bloat yerinde."}, metaGame:{gameScore:5,analysisQuality:5,comment:"Strateji eksik."}, technical:{gameScore:6,analysisQuality:5,comment:"Minimal."} },
      strengths: ["Monetization cesur","Feature bloat güçlü","Idle dengeli"], weaknesses: ["Meta yüzeysel","Teknik eksik","Rakip yok"] },
    { gameId: games[4].id, summary: "Monopoly GO! sosyal mekanikleri iyi yakalamış.", level: "intermediate",
      scores: { ftue:{gameScore:7,analysisQuality:7,comment:"Nostalji güzel."}, coreLoop:{gameScore:6,analysisQuality:7,comment:"Şans sınırı doğru."}, monetization:{gameScore:5,analysisQuality:7,comment:"Zar kıtlığı doğru."}, retention:{gameScore:7,analysisQuality:8,comment:"Sticker viral mükemmel."}, uxui:{gameScore:7,analysisQuality:6,comment:"Monopoly avantajı."}, metaGame:{gameScore:6,analysisQuality:6,comment:"Sticker değerlendirilmiş."}, technical:{gameScore:7,analysisQuality:5,comment:"Minimal."} },
      strengths: ["Sosyal mükemmel","IP anlaşılmış","Monetization dengeli"], weaknesses: ["Pazar eksik","Teknik yetersiz","Casual fark yok"] },
  ];

  for (const ai of aiData) {
    await sql`INSERT INTO ai_analyses (game_id, user_id, executive_summary, category_scores, observation_level, strengths, weaknesses)
      VALUES (${ai.gameId}, ${userId}, ${ai.summary}, ${JSON.stringify(ai.scores)}::jsonb, ${ai.level}, ${JSON.stringify(ai.strengths)}::jsonb, ${JSON.stringify(ai.weaknesses)}::jsonb)`;
  }
  console.log("All 5 AI analyses inserted");

  await sql.end();
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
