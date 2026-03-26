export type QuestionType = "single" | "multiple" | "scale" | "text";

export interface SurveyOption {
  value: string;
  label: { tr: string; en: string };
}

export interface SurveyQuestion {
  id: string;
  category: string;
  type: QuestionType;
  question: { tr: string; en: string };
  options?: SurveyOption[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: { tr: string; en: string }; max: { tr: string; en: string } };
}

export const SURVEY_CATEGORIES = [
  "general_pm",
  "monetization",
  "retention",
  "ux",
  "metrics",
  "market",
  "live_ops",
] as const;

export type SurveyCategory = (typeof SURVEY_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<SurveyCategory, { tr: string; en: string }> = {
  general_pm: { tr: "Genel PM Bilgisi", en: "General PM Knowledge" },
  monetization: { tr: "Monetization", en: "Monetization" },
  retention: { tr: "Retention & Engagement", en: "Retention & Engagement" },
  ux: { tr: "UX/UI & Game Design", en: "UX/UI & Game Design" },
  metrics: { tr: "Metrikler & KPI", en: "Metrics & KPI" },
  market: { tr: "Pazar & Rekabet", en: "Market & Competition" },
  live_ops: { tr: "Live Ops & Growth", en: "Live Ops & Growth" },
};

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  // ===== general_pm (4 questions) =====
  {
    id: "gpm_1",
    category: "general_pm",
    type: "single",
    question: {
      tr: "Bir Gaming PM'in en kritik sorumluluğu hangisidir?",
      en: "What is the most critical responsibility of a Gaming PM?",
    },
    options: [
      { value: "a", label: { tr: "Oyun mekaniği tasarlamak", en: "Designing game mechanics" } },
      { value: "b", label: { tr: "Veri odaklı kararlarla oyun deneyimini optimize etmek", en: "Optimizing game experience with data-driven decisions" } },
      { value: "c", label: { tr: "Pazarlama kampanyaları yönetmek", en: "Managing marketing campaigns" } },
      { value: "d", label: { tr: "Kod yazmak ve bug düzeltmek", en: "Writing code and fixing bugs" } },
    ],
  },
  {
    id: "gpm_2",
    category: "general_pm",
    type: "single",
    question: {
      tr: "PRD (Product Requirements Document) için en önemli bileşen hangisidir?",
      en: "What is the most important component of a PRD?",
    },
    options: [
      { value: "a", label: { tr: "Teknik implementasyon detayları", en: "Technical implementation details" } },
      { value: "b", label: { tr: "Kullanıcı hikayeleri ve kabul kriterleri", en: "User stories and acceptance criteria" } },
      { value: "c", label: { tr: "Gantt chart ve timeline", en: "Gantt chart and timeline" } },
      { value: "d", label: { tr: "Bütçe dağılımı", en: "Budget allocation" } },
    ],
  },
  {
    id: "gpm_3",
    category: "general_pm",
    type: "scale",
    question: {
      tr: "Stakeholder yönetimi konusunda kendinizi ne kadar yetkin hissediyorsunuz?",
      en: "How competent do you feel in stakeholder management?",
    },
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: {
      min: { tr: "Hiç deneyimim yok", en: "No experience" },
      max: { tr: "Çok deneyimliyim", en: "Very experienced" },
    },
  },
  {
    id: "gpm_4",
    category: "general_pm",
    type: "text",
    question: {
      tr: "Bir oyun özelliğini önceliklendirirken hangi framework'ü kullanırsınız? (örn: RICE, ICE, MoSCoW)",
      en: "Which framework do you use to prioritize a game feature? (e.g., RICE, ICE, MoSCoW)",
    },
  },

  // ===== monetization (4 questions) =====
  {
    id: "mon_1",
    category: "monetization",
    type: "single",
    question: {
      tr: "Freemium oyunlarda 'whale' oyuncu segmenti toplam gelirin yaklaşık yüzde kaçını oluşturur?",
      en: "What percentage of total revenue do 'whale' players typically generate in freemium games?",
    },
    options: [
      { value: "a", label: { tr: "%10-20", en: "10-20%" } },
      { value: "b", label: { tr: "%30-40", en: "30-40%" } },
      { value: "c", label: { tr: "%50-70", en: "50-70%" } },
      { value: "d", label: { tr: "%80-90", en: "80-90%" } },
    ],
  },
  {
    id: "mon_2",
    category: "monetization",
    type: "multiple",
    question: {
      tr: "Aşağıdakilerden hangileri Battle Pass sisteminin temel bileşenleridir? (Birden fazla seçin)",
      en: "Which of the following are core components of a Battle Pass system? (Select multiple)",
    },
    options: [
      { value: "a", label: { tr: "Ücretsiz ve premium track", en: "Free and premium track" } },
      { value: "b", label: { tr: "Sezon süresi (genellikle 4-8 hafta)", en: "Season duration (typically 4-8 weeks)" } },
      { value: "c", label: { tr: "Günlük/haftalık görevler ile ilerleme", en: "Progression through daily/weekly missions" } },
      { value: "d", label: { tr: "Rastgele loot box ödülleri", en: "Random loot box rewards" } },
      { value: "e", label: { tr: "FOMO (kaçırma korkusu) mekanizması", en: "FOMO (fear of missing out) mechanic" } },
    ],
  },
  {
    id: "mon_3",
    category: "monetization",
    type: "scale",
    question: {
      tr: "IAP (In-App Purchase) fiyatlandırma stratejileri konusundaki bilginizi nasıl değerlendirirsiniz?",
      en: "How would you rate your knowledge of IAP pricing strategies?",
    },
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: {
      min: { tr: "Çok az biliyorum", en: "Very little knowledge" },
      max: { tr: "İleri düzey biliyorum", en: "Advanced knowledge" },
    },
  },
  {
    id: "mon_4",
    category: "monetization",
    type: "text",
    question: {
      tr: "Bir oyunda dönüşüm oranı (conversion rate) düşükse ne tür müdahaleler önerirsiniz?",
      en: "What interventions would you suggest if a game has a low conversion rate?",
    },
  },

  // ===== retention (4 questions) =====
  {
    id: "ret_1",
    category: "retention",
    type: "single",
    question: {
      tr: "D1 retention oranı genellikle başarılı bir mobil oyun için minimum ne kadar olmalıdır?",
      en: "What is the minimum D1 retention rate typically expected for a successful mobile game?",
    },
    options: [
      { value: "a", label: { tr: "%20-25", en: "20-25%" } },
      { value: "b", label: { tr: "%35-40", en: "35-40%" } },
      { value: "c", label: { tr: "%50-60", en: "50-60%" } },
      { value: "d", label: { tr: "%70+", en: "70%+" } },
    ],
  },
  {
    id: "ret_2",
    category: "retention",
    type: "multiple",
    question: {
      tr: "Aşağıdakilerden hangileri etkili retention stratejileridir? (Birden fazla seçin)",
      en: "Which of the following are effective retention strategies? (Select multiple)",
    },
    options: [
      { value: "a", label: { tr: "Günlük giriş ödülleri (daily login rewards)", en: "Daily login rewards" } },
      { value: "b", label: { tr: "Push notification spam", en: "Push notification spam" } },
      { value: "c", label: { tr: "Sosyal mekanikler (klan, arkadaş sistemi)", en: "Social mechanics (clans, friend system)" } },
      { value: "d", label: { tr: "Streak sistemi", en: "Streak system" } },
      { value: "e", label: { tr: "Enerji/hayat sistemi", en: "Energy/lives system" } },
    ],
  },
  {
    id: "ret_3",
    category: "retention",
    type: "scale",
    question: {
      tr: "LiveOps event planlama ve yürütme konusundaki deneyiminizi değerlendirin.",
      en: "Rate your experience in LiveOps event planning and execution.",
    },
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: {
      min: { tr: "Hiç deneyimim yok", en: "No experience" },
      max: { tr: "Birden fazla event yönettim", en: "Managed multiple events" },
    },
  },
  {
    id: "ret_4",
    category: "retention",
    type: "text",
    question: {
      tr: "D7 retention oranı D1'e göre çok düşükse bunun olası nedenlerini ve çözümlerini açıklayın.",
      en: "If D7 retention is much lower than D1, explain possible causes and solutions.",
    },
  },

  // ===== ux (4 questions) =====
  {
    id: "ux_1",
    category: "ux",
    type: "single",
    question: {
      tr: "FTUE (First Time User Experience) tasarımında en kritik ilke hangisidir?",
      en: "What is the most critical principle in FTUE design?",
    },
    options: [
      { value: "a", label: { tr: "Tüm özellikleri hemen göstermek", en: "Showing all features immediately" } },
      { value: "b", label: { tr: "Oyuncuyu kademeli olarak oyuna alıştırmak (progressive disclosure)", en: "Gradually onboarding the player (progressive disclosure)" } },
      { value: "c", label: { tr: "Uzun bir video tutorial göstermek", en: "Showing a long video tutorial" } },
      { value: "d", label: { tr: "İlk 5 dakikada tüm kuralları metin olarak açıklamak", en: "Explaining all rules as text in the first 5 minutes" } },
    ],
  },
  {
    id: "ux_2",
    category: "ux",
    type: "multiple",
    question: {
      tr: "İyi bir mobil oyun UI'ında bulunması gereken özellikler hangileridir? (Birden fazla seçin)",
      en: "Which features should a good mobile game UI have? (Select multiple)",
    },
    options: [
      { value: "a", label: { tr: "Tek elle oynanabilirlik", en: "One-hand playability" } },
      { value: "b", label: { tr: "Net ve büyük butonlar (minimum 44px)", en: "Clear and large buttons (min 44px)" } },
      { value: "c", label: { tr: "Mümkün olduğunca çok bilgi ekranda göstermek", en: "Showing as much info on screen as possible" } },
      { value: "d", label: { tr: "Tutarlı görsel dil ve renk paleti", en: "Consistent visual language and color palette" } },
      { value: "e", label: { tr: "Haptic feedback (dokunsal geri bildirim)", en: "Haptic feedback" } },
    ],
  },
  {
    id: "ux_3",
    category: "ux",
    type: "scale",
    question: {
      tr: "Oyun UX/UI denetimi (audit) yapma konusundaki yetkinliğinizi değerlendirin.",
      en: "Rate your competency in conducting game UX/UI audits.",
    },
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: {
      min: { tr: "Hiç yapmadım", en: "Never done it" },
      max: { tr: "Profesyonel düzeyde yapıyorum", en: "Professional level" },
    },
  },
  {
    id: "ux_4",
    category: "ux",
    type: "text",
    question: {
      tr: "Bir oyunun tutorialını iyileştirmeniz istense, ilk 3 adımda ne yaparsınız?",
      en: "If asked to improve a game's tutorial, what would your first 3 steps be?",
    },
  },

  // ===== metrics (4 questions) =====
  {
    id: "met_1",
    category: "metrics",
    type: "single",
    question: {
      tr: "LTV (Lifetime Value) hesaplamasında hangi metrikler temel girdidir?",
      en: "Which metrics are fundamental inputs in LTV calculation?",
    },
    options: [
      { value: "a", label: { tr: "DAU ve MAU", en: "DAU and MAU" } },
      { value: "b", label: { tr: "ARPDAU ve retention oranları", en: "ARPDAU and retention rates" } },
      { value: "c", label: { tr: "İndirme sayısı ve rating", en: "Download count and rating" } },
      { value: "d", label: { tr: "Session length ve session count", en: "Session length and session count" } },
    ],
  },
  {
    id: "met_2",
    category: "metrics",
    type: "multiple",
    question: {
      tr: "Aşağıdakilerden hangileri engagement metrikleridir? (Birden fazla seçin)",
      en: "Which of the following are engagement metrics? (Select multiple)",
    },
    options: [
      { value: "a", label: { tr: "DAU/MAU oranı (stickiness)", en: "DAU/MAU ratio (stickiness)" } },
      { value: "b", label: { tr: "Ortalama oturum süresi", en: "Average session duration" } },
      { value: "c", label: { tr: "CPI (Cost Per Install)", en: "CPI (Cost Per Install)" } },
      { value: "d", label: { tr: "Günlük oturum sayısı", en: "Daily session count" } },
      { value: "e", label: { tr: "ROAS (Return on Ad Spend)", en: "ROAS (Return on Ad Spend)" } },
    ],
  },
  {
    id: "met_3",
    category: "metrics",
    type: "scale",
    question: {
      tr: "A/B test tasarlama ve sonuçlarını yorumlama konusundaki deneyiminizi değerlendirin.",
      en: "Rate your experience in designing A/B tests and interpreting results.",
    },
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: {
      min: { tr: "Hiç yapmadım", en: "Never done it" },
      max: { tr: "Düzenli olarak yapıyorum", en: "Doing it regularly" },
    },
  },
  {
    id: "met_4",
    category: "metrics",
    type: "text",
    question: {
      tr: "ARPDAU'nun düşüş trendinde olduğunu fark ettiniz. Kök neden analizi için hangi adımları izlersiniz?",
      en: "You noticed ARPDAU is trending down. What steps do you take for root cause analysis?",
    },
  },

  // ===== market (4 questions) =====
  {
    id: "mkt_1",
    category: "market",
    type: "single",
    question: {
      tr: "Rekabet analizi yaparken en faydalı veri kaynağı hangisidir?",
      en: "What is the most useful data source when conducting competitive analysis?",
    },
    options: [
      { value: "a", label: { tr: "Sadece App Store/Google Play yorumları", en: "Only App Store/Google Play reviews" } },
      { value: "b", label: { tr: "Sensor Tower, data.ai gibi market intelligence araçları", en: "Market intelligence tools like Sensor Tower, data.ai" } },
      { value: "c", label: { tr: "Sosyal medya yorumları", en: "Social media comments" } },
      { value: "d", label: { tr: "Geliştirici blogları", en: "Developer blogs" } },
    ],
  },
  {
    id: "mkt_2",
    category: "market",
    type: "multiple",
    question: {
      tr: "Bir oyunun soft launch aşamasında hangi metrikler izlenir? (Birden fazla seçin)",
      en: "Which metrics are tracked during a game's soft launch? (Select multiple)",
    },
    options: [
      { value: "a", label: { tr: "D1/D7/D30 retention", en: "D1/D7/D30 retention" } },
      { value: "b", label: { tr: "Monetization metrikleri (ARPDAU, conversion)", en: "Monetization metrics (ARPDAU, conversion)" } },
      { value: "c", label: { tr: "Teknik performans (crash rate, load time)", en: "Technical performance (crash rate, load time)" } },
      { value: "d", label: { tr: "Toplam indirme sayısı", en: "Total download count" } },
      { value: "e", label: { tr: "CPI ve organik oran", en: "CPI and organic rate" } },
    ],
  },
  {
    id: "mkt_3",
    category: "market",
    type: "scale",
    question: {
      tr: "Pazar araştırması ve trend analizi konusundaki bilginizi değerlendirin.",
      en: "Rate your knowledge of market research and trend analysis.",
    },
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: {
      min: { tr: "Temel seviye", en: "Basic level" },
      max: { tr: "Kapsamlı analiz yapabiliyorum", en: "Can do comprehensive analysis" },
    },
  },
  {
    id: "mkt_4",
    category: "market",
    type: "text",
    question: {
      tr: "Yeni bir casual oyun çıkarmayı planlıyorsunuz. Pazar analizi için hangi adımları izlersiniz?",
      en: "You're planning to launch a new casual game. What steps do you follow for market analysis?",
    },
  },

  // ===== live_ops (4 questions) =====
  {
    id: "lop_1",
    category: "live_ops",
    type: "single",
    question: {
      tr: "Live ops event takvimi planlanırken en önemli faktör hangisidir?",
      en: "What is the most important factor when planning a live ops event calendar?",
    },
    options: [
      { value: "a", label: { tr: "Mümkün olduğunca sık event yapmak", en: "Running events as frequently as possible" } },
      { value: "b", label: { tr: "Event çeşitliliği ve cadence dengesi", en: "Event variety and cadence balance" } },
      { value: "c", label: { tr: "Sadece monetization odaklı eventler", en: "Only monetization-focused events" } },
      { value: "d", label: { tr: "Rakiplerin event takvimine uyum", en: "Matching competitors' event calendar" } },
    ],
  },
  {
    id: "lop_2",
    category: "live_ops",
    type: "multiple",
    question: {
      tr: "Başarılı bir UA (User Acquisition) stratejisinin bileşenleri hangileridir? (Birden fazla seçin)",
      en: "What are the components of a successful UA strategy? (Select multiple)",
    },
    options: [
      { value: "a", label: { tr: "Kreatif optimizasyonu (video, playable ads)", en: "Creative optimization (video, playable ads)" } },
      { value: "b", label: { tr: "Hedef kitle segmentasyonu", en: "Target audience segmentation" } },
      { value: "c", label: { tr: "LTV tabanlı bütçe dağılımı", en: "LTV-based budget allocation" } },
      { value: "d", label: { tr: "Tek bir kanala odaklanmak", en: "Focusing on a single channel" } },
      { value: "e", label: { tr: "ASO (App Store Optimization)", en: "ASO (App Store Optimization)" } },
    ],
  },
  {
    id: "lop_3",
    category: "live_ops",
    type: "scale",
    question: {
      tr: "Oyun büyüme stratejisi (growth hacking) konusundaki deneyiminizi değerlendirin.",
      en: "Rate your experience in game growth strategy (growth hacking).",
    },
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: {
      min: { tr: "Teorik bilgim var", en: "Theoretical knowledge" },
      max: { tr: "Pratikte uyguluyorum", en: "Applying in practice" },
    },
  },
  {
    id: "lop_4",
    category: "live_ops",
    type: "text",
    question: {
      tr: "Bir oyunun organik büyümesini artırmak için hangi viral mekanikleri önerirsiniz?",
      en: "What viral mechanics would you suggest to increase a game's organic growth?",
    },
  },
];

export function getQuestionsByCategory(category: SurveyCategory): SurveyQuestion[] {
  return SURVEY_QUESTIONS.filter((q) => q.category === category);
}

export function getCategoryProgress(
  responses: Record<string, unknown>,
  category: SurveyCategory
): { answered: number; total: number } {
  const questions = getQuestionsByCategory(category);
  const answered = questions.filter((q) => {
    const val = responses[q.id];
    if (val === undefined || val === null || val === "") return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  }).length;
  return { answered, total: questions.length };
}
