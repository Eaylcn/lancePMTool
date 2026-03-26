export interface GuideQuiz {
  question: { tr: string; en: string };
  options: { value: string; label: { tr: string; en: string } }[];
  correct: string;
  explanation: { tr: string; en: string };
}

export interface GuideSection {
  id: string;
  title: { tr: string; en: string };
  content: { tr: string; en: string };
  keyTerms: { term: { tr: string; en: string }; definition: { tr: string; en: string } }[];
}

export interface GuideChapter {
  id: string;
  title: { tr: string; en: string };
  icon: string;
  sections: GuideSection[];
  quiz: GuideQuiz[];
}

export const PM_GUIDE: GuideChapter[] = [
  {
    id: "what-is-gaming-pm",
    title: { tr: "Gaming PM Nedir?", en: "What is a Gaming PM?" },
    icon: "gamepad",
    sections: [
      {
        id: "role-definition",
        title: { tr: "Rol Tanımı", en: "Role Definition" },
        content: {
          tr: "Gaming Product Manager, bir mobil oyunun yaşam döngüsünü yöneten kişidir. Oyun tasarımı, veri analizi, monetization stratejisi ve kullanıcı deneyimi arasında köprü kurarak oyunun başarısını optimize eder. Geleneksel PM'den farkı, oyun mekaniği, oyuncu psikolojisi ve live operations bilgisine sahip olmasıdır.",
          en: "A Gaming Product Manager manages the lifecycle of a mobile game. They optimize the game's success by bridging game design, data analytics, monetization strategy, and user experience. Unlike traditional PMs, they possess knowledge of game mechanics, player psychology, and live operations.",
        },
        keyTerms: [
          { term: { tr: "Product-Market Fit", en: "Product-Market Fit" }, definition: { tr: "Oyunun hedef kitlesinin ihtiyaçlarını karşılama derecesi", en: "The degree to which a game meets the needs of its target audience" } },
          { term: { tr: "Stakeholder", en: "Stakeholder" }, definition: { tr: "Oyun projesinde çıkarı olan tüm paydaşlar (tasarım, mühendislik, pazarlama, yönetim)", en: "All parties with interest in the game project (design, engineering, marketing, management)" } },
        ],
      },
      {
        id: "key-responsibilities",
        title: { tr: "Temel Sorumluluklar", en: "Key Responsibilities" },
        content: {
          tr: "Gaming PM'in temel sorumlulukları: Feature roadmap oluşturma ve önceliklendirme (RICE, ICE, MoSCoW), veri odaklı karar alma (A/B test, metrik analizi), cross-functional ekip yönetimi, oyuncu geri bildirimlerini ürüne dönüştürme, KPI takibi ve raporlama, rekabet analizi ve pazar araştırması.",
          en: "Key responsibilities of a Gaming PM: Creating and prioritizing feature roadmaps (RICE, ICE, MoSCoW), data-driven decision making (A/B testing, metric analysis), cross-functional team management, translating player feedback into product improvements, KPI tracking and reporting, competitive analysis and market research.",
        },
        keyTerms: [
          { term: { tr: "RICE Framework", en: "RICE Framework" }, definition: { tr: "Reach, Impact, Confidence, Effort — önceliklendirme çerçevesi", en: "Reach, Impact, Confidence, Effort — prioritization framework" } },
          { term: { tr: "PRD", en: "PRD" }, definition: { tr: "Product Requirements Document — ürün gereksinim belgesi", en: "Product Requirements Document — defines what to build and why" } },
        ],
      },
    ],
    quiz: [
      {
        question: { tr: "Gaming PM'i geleneksel PM'den ayıran en önemli özellik nedir?", en: "What distinguishes a Gaming PM from a traditional PM?" },
        options: [
          { value: "a", label: { tr: "Daha yüksek maaş alması", en: "Higher salary" } },
          { value: "b", label: { tr: "Oyun mekaniği ve oyuncu psikolojisi bilgisi", en: "Knowledge of game mechanics and player psychology" } },
          { value: "c", label: { tr: "Daha az toplantıya katılması", en: "Attending fewer meetings" } },
        ],
        correct: "b",
        explanation: { tr: "Gaming PM, oyun tasarımı, oyuncu motivasyonları ve live ops gibi alana özgü bilgiye sahip olmalıdır.", en: "Gaming PMs need domain-specific knowledge of game design, player motivations, and live ops." },
      },
      {
        question: { tr: "RICE framework'ünde 'I' neyi temsil eder?", en: "What does 'I' represent in the RICE framework?" },
        options: [
          { value: "a", label: { tr: "Investment", en: "Investment" } },
          { value: "b", label: { tr: "Impact", en: "Impact" } },
          { value: "c", label: { tr: "Integration", en: "Integration" } },
        ],
        correct: "b",
        explanation: { tr: "RICE: Reach, Impact, Confidence, Effort. Impact, bir özelliğin hedef metriğe etkisini ölçer.", en: "RICE: Reach, Impact, Confidence, Effort. Impact measures the effect on the target metric." },
      },
    ],
  },
  {
    id: "core-loop-game-design",
    title: { tr: "Core Loop & Game Design", en: "Core Loop & Game Design" },
    icon: "refresh",
    sections: [
      {
        id: "core-loop-basics",
        title: { tr: "Core Loop Temelleri", en: "Core Loop Basics" },
        content: {
          tr: "Core loop, oyuncunun sürekli tekrarladığı temel oyun döngüsüdür. Başarılı bir core loop: kolay öğrenilir ama ustalaşması zordur, her iterasyonda küçük bir ilerleme hissi verir ve oyuncuyu bir sonraki oturuma çeker. Örnek: Clash Royale'de kart toplama → deck oluşturma → savaş → ödül → güçlendirme döngüsü.",
          en: "The core loop is the fundamental gameplay cycle that players repeat continuously. A successful core loop: is easy to learn but hard to master, gives a sense of progress each iteration, and draws players to the next session. Example: In Clash Royale, collect cards → build deck → battle → reward → upgrade cycle.",
        },
        keyTerms: [
          { term: { tr: "Session Length", en: "Session Length" }, definition: { tr: "Bir oturumda oyuncunun ortalama oyun süresi", en: "Average time a player spends in a single session" } },
          { term: { tr: "Mastery Curve", en: "Mastery Curve" }, definition: { tr: "Oyuncunun beceri gelişim eğrisi — çok dik veya çok düz olmamalı", en: "Player skill progression curve — shouldn't be too steep or too flat" } },
        ],
      },
      {
        id: "meta-game",
        title: { tr: "Meta Game", en: "Meta Game" },
        content: {
          tr: "Meta game, core loop'un üstündeki uzun vadeli ilerleme sistemleridir: karakter geliştirme, koleksiyon, liderlik tabloları, klan sistemi, sezonluk içerik. Meta game oyuncuyu haftalarca, aylarca bağlı tutar. İyi bir meta: birden fazla ilerleme ekseni sunar, sosyal bağ oluşturur ve yeni içerikle taze kalır.",
          en: "Meta game is the long-term progression system above the core loop: character development, collection, leaderboards, clan system, seasonal content. Meta game keeps players engaged for weeks and months. Good meta: offers multiple progression axes, creates social bonds, and stays fresh with new content.",
        },
        keyTerms: [
          { term: { tr: "Progression System", en: "Progression System" }, definition: { tr: "Oyuncunun uzun vadeli ilerleme mekanizması (seviye, güç, koleksiyon)", en: "Long-term player advancement mechanism (level, power, collection)" } },
          { term: { tr: "Endgame", en: "Endgame" }, definition: { tr: "Oyuncunun tüm ana içeriği tamamladıktan sonraki deneyim", en: "Player experience after completing all main content" } },
        ],
      },
    ],
    quiz: [
      {
        question: { tr: "Başarılı bir core loop'un en önemli özelliği nedir?", en: "What is the most important feature of a successful core loop?" },
        options: [
          { value: "a", label: { tr: "Mümkün olduğunca karmaşık olması", en: "Being as complex as possible" } },
          { value: "b", label: { tr: "Kolay öğrenilip ustalaşmasının zor olması", en: "Easy to learn, hard to master" } },
          { value: "c", label: { tr: "Sadece tek bir mekanikten oluşması", en: "Consisting of only one mechanic" } },
        ],
        correct: "b",
        explanation: { tr: "Easy to learn, hard to master prensibi hem yeni oyuncuları hem de deneyimli oyuncuları memnun eder.", en: "The easy to learn, hard to master principle satisfies both new and experienced players." },
      },
    ],
  },
  {
    id: "monetization",
    title: { tr: "Monetization", en: "Monetization" },
    icon: "coins",
    sections: [
      {
        id: "monetization-models",
        title: { tr: "Monetization Modelleri", en: "Monetization Models" },
        content: {
          tr: "Mobil oyun monetization modelleri: Freemium (ücretsiz indirme + IAP), Premium (tek seferlik ücret), Subscription (aylık abonelik), Reklam destekli (rewarded ads, interstitial, banner), Hibrit (IAP + reklam + battle pass). Günümüzde en yaygın model Freemium + Battle Pass kombinasyonudur. Whale oyuncular (%1-2) gelirin %50-70'ini oluşturur.",
          en: "Mobile game monetization models: Freemium (free download + IAP), Premium (one-time purchase), Subscription (monthly), Ad-supported (rewarded ads, interstitial, banner), Hybrid (IAP + ads + battle pass). The most common model today is Freemium + Battle Pass. Whale players (1-2%) generate 50-70% of revenue.",
        },
        keyTerms: [
          { term: { tr: "IAP", en: "IAP" }, definition: { tr: "In-App Purchase — uygulama içi satın alma", en: "In-App Purchase — purchases made within the app" } },
          { term: { tr: "Whale", en: "Whale" }, definition: { tr: "Yüksek harcama yapan oyuncu segmenti (toplam gelirin büyük kısmı)", en: "High-spending player segment (majority of total revenue)" } },
          { term: { tr: "Conversion Rate", en: "Conversion Rate" }, definition: { tr: "Ücretsiz oyuncuların ödeme yapan oyuncuya dönüşüm oranı", en: "Rate at which free players convert to paying players" } },
        ],
      },
      {
        id: "pricing-strategy",
        title: { tr: "Fiyatlandırma Stratejisi", en: "Pricing Strategy" },
        content: {
          tr: "Etkili fiyatlandırma: Starter pack (düşük fiyat, yüksek değer — ilk satın almayı tetikler), değer merdiveni ($0.99 → $4.99 → $9.99 → $49.99), zaman sınırlı teklifler (FOMO), bundle'lar. İlk IAP'nin fiyatı kritiktir — $0.99-$2.99 arasında olmalı. Battle Pass fiyatı genellikle $5-$15 arasındadır.",
          en: "Effective pricing: Starter pack (low price, high value — triggers first purchase), value ladder ($0.99 → $4.99 → $9.99 → $49.99), time-limited offers (FOMO), bundles. First IAP price is critical — should be $0.99-$2.99. Battle Pass price is typically $5-$15.",
        },
        keyTerms: [
          { term: { tr: "Starter Pack", en: "Starter Pack" }, definition: { tr: "İlk satın almayı teşvik eden düşük fiyatlı, yüksek değerli paket", en: "Low-price, high-value package to encourage first purchase" } },
          { term: { tr: "ARPU", en: "ARPU" }, definition: { tr: "Average Revenue Per User — kullanıcı başına ortalama gelir", en: "Average Revenue Per User" } },
        ],
      },
    ],
    quiz: [
      {
        question: { tr: "Whale oyuncular toplam gelirin yaklaşık yüzde kaçını oluşturur?", en: "What percentage of total revenue do whale players generate?" },
        options: [
          { value: "a", label: { tr: "%10-20", en: "10-20%" } },
          { value: "b", label: { tr: "%50-70", en: "50-70%" } },
          { value: "c", label: { tr: "%90+", en: "90%+" } },
        ],
        correct: "b",
        explanation: { tr: "Whale'ler oyuncu tabanının %1-2'sini oluşturmasına rağmen gelirin %50-70'ini sağlar.", en: "Whales make up 1-2% of the player base but generate 50-70% of revenue." },
      },
    ],
  },
  {
    id: "retention-liveops",
    title: { tr: "Retention & LiveOps", en: "Retention & LiveOps" },
    icon: "calendar",
    sections: [
      {
        id: "retention-fundamentals",
        title: { tr: "Retention Temelleri", en: "Retention Fundamentals" },
        content: {
          tr: "Retention, oyuncuların oyuna geri dönme oranıdır. Temel metrikler: D1 (1. gün, hedef: %35-40+), D7 (7. gün, hedef: %15-20+), D30 (30. gün, hedef: %5-10+). Retention'ı artıran mekanikler: günlük ödüller, streak sistemi, push notification, sosyal bağlar, enerji/hayat sistemi, FOMO eventleri.",
          en: "Retention is the rate at which players return to the game. Key metrics: D1 (Day 1, target: 35-40%+), D7 (Day 7, target: 15-20%+), D30 (Day 30, target: 5-10%+). Mechanics that improve retention: daily rewards, streak system, push notifications, social bonds, energy/lives system, FOMO events.",
        },
        keyTerms: [
          { term: { tr: "D1/D7/D30", en: "D1/D7/D30" }, definition: { tr: "1., 7. ve 30. gün retention oranları", en: "Day 1, Day 7, and Day 30 retention rates" } },
          { term: { tr: "Churn", en: "Churn" }, definition: { tr: "Oyuncuların oyunu terk etme oranı (retention'ın tersi)", en: "Rate at which players leave the game (opposite of retention)" } },
        ],
      },
      {
        id: "liveops-events",
        title: { tr: "LiveOps & Event Yönetimi", en: "LiveOps & Event Management" },
        content: {
          tr: "LiveOps, oyunun yayınlanmasından sonra sürekli içerik ve event akışı sağlamaktır. Event türleri: sezonluk temalar, turnuvalar, sınırlı süreli modlar, topluluk hedefleri, tatil eventleri. İyi bir event takvimi: 2-3 haftalık sezonlar, haftalık mini eventler, sürpriz flash eventler. Her event'in net KPI hedefi olmalı.",
          en: "LiveOps is providing continuous content and event flow after launch. Event types: seasonal themes, tournaments, limited-time modes, community goals, holiday events. Good event calendar: 2-3 week seasons, weekly mini events, surprise flash events. Each event should have clear KPI targets.",
        },
        keyTerms: [
          { term: { tr: "LiveOps", en: "LiveOps" }, definition: { tr: "Oyunun canlı yayında sürekli güncellenmesi ve event yönetimi", en: "Continuous updating and event management of a live game" } },
          { term: { tr: "Event Cadence", en: "Event Cadence" }, definition: { tr: "Eventlerin sıklığı ve ritmi", en: "Frequency and rhythm of events" } },
        ],
      },
    ],
    quiz: [
      {
        question: { tr: "Başarılı bir mobil oyun için D1 retention hedefi ne olmalıdır?", en: "What should be the D1 retention target for a successful mobile game?" },
        options: [
          { value: "a", label: { tr: "%15-20", en: "15-20%" } },
          { value: "b", label: { tr: "%35-40+", en: "35-40%+" } },
          { value: "c", label: { tr: "%60+", en: "60%+" } },
        ],
        correct: "b",
        explanation: { tr: "D1 retention %35-40+ endüstri standardıdır. Altında kalırsa FTUE sorunları araştırılmalıdır.", en: "D1 retention of 35-40%+ is the industry standard. Below this indicates FTUE issues to investigate." },
      },
    ],
  },
  {
    id: "metrics-kpi",
    title: { tr: "Metrikler & KPI", en: "Metrics & KPI" },
    icon: "chart",
    sections: [
      {
        id: "core-metrics",
        title: { tr: "Temel Metrikler", en: "Core Metrics" },
        content: {
          tr: "Her Gaming PM'in bilmesi gereken metrikler: DAU/MAU (günlük/aylık aktif kullanıcı), Stickiness (DAU/MAU oranı, hedef: %20+), ARPDAU (günlük kullanıcı başına gelir), LTV (lifetime value — bir oyuncunun toplam değeri), CPI (cost per install), ROAS (return on ad spend). LTV > CPI olmalı, aksi halde oyun kâr edemez.",
          en: "Metrics every Gaming PM must know: DAU/MAU (daily/monthly active users), Stickiness (DAU/MAU ratio, target: 20%+), ARPDAU (average revenue per daily active user), LTV (lifetime value — total value of a player), CPI (cost per install), ROAS (return on ad spend). LTV must exceed CPI, otherwise the game can't profit.",
        },
        keyTerms: [
          { term: { tr: "LTV", en: "LTV" }, definition: { tr: "Lifetime Value — bir oyuncunun yaşam boyu toplam gelir katkısı", en: "Lifetime Value — total revenue contribution of a player over their lifetime" } },
          { term: { tr: "ARPDAU", en: "ARPDAU" }, definition: { tr: "Average Revenue Per DAU — günlük aktif kullanıcı başına ortalama gelir", en: "Average Revenue Per Daily Active User" } },
          { term: { tr: "CPI", en: "CPI" }, definition: { tr: "Cost Per Install — bir kullanıcı edinmenin maliyeti", en: "Cost Per Install — cost of acquiring one user" } },
        ],
      },
      {
        id: "ab-testing",
        title: { tr: "A/B Test & Veri Analizi", en: "A/B Testing & Data Analysis" },
        content: {
          tr: "A/B test, iki veya daha fazla varyantı karşılaştırarak en iyi performansı bulan yöntemdir. Adımlar: hipotez oluştur, metrik belirle, örneklem büyüklüğünü hesapla, testi çalıştır, istatistiksel anlamlılığı kontrol et (p < 0.05). Gaming'de sık test edilen: FTUE akışı, fiyatlandırma, UI yerleşimi, event mekanikleri, push notification zamanlaması.",
          en: "A/B testing compares two or more variants to find the best performance. Steps: form hypothesis, define metric, calculate sample size, run test, check statistical significance (p < 0.05). Common gaming tests: FTUE flow, pricing, UI layout, event mechanics, push notification timing.",
        },
        keyTerms: [
          { term: { tr: "Statistical Significance", en: "Statistical Significance" }, definition: { tr: "Sonuçların şansa bağlı olmadığını gösteren istatistiksel güven (p < 0.05)", en: "Statistical confidence that results aren't due to chance (p < 0.05)" } },
          { term: { tr: "Control Group", en: "Control Group" }, definition: { tr: "A/B testte değişiklik yapılmayan referans grup", en: "Reference group with no changes in an A/B test" } },
        ],
      },
    ],
    quiz: [
      {
        question: { tr: "LTV hesaplamasının temel girdileri nelerdir?", en: "What are the fundamental inputs of LTV calculation?" },
        options: [
          { value: "a", label: { tr: "DAU ve MAU", en: "DAU and MAU" } },
          { value: "b", label: { tr: "ARPDAU ve retention oranları", en: "ARPDAU and retention rates" } },
          { value: "c", label: { tr: "İndirme sayısı ve CPI", en: "Download count and CPI" } },
        ],
        correct: "b",
        explanation: { tr: "LTV = ARPDAU × Lifetime (retention'dan türetilir). ARPDAU ve retention temel girdilerdir.", en: "LTV = ARPDAU × Lifetime (derived from retention). ARPDAU and retention are fundamental inputs." },
      },
    ],
  },
  {
    id: "user-research",
    title: { tr: "Kullanıcı Araştırması & UX", en: "User Research & UX" },
    icon: "users",
    sections: [
      {
        id: "research-methods",
        title: { tr: "Araştırma Yöntemleri", en: "Research Methods" },
        content: {
          tr: "Oyuncu araştırma yöntemleri: Oyuncu anketleri (Typeform, SurveyMonkey), playtesting (gözlem + düşünce protokolü), store review analizi (sentiment analysis), topluluk takibi (Discord, Reddit, forum), heatmap ve session recording (oyun içi etkileşim haritası), cohort analizi (oyuncu segmentlerine göre davranış karşılaştırması).",
          en: "Player research methods: Player surveys (Typeform, SurveyMonkey), playtesting (observation + think-aloud protocol), store review analysis (sentiment analysis), community monitoring (Discord, Reddit, forums), heatmaps and session recording (in-game interaction maps), cohort analysis (behavior comparison by player segments).",
        },
        keyTerms: [
          { term: { tr: "Playtesting", en: "Playtesting" }, definition: { tr: "Gerçek kullanıcılarla oyunu test etme ve gözlemleme süreci", en: "Testing and observing the game with real users" } },
          { term: { tr: "Cohort Analysis", en: "Cohort Analysis" }, definition: { tr: "Benzer özellikteki kullanıcı gruplarını karşılaştırma", en: "Comparing groups of users with similar characteristics" } },
        ],
      },
      {
        id: "ftue-design",
        title: { tr: "FTUE Tasarımı", en: "FTUE Design" },
        content: {
          tr: "FTUE (First Time User Experience) ilk 5 dakikadır ve D1 retention'ı doğrudan etkiler. İlkeler: Progressive disclosure (kademeli öğretme), yaparak öğrenme (metin duvarı değil), erken ödül (aha moment), minimum sürtünme (izin isteklerini ertele), net hedef (oyuncunun ne yapacağını bilmesi). FTUE optimizasyonu en yüksek ROI'li iyileştirmedir.",
          en: "FTUE (First Time User Experience) is the first 5 minutes and directly impacts D1 retention. Principles: Progressive disclosure, learning by doing (not text walls), early reward (aha moment), minimum friction (delay permission requests), clear goals. FTUE optimization is the highest ROI improvement.",
        },
        keyTerms: [
          { term: { tr: "Progressive Disclosure", en: "Progressive Disclosure" }, definition: { tr: "Bilgiyi kademeli olarak gösterme — oyuncuyu bunaltmama", en: "Gradually revealing information — not overwhelming the player" } },
          { term: { tr: "Aha Moment", en: "Aha Moment" }, definition: { tr: "Oyuncunun oyunun değerini anladığı kritik an", en: "Critical moment when the player understands the game's value" } },
        ],
      },
    ],
    quiz: [
      {
        question: { tr: "FTUE tasarımında en önemli ilke hangisidir?", en: "What is the most important principle in FTUE design?" },
        options: [
          { value: "a", label: { tr: "Tüm özellikleri ilk 2 dakikada göstermek", en: "Showing all features in the first 2 minutes" } },
          { value: "b", label: { tr: "Progressive disclosure — kademeli öğretme", en: "Progressive disclosure — gradual teaching" } },
          { value: "c", label: { tr: "Uzun bir yazılı tutorial", en: "A long written tutorial" } },
        ],
        correct: "b",
        explanation: { tr: "Progressive disclosure oyuncuyu bunaltmadan kademeli olarak öğretir ve D1 retention'ı artırır.", en: "Progressive disclosure teaches gradually without overwhelming players and improves D1 retention." },
      },
    ],
  },
  {
    id: "market-analysis",
    title: { tr: "Pazar Analizi", en: "Market Analysis" },
    icon: "search",
    sections: [
      {
        id: "competitive-analysis",
        title: { tr: "Rekabet Analizi", en: "Competitive Analysis" },
        content: {
          tr: "Rekabet analizi araçları: Sensor Tower, data.ai (eski App Annie), GameRefinery — indirme, gelir, retention tahminleri sağlar. Analiz adımları: doğrudan ve dolaylı rakipleri belirle, feature matris oluştur, monetization modellerini karşılaştır, store listing ve ASO stratejilerini incele, güçlü/zayıf yönleri belirle. Her yeni özellik öncesi rakip benchmarking yapılmalı.",
          en: "Competitive analysis tools: Sensor Tower, data.ai (formerly App Annie), GameRefinery — provide download, revenue, and retention estimates. Steps: identify direct and indirect competitors, create feature matrix, compare monetization models, analyze store listings and ASO strategies, identify strengths/weaknesses. Competitor benchmarking should precede every new feature.",
        },
        keyTerms: [
          { term: { tr: "ASO", en: "ASO" }, definition: { tr: "App Store Optimization — uygulama mağazası optimizasyonu", en: "App Store Optimization — optimizing app store presence" } },
          { term: { tr: "Feature Matrix", en: "Feature Matrix" }, definition: { tr: "Rakip oyunların özelliklerini karşılaştıran tablo", en: "Table comparing features across competitor games" } },
        ],
      },
      {
        id: "soft-launch",
        title: { tr: "Soft Launch Stratejisi", en: "Soft Launch Strategy" },
        content: {
          tr: "Soft launch, oyunu sınırlı pazarda test etme sürecidir. Amaç: core KPI'ları doğrulama (retention, monetization, CPI). Tipik süre: 2-6 ay. Ülke seçimi: Kanada, Avustralya, Nordik ülkeleri (ABD pazarına benzer demografik). İzlenecek metrikler: D1/D7/D30, ARPDAU, conversion rate, session metrics, crash rate. Go/no-go kararı bu verilere dayanır.",
          en: "Soft launch is testing the game in limited markets. Purpose: validating core KPIs (retention, monetization, CPI). Typical duration: 2-6 months. Country selection: Canada, Australia, Nordic countries (similar demographics to US). Metrics to track: D1/D7/D30, ARPDAU, conversion rate, session metrics, crash rate. Go/no-go decision is based on this data.",
        },
        keyTerms: [
          { term: { tr: "Soft Launch", en: "Soft Launch" }, definition: { tr: "Oyunu sınırlı pazarda test yayını yapma", en: "Testing the game in a limited market before global launch" } },
          { term: { tr: "Go/No-Go", en: "Go/No-Go" }, definition: { tr: "Soft launch verilerine göre global yayın kararı", en: "Global launch decision based on soft launch data" } },
        ],
      },
    ],
    quiz: [
      {
        question: { tr: "Soft launch'ta en önemli izlenecek metrikler hangileridir?", en: "What are the most important metrics to track during soft launch?" },
        options: [
          { value: "a", label: { tr: "Sosyal medya takipçi sayısı", en: "Social media follower count" } },
          { value: "b", label: { tr: "Retention, ARPDAU, CPI", en: "Retention, ARPDAU, CPI" } },
          { value: "c", label: { tr: "Toplam indirme sayısı", en: "Total download count" } },
        ],
        correct: "b",
        explanation: { tr: "Retention, ARPDAU ve CPI soft launch'ın üç temel metriğidir — oyunun sürdürülebilirliğini gösterir.", en: "Retention, ARPDAU, and CPI are the three fundamental soft launch metrics — they indicate game sustainability." },
      },
    ],
  },
  {
    id: "interview-prep",
    title: { tr: "Mülakat Hazırlığı", en: "Interview Preparation" },
    icon: "briefcase",
    sections: [
      {
        id: "common-questions",
        title: { tr: "Sık Sorulan Sorular", en: "Common Questions" },
        content: {
          tr: "Gaming PM mülakat soruları: 'En son oynadığın oyunu analiz et' (FTUE, core loop, monetization, retention), 'D7 retention düşüyorsa ne yaparsın?' (veri analizi → hipotez → A/B test), 'Bu oyuna yeni bir özellik ekle' (kullanıcı problemi → çözüm → metrik → prioritize), 'Bir oyunun LTV'sini nasıl artırırsın?' (retention + monetization optimization), 'Takımda anlaşmazlık olursa ne yaparsın?' (veri odaklı karar, stakeholder yönetimi).",
          en: "Gaming PM interview questions: 'Analyze a game you recently played' (FTUE, core loop, monetization, retention), 'What would you do if D7 retention drops?' (data analysis → hypothesis → A/B test), 'Add a new feature to this game' (user problem → solution → metric → prioritize), 'How would you increase a game's LTV?' (retention + monetization optimization), 'How would you handle team disagreement?' (data-driven decisions, stakeholder management).",
        },
        keyTerms: [
          { term: { tr: "Case Study", en: "Case Study" }, definition: { tr: "Mülakatta verilen senaryo bazlı problem çözme egzersizi", en: "Scenario-based problem-solving exercise given in interviews" } },
          { term: { tr: "Product Sense", en: "Product Sense" }, definition: { tr: "Doğru ürün kararları alabilme yetkinliği", en: "Ability to make the right product decisions" } },
        ],
      },
      {
        id: "portfolio-tips",
        title: { tr: "Portfolio İpuçları", en: "Portfolio Tips" },
        content: {
          tr: "Güçlü bir Gaming PM portfolyosu: 3-5 detaylı oyun analizi (her biri FTUE'den monetization'a kadar), AI mentor değerlendirmesi ile desteklenmiş analizler, metrik bilgisi gösteren KPI/trend notları, rekabet analizi karşılaştırmaları. GameLens gibi araçlar bu analizleri yapılandırmanıza yardımcı olur. Her analizde 'Ben olsam ne değiştirirdim?' bölümü eklemek mülakatta fark yaratır.",
          en: "A strong Gaming PM portfolio: 3-5 detailed game analyses (each from FTUE to monetization), analyses backed by AI mentor evaluations, KPI/trend notes showing metric knowledge, competitive analysis comparisons. Tools like GameLens help structure these analyses. Adding a 'What I would change' section to each analysis makes a difference in interviews.",
        },
        keyTerms: [
          { term: { tr: "Game Teardown", en: "Game Teardown" }, definition: { tr: "Bir oyunun derinlemesine analiz raporu", en: "In-depth analysis report of a game" } },
        ],
      },
    ],
    quiz: [
      {
        question: { tr: "Gaming PM mülakatında oyun analizi yaparken hangi sırayı takip etmelisiniz?", en: "What order should you follow when analyzing a game in a PM interview?" },
        options: [
          { value: "a", label: { tr: "Monetization → Grafik kalitesi → Ses tasarımı", en: "Monetization → Graphics quality → Sound design" } },
          { value: "b", label: { tr: "FTUE → Core Loop → Monetization → Retention → Meta", en: "FTUE → Core Loop → Monetization → Retention → Meta" } },
          { value: "c", label: { tr: "İndirme sayısı → Store rating → Reklam analizi", en: "Download count → Store rating → Ad analysis" } },
        ],
        correct: "b",
        explanation: { tr: "FTUE → Core Loop → Monetization → Retention → Meta sırası, oyuncu deneyimini baştan sona sistematik olarak analiz eder.", en: "FTUE → Core Loop → Monetization → Retention → Meta order systematically analyzes the player experience from start to finish." },
      },
    ],
  },
];
