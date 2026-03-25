import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { games, analyses, aiAnalyses } from "@/lib/db/schema";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized — giriş yap önce" }, { status: 401 });
  }

  const seedGames = [
    {
      userId: user.id,
      title: "Clash Royale",
      studio: "Supercell",
      genre: ["strategy", "card", "moba"],
      platform: "both" as const,
      status: "completed" as const,
      overallRating: "8.5",
      isTemplate: true,
    },
    {
      userId: user.id,
      title: "Royal Match",
      studio: "Dream Games",
      genre: ["match3", "puzzle", "casual"],
      platform: "both" as const,
      status: "playing" as const,
      overallRating: "7.8",
      isTemplate: true,
    },
    {
      userId: user.id,
      title: "PUBG Mobile",
      studio: "Tencent Games",
      genre: ["battle_royale", "shooter"],
      platform: "both" as const,
      status: "completed" as const,
      overallRating: "7.2",
      isTemplate: true,
    },
    {
      userId: user.id,
      title: "Idle Heroes",
      studio: "DH Games",
      genre: ["idle", "rpg"],
      platform: "both" as const,
      status: "dropped" as const,
      overallRating: "5.5",
      isTemplate: true,
    },
    {
      userId: user.id,
      title: "Monopoly GO!",
      studio: "Scopely",
      genre: ["casual", "social_casino"],
      platform: "both" as const,
      status: "playing" as const,
      overallRating: "6.9",
      isTemplate: true,
    },
  ];

  const inserted = await db.insert(games).values(seedGames).returning();

  // Template analyses for first 3 games
  const templateAnalyses = [
    {
      gameId: inserted[0].id, // Clash Royale
      userId: user.id,
      ftueFirstImpression: "Oyun hızlıca tutorial ile başlıyor. İlk maç yapay zekaya karşı, oyuncu temel mekanikleri öğreniyor.",
      ftueOnboardingType: "Interactive tutorial — adım adım kart yerleştirme ve savaş mekaniği öğretiliyor",
      ftueDuration: "3-5 dakika",
      ftueFrictionPoints: "İlk birkaç maçta kart çeşitliliği az, bu hayal kırıklığı yaratabilir",
      ftueRating: "8",
      ftueNotes: "FTUE oldukça başarılı. Oyuncu hemen aksiyon görüyor, uzun metin duvarları yok. Tutorial maçı kaybedilemez tasarlanmış, bu güven veriyor.",
      coreLoopDefinition: "Kart toplama → deck oluşturma → 1v1 gerçek zamanlı savaş → kupa kazanma → sandık açma → yeni kartlar",
      coreLoopSessionLength: "3-5 dakika (tek maç)",
      coreLoopMasteryCurve: "Öğrenmesi kolay, ustalaşması zor. Elixir yönetimi ve kart sayma derin strateji gerektiriyor.",
      coreLoopVariety: "8 kartlık deck sınırı yaratıcılığı zorunlu kılıyor. Meta sürekli değişiyor.",
      coreLoopRating: "9",
      coreLoopNotes: "Core loop mükemmel tasarlanmış. Kısa maçlar yüksek replay value sağlıyor. Gerçek zamanlı PvP heyecan katıyor.",
      monetizationModel: "Freemium — IAP + Battle Pass (Gold Pass)",
      monetizationIap: "Gem paketleri, özel teklifler, arena değeri paketleri",
      monetizationAds: "Reklam yok — tamamen IAP odaklı",
      monetizationBattlePass: "Gold Pass: aylık premium ödüller, chest hızlandırma, özel emote",
      monetizationRating: "7",
      monetizationNotes: "Monetization agresif değil ama pay-to-progress unsuru var. Kart seviyeleri yükseldikçe F2P oyuncular dezavantajlı.",
      retentionRewards: "Günlük sandıklar, savaş ödülleri, klan savaşı ödülleri",
      retentionStreak: "Günlük görevler ve haftalık yarışmalar",
      retentionRating: "8",
      retentionNotes: "Klan sistemi sosyal bağ oluşturuyor. Ladder sistemi sürekli ilerleme hissi veriyor. Sezonluk resetler geri dönüş motivasyonu sağlıyor.",
      uxRating: "8",
      uxNotes: "UI temiz ve responsive. Kart bilgileri kolayca erişilebilir. Battle UI sade ama etkili.",
      metaSystems: "Klan savaşları, turnuvalar, sezonluk ligi, kart koleksiyonu, yıldız seviyeleri",
      metaRating: "9",
      metaNotes: "Meta sistemler çok katmanlı ve derinlik katıyor. Klan sistemi sosyal mekaniklerin en iyilerinden.",
      techRating: "8",
      overallBestFeature: "Gerçek zamanlı 1v1 PvP ve kısa maç süreleri",
      overallWorstFeature: "Kart seviye farkının rekabetçi dengeyi bozması",
      overallUniqueMechanic: "Gerçek zamanlı kart tabanlı strateji — lane-based tower defense hybrid",
      overallTargetAudience: "Kompetitif oyuncular, strateji severler, 16-35 yaş",
      overallLearnings: "Kısa oturum + derin strateji kombinasyonu mobilde çok etkili. Sosyal mekanikler (klan) retention için kritik.",
    },
    {
      gameId: inserted[1].id, // Royal Match
      userId: user.id,
      ftueFirstImpression: "Renkli, sıcak ve davetkar bir açılış. Kral karakteri anında sempati uyandırıyor.",
      ftueOnboardingType: "Guided puzzle — ilk 5 seviye mekanik öğretiyor",
      ftueDuration: "2-3 dakika",
      ftueRating: "9",
      ftueNotes: "FTUE çok akıcı. Oyuncu hiç zorlanmadan temel eşleme mekaniğini öğreniyor. Dekorasyon sistemi hemen tanıtılıyor.",
      coreLoopDefinition: "Puzzle çöz → yıldız kazan → krallığı dekore et → yeni alan aç → puzzle çöz",
      coreLoopSessionLength: "5-15 dakika",
      coreLoopRating: "8",
      coreLoopNotes: "Match-3 mekanik sağlam ama devrimci değil. Dekorasyon katmanı progression hissi veriyor.",
      monetizationModel: "Freemium — IAP + reklamlı ödüller",
      monetizationRating: "8",
      monetizationNotes: "Monetization dengeli. Oyuncu zorlandığında satın alma teşviki var ama agresif değil.",
      retentionRating: "8",
      retentionNotes: "Günlük ödüller, takım etkinlikleri ve sürekli yeni seviyeler retention sağlıyor.",
      uxRating: "9",
      uxNotes: "UI son derece temiz ve polished. Animasyonlar akıcı, feedback tatmin edici.",
      metaRating: "7",
      overallBestFeature: "Görsel kalite ve dekorasyon meta sistemi",
      overallWorstFeature: "Puzzle mekaniği diğer match-3 oyunlardan farksız",
      overallTargetAudience: "Casual oyuncular, 25-45 yaş, çoğunlukla kadın demografisi",
      overallLearnings: "Güçlü bir meta progression (dekorasyon) sıradan bir core loop'u bile çekici kılabiliyor.",
    },
    {
      gameId: inserted[2].id, // PUBG Mobile
      userId: user.id,
      ftueFirstImpression: "Oyun büyüklüğü nedeniyle uzun indirme süresi. Giriş ekranı etkileyici ama karmaşık.",
      ftueOnboardingType: "Bot lobby — ilk maçlar kolaylaştırılmış AI rakiplerle",
      ftueDuration: "15-20 dakika (ilk maç)",
      ftueRating: "6",
      ftueNotes: "FTUE zayıf nokta. Kontroller karmaşık, öğrenme eğrisi dik. Bot lobby güven veriyor ama oyuncu fark etmeyebilir.",
      coreLoopDefinition: "Lobi → uçaktan atla → loot topla → hayatta kal → savaş → chicken dinner veya elim → tekrar",
      coreLoopSessionLength: "20-30 dakika (tek maç)",
      coreLoopRating: "7",
      coreLoopNotes: "Battle royale formatı heyecan verici ama uzun oturum süresi mobil için dezavantaj.",
      monetizationModel: "Freemium — kozmetik IAP + Royale Pass",
      monetizationRating: "7",
      monetizationNotes: "Kozmetik odaklı, P2W yok. Royale Pass iyi değer sunuyor.",
      retentionRating: "6",
      retentionNotes: "Günlük görevler ve Royale Pass ilerleme sağlıyor. Arkadaşlarla oynama güçlü retention mekanizması.",
      uxRating: "5",
      uxNotes: "Menüler çok karmaşık. Yeni oyuncu için overwhelming. Kontrol özelleştirmesi güçlü ama başlangıçta kafa karıştırıcı.",
      metaRating: "6",
      overallBestFeature: "PC kalitesinde battle royale deneyimi mobilde",
      overallWorstFeature: "UI karmaşıklığı ve uzun maç süreleri",
      overallTargetAudience: "Hardcore oyuncular, shooter severler, 16-30 yaş",
      overallLearnings: "Mobilde uzun oturum süreleri riskli. UI basitliği kritik — PUBG'nin menü karmaşıklığı yeni oyuncu kaybettirebilir.",
    },
  ];

  await db.insert(analyses).values(templateAnalyses);

  // Template AI analyses for first 3 games
  const templateAiAnalyses = [
    {
      gameId: inserted[0].id, // Clash Royale
      userId: user.id,
      executiveSummary: "Clash Royale, mobil oyun endüstrisinin en başarılı örneklerinden biri. Gerçek zamanlı PvP, kısa oturum süreleri ve derin strateji kombinasyonu. Analiz kalitesi iyi seviyede, ancak monetization ve retention mekaniklerinin derinlemesine incelenmesi gerekiyor.",
      categoryScores: {
        ftue: { gameScore: 8, analysisQuality: 7, comment: "FTUE analizi iyi yapılmış. Tutorial flow'un detayları doğru gözlemlenmiş." },
        coreLoop: { gameScore: 9, analysisQuality: 8, comment: "Core loop tanımı mükemmel. Elixir yönetimi ve deck building derinliği doğru tespit edilmiş." },
        monetization: { gameScore: 7, analysisQuality: 6, comment: "Monetization modeli tanımlanmış ama derinlik eksik. P2W vs P2P tartışması yapılmalıydı." },
        retention: { gameScore: 8, analysisQuality: 7, comment: "Klan sistemi ve ladder mekanikleri doğru tespit edilmiş." },
        uxui: { gameScore: 8, analysisQuality: 6, comment: "UI değerlendirmesi yüzeysel kalmış. Battle UI'daki bilgi hiyerarşisi analiz edilmeliydi." },
        metaGame: { gameScore: 9, analysisQuality: 8, comment: "Meta sistem analizi kapsamlı. Klan savaşlarının sosyal etkisi iyi gözlemlenmiş." },
        technical: { gameScore: 8, analysisQuality: 5, comment: "Teknik analiz eksik. Netcode, sunucu altyapısı ve matchmaking sistemi incelenmeliydi." },
      },
      observationLevel: "intermediate",
      strengths: ["Core loop analizi derinlikli", "Meta sistem gözlemleri kapsamlı", "Rekabetçi dinamikler iyi anlaşılmış"],
      weaknesses: ["Monetization analizi yüzeysel", "Teknik altyapı değerlendirilmemiş", "Rakip karşılaştırması eksik"],
    },
    {
      gameId: inserted[1].id, // Royal Match
      userId: user.id,
      executiveSummary: "Royal Match, match-3 pazarında Dream Games'in büyük başarısı. Görsel kalite ve meta progression (dekorasyon) ile fark yaratıyor. Analiz temel noktaları yakalamış ancak pazarlama stratejisi ve UA yaklaşımı eksik.",
      categoryScores: {
        ftue: { gameScore: 9, analysisQuality: 8, comment: "FTUE analizi detaylı ve doğru. Kral karakterinin empati yaratma etkisi güzel tespit." },
        coreLoop: { gameScore: 8, analysisQuality: 7, comment: "Match-3 mekaniğinin standart olduğu doğru gözlem. Dekorasyon katmanının farkı anlaşılmış." },
        monetization: { gameScore: 8, analysisQuality: 6, comment: "Monetization modeli tanımlanmış ama conversion funnel ve LTV analizi yapılmalıydı." },
        retention: { gameScore: 8, analysisQuality: 6, comment: "Retention mekanikleri listelenmiş ama derinlik eksik." },
        uxui: { gameScore: 9, analysisQuality: 8, comment: "UI/UX analizi güçlü. Animasyon kalitesi ve feedback döngüsü doğru gözlemlenmiş." },
        metaGame: { gameScore: 7, analysisQuality: 6, comment: "Dekorasyon sistemi değerlendirilmiş ama sosyal mekanikler atlanmış." },
        technical: { gameScore: 8, analysisQuality: 5, comment: "Teknik analiz eksik. Performans optimizasyonu ve cross-platform deneyim incelenmeliydi." },
      },
      observationLevel: "intermediate",
      strengths: ["FTUE gözlemleri keskin", "UI/UX analizi detaylı", "Meta progression farkı anlaşılmış"],
      weaknesses: ["Monetization derinliği yetersiz", "Teknik analiz eksik", "Pazar pozisyonu analizi yok"],
    },
    {
      gameId: inserted[2].id, // PUBG Mobile
      userId: user.id,
      executiveSummary: "PUBG Mobile, battle royale türünün mobil öncüsü. PC deneyimini başarıyla mobilde sunuyor ama UI karmaşıklığı ve uzun oturum süreleri zayıf noktaları. Analiz ehrli ve eleştirel, bu PM adayı için olumlu bir işaret.",
      categoryScores: {
        ftue: { gameScore: 6, analysisQuality: 7, comment: "FTUE sorunları doğru tespit edilmiş. Bot lobby yaklaşımı ve kontrol karmaşıklığı iyi analiz edilmiş." },
        coreLoop: { gameScore: 7, analysisQuality: 6, comment: "Battle royale döngüsü tanımlanmış ama session length'in retention etkisi derinleştirilmeliydi." },
        monetization: { gameScore: 7, analysisQuality: 6, comment: "Kozmetik odaklı model doğru ama Royale Pass'in conversion metrikleri tartışılmalıydı." },
        retention: { gameScore: 6, analysisQuality: 6, comment: "Sosyal oynanış retention etkisi doğru tespit ama mekanik detay eksik." },
        uxui: { gameScore: 5, analysisQuality: 7, comment: "UI eleştirisi cesur ve doğru. Menü karmaşıklığının yeni oyuncu kaybına etkisi iyi gözlem." },
        metaGame: { gameScore: 6, analysisQuality: 5, comment: "Meta sistem analizi yüzeysel. Ranking, achievement ve koleksiyon sistemleri incelenmeliydi." },
        technical: { gameScore: 7, analysisQuality: 5, comment: "Teknik analiz eksik. Grafik ayarları, ping/latency ve cihaz optimizasyonu kritik konular." },
      },
      observationLevel: "beginner",
      strengths: ["UX eleştirisi cesur ve doğru", "FTUE sorunları iyi tespit edilmiş", "Genel değerlendirmeler tutarlı"],
      weaknesses: ["Analiz genel olarak yüzeysel", "Teknik derinlik çok yetersiz", "Metrik ve veri odaklı yaklaşım eksik"],
    },
  ];

  await db.insert(aiAnalyses).values(templateAiAnalyses);

  return NextResponse.json({
    message: `${inserted.length} seed oyun + 3 analiz + 3 AI analiz eklendi`,
    games: inserted.map((g) => ({ id: g.id, title: g.title })),
  });
}
