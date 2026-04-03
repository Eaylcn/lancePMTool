import type { SurveyTemplate, SurveyTemplateType } from "@/lib/types/survey";

export const SURVEY_TEMPLATE_TYPES: SurveyTemplateType[] = [
  "player_satisfaction",
  "beta_feedback",
  "ux_usability",
  "churn_analysis",
  "feature_prioritization",
  "monetization_perception",
  "market_research",
];

export const SURVEY_TEMPLATES: SurveyTemplate[] = [
  // ===================================================================
  // 1. PLAYER SATISFACTION (Oyuncu Memnuniyeti)
  // ===================================================================
  {
    type: "player_satisfaction",
    title: { tr: "Oyuncu Memnuniyeti Anketi", en: "Player Satisfaction Survey" },
    description: {
      tr: "Oyuncularınızın genel deneyimini, memnuniyet seviyelerini ve NPS puanını ölçün.",
      en: "Measure your players' overall experience, satisfaction levels, and NPS score.",
    },
    icon: "Smile",
    color: "emerald",
    estimatedMinutes: 5,
    questions: [
      {
        id: "ps_1",
        type: "scale",
        question: {
          tr: "Bu oyunu bir arkadaşınıza veya meslektaşınıza tavsiye etme olasılığınız nedir?",
          en: "How likely are you to recommend this game to a friend or colleague?",
        },
        required: true,
        scaleMin: 0,
        scaleMax: 10,
        scaleLabels: {
          min: { tr: "Kesinlikle tavsiye etmem", en: "Not at all likely" },
          max: { tr: "Kesinlikle tavsiye ederim", en: "Extremely likely" },
        },
      },
      {
        id: "ps_2",
        type: "scale",
        question: {
          tr: "Oyundan genel olarak ne kadar memnunsunuz?",
          en: "How satisfied are you with the game overall?",
        },
        required: true,
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Hiç memnun değilim", en: "Very dissatisfied" },
          max: { tr: "Çok memnunum", en: "Very satisfied" },
        },
      },
      {
        id: "ps_3",
        type: "single",
        question: {
          tr: "Oyunu ne sıklıkla oynuyorsunuz?",
          en: "How often do you play the game?",
        },
        required: true,
        options: [
          { value: "daily", label: { tr: "Her gün", en: "Every day" } },
          { value: "several_week", label: { tr: "Haftada birkaç kez", en: "Several times a week" } },
          { value: "once_week", label: { tr: "Haftada bir", en: "Once a week" } },
          { value: "less", label: { tr: "Daha az", en: "Less often" } },
        ],
      },
      {
        id: "ps_4",
        type: "scale",
        question: {
          tr: "Oyunun grafiklerinden ne kadar memnunsunuz?",
          en: "How satisfied are you with the game's graphics?",
        },
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Hiç memnun değilim", en: "Very dissatisfied" },
          max: { tr: "Çok memnunum", en: "Very satisfied" },
        },
      },
      {
        id: "ps_5",
        type: "scale",
        question: {
          tr: "Oyunun hikaye/içerik kalitesinden ne kadar memnunsunuz?",
          en: "How satisfied are you with the story/content quality?",
        },
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Hiç memnun değilim", en: "Very dissatisfied" },
          max: { tr: "Çok memnunum", en: "Very satisfied" },
        },
      },
      {
        id: "ps_6",
        type: "scale",
        question: {
          tr: "Oyunun performansından (yükleme süreleri, akıcılık) ne kadar memnunsunuz?",
          en: "How satisfied are you with the game's performance (load times, smoothness)?",
        },
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Hiç memnun değilim", en: "Very dissatisfied" },
          max: { tr: "Çok memnunum", en: "Very satisfied" },
        },
      },
      {
        id: "ps_7",
        type: "multiple",
        question: {
          tr: "Oyunun en çok beğendiğiniz yönleri hangileri?",
          en: "What are your favorite aspects of the game?",
        },
        options: [
          { value: "gameplay", label: { tr: "Oynanış mekanikleri", en: "Gameplay mechanics" } },
          { value: "graphics", label: { tr: "Grafikler ve görsel tasarım", en: "Graphics and visual design" } },
          { value: "story", label: { tr: "Hikaye/İçerik", en: "Story/Content" } },
          { value: "social", label: { tr: "Sosyal özellikler", en: "Social features" } },
          { value: "events", label: { tr: "Etkinlikler ve güncellemeler", en: "Events and updates" } },
          { value: "rewards", label: { tr: "Ödül sistemi", en: "Reward system" } },
        ],
      },
      {
        id: "ps_8",
        type: "multiple",
        question: {
          tr: "Oyunda geliştirilmesi gereken alanlar hangileri?",
          en: "Which areas of the game need improvement?",
        },
        options: [
          { value: "bugs", label: { tr: "Bug'lar ve teknik sorunlar", en: "Bugs and technical issues" } },
          { value: "balance", label: { tr: "Oyun dengesi", en: "Game balance" } },
          { value: "content", label: { tr: "Daha fazla içerik", en: "More content" } },
          { value: "matchmaking", label: { tr: "Eşleşme sistemi", en: "Matchmaking system" } },
          { value: "ui", label: { tr: "Kullanıcı arayüzü", en: "User interface" } },
          { value: "performance", label: { tr: "Performans", en: "Performance" } },
        ],
      },
      {
        id: "ps_9",
        type: "single",
        question: {
          tr: "Oyunun güncellemelerinin sıklığından memnun musunuz?",
          en: "Are you satisfied with the frequency of game updates?",
        },
        options: [
          { value: "too_frequent", label: { tr: "Çok sık güncelleniyor", en: "Too frequent" } },
          { value: "just_right", label: { tr: "Tam olması gerektiği kadar", en: "Just right" } },
          { value: "not_enough", label: { tr: "Yeterli değil", en: "Not enough" } },
        ],
      },
      {
        id: "ps_10",
        type: "text",
        question: {
          tr: "Oyun hakkında eklemek istediğiniz bir şey var mı?",
          en: "Is there anything else you'd like to share about the game?",
        },
      },
    ],
  },

  // ===================================================================
  // 2. BETA TEST FEEDBACK
  // ===================================================================
  {
    type: "beta_feedback",
    title: { tr: "Beta Test Geri Bildirim Anketi", en: "Beta Test Feedback Survey" },
    description: {
      tr: "Beta test sürecinde oyuncuların karşılaştığı sorunları ve önerilerini toplayın.",
      en: "Collect issues encountered and suggestions from players during beta testing.",
    },
    icon: "Bug",
    color: "orange",
    estimatedMinutes: 8,
    questions: [
      {
        id: "bt_1",
        type: "scale",
        question: {
          tr: "Beta versiyonun genel kalitesini nasıl değerlendirirsiniz?",
          en: "How would you rate the overall quality of the beta version?",
        },
        required: true,
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Çok kötü", en: "Very poor" },
          max: { tr: "Mükemmel", en: "Excellent" },
        },
      },
      {
        id: "bt_2",
        type: "single",
        question: {
          tr: "Beta süresince oyun çökme (crash) yaşadınız mı?",
          en: "Did you experience any crashes during the beta?",
        },
        required: true,
        options: [
          { value: "never", label: { tr: "Hiç yaşamadım", en: "Never" } },
          { value: "rarely", label: { tr: "Nadiren (1-2 kez)", en: "Rarely (1-2 times)" } },
          { value: "sometimes", label: { tr: "Bazen (3-5 kez)", en: "Sometimes (3-5 times)" } },
          { value: "often", label: { tr: "Sık sık (5+ kez)", en: "Often (5+ times)" } },
        ],
      },
      {
        id: "bt_3",
        type: "multiple",
        question: {
          tr: "Hangi alanlarda bug veya sorun yaşadınız?",
          en: "In which areas did you experience bugs or issues?",
        },
        options: [
          { value: "login", label: { tr: "Giriş/Kayıt", en: "Login/Registration" } },
          { value: "gameplay", label: { tr: "Oynanış sırasında", en: "During gameplay" } },
          { value: "ui", label: { tr: "Arayüz/Menüler", en: "UI/Menus" } },
          { value: "payment", label: { tr: "Ödeme/Satın alma", en: "Payment/Purchase" } },
          { value: "social", label: { tr: "Sosyal özellikler", en: "Social features" } },
          { value: "notifications", label: { tr: "Bildirimler", en: "Notifications" } },
        ],
      },
      {
        id: "bt_4",
        type: "scale",
        question: {
          tr: "Oyunun yükleme sürelerini nasıl değerlendirirsiniz?",
          en: "How would you rate the game's loading times?",
        },
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Çok yavaş", en: "Very slow" },
          max: { tr: "Çok hızlı", en: "Very fast" },
        },
      },
      {
        id: "bt_5",
        type: "scale",
        question: {
          tr: "Oyunun FPS performansını nasıl değerlendirirsiniz?",
          en: "How would you rate the game's FPS performance?",
        },
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Sürekli takılıyor", en: "Constant stuttering" },
          max: { tr: "Çok akıcı", en: "Very smooth" },
        },
      },
      {
        id: "bt_6",
        type: "single",
        question: {
          tr: "Tutorial/Onboarding deneyiminiz nasıldı?",
          en: "How was your tutorial/onboarding experience?",
        },
        options: [
          { value: "too_long", label: { tr: "Çok uzun ve sıkıcıydı", en: "Too long and boring" } },
          { value: "good", label: { tr: "İyi ve anlaşılırdı", en: "Good and understandable" } },
          { value: "confusing", label: { tr: "Kafa karıştırıcıydı", en: "Confusing" } },
          { value: "skipped", label: { tr: "Atladım/göremedim", en: "Skipped/didn't see it" } },
        ],
      },
      {
        id: "bt_7",
        type: "scale",
        question: {
          tr: "İçerik miktarı (seviye, karakter, özellik) yeterli mi?",
          en: "Is the amount of content (levels, characters, features) sufficient?",
        },
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Çok yetersiz", en: "Very insufficient" },
          max: { tr: "Fazlasıyla yeterli", en: "More than enough" },
        },
      },
      {
        id: "bt_8",
        type: "scale",
        question: {
          tr: "Oyun dengesi (zorluk, ilerleme hızı) hakkında ne düşünüyorsunuz?",
          en: "What do you think about game balance (difficulty, progression speed)?",
        },
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Çok dengesiz", en: "Very unbalanced" },
          max: { tr: "Mükemmel dengeli", en: "Perfectly balanced" },
        },
      },
      {
        id: "bt_9",
        type: "single",
        question: {
          tr: "Oyunun resmi çıkışında oynamaya devam eder misiniz?",
          en: "Would you continue playing when the game officially launches?",
        },
        required: true,
        options: [
          { value: "definitely", label: { tr: "Kesinlikle evet", en: "Definitely yes" } },
          { value: "probably", label: { tr: "Muhtemelen evet", en: "Probably yes" } },
          { value: "unsure", label: { tr: "Emin değilim", en: "Not sure" } },
          { value: "no", label: { tr: "Hayır", en: "No" } },
        ],
      },
      {
        id: "bt_10",
        type: "text",
        question: {
          tr: "Karşılaştığınız en kritik bug veya sorunu detaylı açıklayın.",
          en: "Describe the most critical bug or issue you encountered in detail.",
        },
      },
      {
        id: "bt_11",
        type: "text",
        question: {
          tr: "Oyuna eklenmesini istediğiniz özellikler veya önerileriniz nelerdir?",
          en: "What features or suggestions would you like to see added to the game?",
        },
      },
    ],
  },

  // ===================================================================
  // 3. UX/USABILITY (UX/Kullanılabilirlik)
  // ===================================================================
  {
    type: "ux_usability",
    title: { tr: "UX/Kullanılabilirlik Anketi", en: "UX/Usability Survey" },
    description: {
      tr: "Oyununuzun kullanıcı deneyimini, navigasyonunu ve arayüz kalitesini değerlendirin.",
      en: "Evaluate your game's user experience, navigation, and interface quality.",
    },
    icon: "Layout",
    color: "violet",
    estimatedMinutes: 6,
    questions: [
      {
        id: "ux_1",
        type: "scale",
        question: {
          tr: "Oyunun menülerinde istediğiniz şeyi bulmak ne kadar kolay?",
          en: "How easy is it to find what you're looking for in the game's menus?",
        },
        required: true,
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Çok zor", en: "Very difficult" },
          max: { tr: "Çok kolay", en: "Very easy" },
        },
      },
      {
        id: "ux_2",
        type: "scale",
        question: {
          tr: "Butonlar ve etkileşim alanları yeterince büyük ve net mi?",
          en: "Are buttons and interactive areas large and clear enough?",
        },
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Hiç değil", en: "Not at all" },
          max: { tr: "Mükemmel", en: "Excellent" },
        },
      },
      {
        id: "ux_3",
        type: "single",
        question: {
          tr: "Oyunu tek elle rahatça oynayabiliyor musunuz?",
          en: "Can you comfortably play the game with one hand?",
        },
        options: [
          { value: "yes", label: { tr: "Evet, rahatça", en: "Yes, comfortably" } },
          { value: "mostly", label: { tr: "Çoğunlukla evet", en: "Mostly yes" } },
          { value: "no", label: { tr: "Hayır, iki el gerekiyor", en: "No, two hands needed" } },
          { value: "na", label: { tr: "Uygulanabilir değil", en: "Not applicable" } },
        ],
      },
      {
        id: "ux_4",
        type: "scale",
        question: {
          tr: "İlk oyun deneyiminizde (tutorial/onboarding) ne yapmanız gerektiğini ne kadar iyi anladınız?",
          en: "How well did you understand what to do during your first experience (tutorial/onboarding)?",
        },
        required: true,
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Hiç anlamadım", en: "Didn't understand at all" },
          max: { tr: "Her şey çok netti", en: "Everything was very clear" },
        },
      },
      {
        id: "ux_5",
        type: "multiple",
        question: {
          tr: "Arayüzde aşağıdaki sorunlardan hangilerini yaşadınız?",
          en: "Which of the following UI issues did you experience?",
        },
        options: [
          { value: "text_small", label: { tr: "Yazılar çok küçük", en: "Text too small" } },
          { value: "buttons_close", label: { tr: "Butonlar birbirine çok yakın", en: "Buttons too close together" } },
          { value: "unclear_icons", label: { tr: "İkonlar/semboller anlaşılmaz", en: "Icons/symbols unclear" } },
          { value: "color_contrast", label: { tr: "Renk kontrastı yetersiz", en: "Poor color contrast" } },
          { value: "none", label: { tr: "Hiçbirini yaşamadım", en: "None of the above" } },
        ],
      },
      {
        id: "ux_6",
        type: "scale",
        question: {
          tr: "Oyun içi HUD (sağlık barı, skor, mini harita vb.) ne kadar kullanışlı?",
          en: "How useful is the in-game HUD (health bar, score, mini map, etc.)?",
        },
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Gereksiz ve kalabalık", en: "Unnecessary and cluttered" },
          max: { tr: "Çok kullanışlı", en: "Very useful" },
        },
      },
      {
        id: "ux_7",
        type: "scale",
        question: {
          tr: "Oyunun görsel tutarlılığını (renkler, fontlar, stil) nasıl değerlendirirsiniz?",
          en: "How would you rate the game's visual consistency (colors, fonts, style)?",
        },
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Çok tutarsız", en: "Very inconsistent" },
          max: { tr: "Çok tutarlı", en: "Very consistent" },
        },
      },
      {
        id: "ux_8",
        type: "single",
        question: {
          tr: "Ayarlar menüsünde ihtiyacınız olan tüm seçenekleri bulabiliyor musunuz?",
          en: "Can you find all the options you need in the settings menu?",
        },
        options: [
          { value: "yes", label: { tr: "Evet, hepsi var", en: "Yes, all of them" } },
          { value: "mostly", label: { tr: "Çoğu var", en: "Most of them" } },
          { value: "some_missing", label: { tr: "Bazı eksikler var", en: "Some are missing" } },
          { value: "no", label: { tr: "Çok yetersiz", en: "Very insufficient" } },
        ],
      },
      {
        id: "ux_9",
        type: "text",
        question: {
          tr: "Arayüzde sizi en çok rahatsız eden şey nedir?",
          en: "What bothers you the most about the interface?",
        },
      },
      {
        id: "ux_10",
        type: "text",
        question: {
          tr: "UX/UI iyileştirme önerileriniz nelerdir?",
          en: "What are your UX/UI improvement suggestions?",
        },
      },
    ],
  },

  // ===================================================================
  // 4. CHURN ANALYSIS (Ayrılma Analizi)
  // ===================================================================
  {
    type: "churn_analysis",
    title: { tr: "Churn Analiz Anketi", en: "Churn Analysis Survey" },
    description: {
      tr: "Oyuncuların oyunu bırakma nedenlerini anlayın ve geri kazanma stratejileri geliştirin.",
      en: "Understand why players leave and develop win-back strategies.",
    },
    icon: "UserMinus",
    color: "red",
    estimatedMinutes: 4,
    questions: [
      {
        id: "ch_1",
        type: "multiple",
        question: {
          tr: "Oyunu bırakmanızdaki ana nedenler nelerdi? (Birden fazla seçebilirsiniz)",
          en: "What were the main reasons you stopped playing? (Select multiple)",
        },
        required: true,
        options: [
          { value: "boring", label: { tr: "Oyun sıkıcı hale geldi", en: "Game became boring" } },
          { value: "too_hard", label: { tr: "Çok zor/hayal kırıklığı", en: "Too difficult/frustrating" } },
          { value: "p2w", label: { tr: "Pay-to-win hissettirdi", en: "Felt pay-to-win" } },
          { value: "bugs", label: { tr: "Çok fazla bug/teknik sorun", en: "Too many bugs/technical issues" } },
          { value: "time", label: { tr: "Zamanım kalmadı", en: "No time left" } },
          { value: "other_game", label: { tr: "Başka bir oyuna geçtim", en: "Switched to another game" } },
        ],
      },
      {
        id: "ch_2",
        type: "scale",
        question: {
          tr: "Oyunu bırakmadan önce ne kadar memnundunuz?",
          en: "How satisfied were you before you stopped playing?",
        },
        required: true,
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Hiç memnun değildim", en: "Not satisfied at all" },
          max: { tr: "Çok memnundum", en: "Very satisfied" },
        },
      },
      {
        id: "ch_3",
        type: "single",
        question: {
          tr: "Oyunu ne kadar süre oynadınız?",
          en: "How long did you play the game?",
        },
        options: [
          { value: "less_week", label: { tr: "1 haftadan az", en: "Less than a week" } },
          { value: "1_4_weeks", label: { tr: "1-4 hafta", en: "1-4 weeks" } },
          { value: "1_3_months", label: { tr: "1-3 ay", en: "1-3 months" } },
          { value: "more_3", label: { tr: "3 aydan fazla", en: "More than 3 months" } },
        ],
      },
      {
        id: "ch_4",
        type: "single",
        question: {
          tr: "Oyunda para harcadınız mı?",
          en: "Did you spend money in the game?",
        },
        options: [
          { value: "no", label: { tr: "Hayır", en: "No" } },
          { value: "small", label: { tr: "Az miktarda (<$10)", en: "Small amount (<$10)" } },
          { value: "medium", label: { tr: "Orta ($10-$50)", en: "Medium ($10-$50)" } },
          { value: "large", label: { tr: "Yüksek ($50+)", en: "Large ($50+)" } },
        ],
      },
      {
        id: "ch_5",
        type: "scale",
        question: {
          tr: "Oyuna geri dönme olasılığınız nedir?",
          en: "How likely are you to return to the game?",
        },
        required: true,
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Kesinlikle dönmem", en: "Definitely won't return" },
          max: { tr: "Kesinlikle dönerim", en: "Definitely will return" },
        },
      },
      {
        id: "ch_6",
        type: "multiple",
        question: {
          tr: "Sizi oyuna geri getirebilecek değişiklikler nelerdir?",
          en: "What changes could bring you back to the game?",
        },
        options: [
          { value: "new_content", label: { tr: "Yeni içerik/seviyeler", en: "New content/levels" } },
          { value: "balance", label: { tr: "Daha iyi oyun dengesi", en: "Better game balance" } },
          { value: "less_ads", label: { tr: "Daha az reklam", en: "Fewer ads" } },
          { value: "social", label: { tr: "Daha iyi sosyal özellikler", en: "Better social features" } },
          { value: "rewards", label: { tr: "Daha iyi ödüller", en: "Better rewards" } },
          { value: "nothing", label: { tr: "Hiçbir şey", en: "Nothing" } },
        ],
      },
      {
        id: "ch_7",
        type: "single",
        question: {
          tr: "Oyunu bıraktıktan sonra hangi oyuna geçtiniz?",
          en: "Which game did you switch to after leaving?",
        },
        options: [
          { value: "similar", label: { tr: "Benzer türde bir oyun", en: "A similar genre game" } },
          { value: "different", label: { tr: "Farklı türde bir oyun", en: "A different genre game" } },
          { value: "none", label: { tr: "Başka oyun oynamıyorum", en: "Not playing any game" } },
        ],
      },
      {
        id: "ch_8",
        type: "text",
        question: {
          tr: "Oyun hakkında bizi en çok hayal kırıklığına uğratan şeyi detaylıca anlatır mısınız?",
          en: "Could you describe in detail what disappointed you most about the game?",
        },
      },
    ],
  },

  // ===================================================================
  // 5. FEATURE PRIORITIZATION (Özellik Önceliklendirme)
  // ===================================================================
  {
    type: "feature_prioritization",
    title: { tr: "Özellik Önceliklendirme Anketi", en: "Feature Prioritization Survey" },
    description: {
      tr: "Oyuncuların en çok istediği özellikleri belirleyin ve yol haritanızı şekillendirin.",
      en: "Identify the most requested features and shape your roadmap.",
    },
    icon: "ListOrdered",
    color: "blue",
    estimatedMinutes: 5,
    questions: [
      {
        id: "fp_1",
        type: "scale",
        question: {
          tr: "Yeni karakterler/skinler eklenmesini ne kadar istersiniz?",
          en: "How much would you like new characters/skins to be added?",
        },
        required: true,
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Hiç istemem", en: "Not at all" },
          max: { tr: "Çok isterim", en: "Very much" },
        },
      },
      {
        id: "fp_2",
        type: "scale",
        question: {
          tr: "Yeni oyun modları eklenmesini ne kadar istersiniz?",
          en: "How much would you like new game modes to be added?",
        },
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Hiç istemem", en: "Not at all" },
          max: { tr: "Çok isterim", en: "Very much" },
        },
      },
      {
        id: "fp_3",
        type: "scale",
        question: {
          tr: "Klan/takım sistemi eklenmesini ne kadar istersiniz?",
          en: "How much would you like a clan/team system to be added?",
        },
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Hiç istemem", en: "Not at all" },
          max: { tr: "Çok isterim", en: "Very much" },
        },
      },
      {
        id: "fp_4",
        type: "scale",
        question: {
          tr: "Sıralama/liderlik tablosu sistemi eklenmesini ne kadar istersiniz?",
          en: "How much would you like a ranking/leaderboard system to be added?",
        },
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Hiç istemem", en: "Not at all" },
          max: { tr: "Çok isterim", en: "Very much" },
        },
      },
      {
        id: "fp_5",
        type: "scale",
        question: {
          tr: "Canlı etkinlikler (live events) sıklığının artmasını ne kadar istersiniz?",
          en: "How much would you like more frequent live events?",
        },
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Hiç istemem", en: "Not at all" },
          max: { tr: "Çok isterim", en: "Very much" },
        },
      },
      {
        id: "fp_6",
        type: "single",
        question: {
          tr: "Aşağıdakilerden hangisi sizin için en öncelikli?",
          en: "Which of the following is the highest priority for you?",
        },
        required: true,
        options: [
          { value: "new_content", label: { tr: "Yeni içerik (seviye/karakter)", en: "New content (levels/characters)" } },
          { value: "social", label: { tr: "Sosyal özellikler", en: "Social features" } },
          { value: "performance", label: { tr: "Performans iyileştirme", en: "Performance improvement" } },
          { value: "customization", label: { tr: "Özelleştirme seçenekleri", en: "Customization options" } },
        ],
      },
      {
        id: "fp_7",
        type: "single",
        question: {
          tr: "Yeni özellikler için ödeme yapar mısınız?",
          en: "Would you pay for new features?",
        },
        options: [
          { value: "yes", label: { tr: "Evet, kesinlikle", en: "Yes, definitely" } },
          { value: "depends", label: { tr: "Özelliğe bağlı", en: "Depends on the feature" } },
          { value: "no", label: { tr: "Hayır, ücretsiz olmalı", en: "No, should be free" } },
        ],
      },
      {
        id: "fp_8",
        type: "text",
        question: {
          tr: "Oyuna eklenmesini en çok istediğiniz özelliği detaylıca açıklayın.",
          en: "Describe in detail the feature you'd most like to see added to the game.",
        },
        required: true,
      },
    ],
  },

  // ===================================================================
  // 6. MONETIZATION PERCEPTION (Monetization Algısı)
  // ===================================================================
  {
    type: "monetization_perception",
    title: { tr: "Monetization Algı Anketi", en: "Monetization Perception Survey" },
    description: {
      tr: "Oyuncuların fiyatlandırma, satın alma ve değer algısını ölçün.",
      en: "Measure players' perception of pricing, purchases, and value.",
    },
    icon: "CreditCard",
    color: "amber",
    estimatedMinutes: 5,
    questions: [
      {
        id: "mp_1",
        type: "single",
        question: {
          tr: "Oyunda şu ana kadar para harcadınız mı?",
          en: "Have you spent money in the game so far?",
        },
        required: true,
        options: [
          { value: "no", label: { tr: "Hayır, hiç", en: "No, never" } },
          { value: "once", label: { tr: "Bir kez", en: "Once" } },
          { value: "few", label: { tr: "Birkaç kez", en: "A few times" } },
          { value: "regular", label: { tr: "Düzenli olarak", en: "Regularly" } },
        ],
      },
      {
        id: "mp_2",
        type: "scale",
        question: {
          tr: "Oyun içi ürünlerin fiyatlarını nasıl değerlendirirsiniz?",
          en: "How would you rate the prices of in-game products?",
        },
        required: true,
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Çok pahalı", en: "Way too expensive" },
          max: { tr: "Çok uygun", en: "Very affordable" },
        },
      },
      {
        id: "mp_3",
        type: "scale",
        question: {
          tr: "Satın aldığınız ürünler harcadığınız paraya değdi mi?",
          en: "Were the products you purchased worth the money?",
        },
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Hiç değmedi", en: "Not worth it at all" },
          max: { tr: "Kesinlikle değdi", en: "Absolutely worth it" },
        },
      },
      {
        id: "mp_4",
        type: "multiple",
        question: {
          tr: "Hangi tür ürünleri satın almayı tercih edersiniz?",
          en: "Which types of products do you prefer to purchase?",
        },
        options: [
          { value: "cosmetic", label: { tr: "Kozmetik (skin, emote)", en: "Cosmetics (skins, emotes)" } },
          { value: "gameplay", label: { tr: "Oynanış avantajı (güç, hız)", en: "Gameplay advantage (power, speed)" } },
          { value: "battlepass", label: { tr: "Battle Pass", en: "Battle Pass" } },
          { value: "subscription", label: { tr: "Aylık abonelik", en: "Monthly subscription" } },
          { value: "none", label: { tr: "Hiçbiri, para harcamam", en: "None, I don't spend money" } },
        ],
      },
      {
        id: "mp_5",
        type: "single",
        question: {
          tr: "Oyun 'pay-to-win' hissettiriyor mu?",
          en: "Does the game feel 'pay-to-win'?",
        },
        required: true,
        options: [
          { value: "no", label: { tr: "Hayır, tamamen adil", en: "No, completely fair" } },
          { value: "slightly", label: { tr: "Biraz öyle", en: "Slightly" } },
          { value: "yes", label: { tr: "Evet, kesinlikle", en: "Yes, definitely" } },
        ],
      },
      {
        id: "mp_6",
        type: "scale",
        question: {
          tr: "Reklam sıklığından ne kadar rahatsızsınız?",
          en: "How bothered are you by the frequency of ads?",
        },
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Hiç rahatsız değilim", en: "Not bothered at all" },
          max: { tr: "Çok rahatsızım", en: "Very bothered" },
        },
      },
      {
        id: "mp_7",
        type: "single",
        question: {
          tr: "Reklamları kaldırmak için ödeme yapar mıydınız?",
          en: "Would you pay to remove ads?",
        },
        options: [
          { value: "yes_low", label: { tr: "Evet, düşük fiyata ($1-3)", en: "Yes, at a low price ($1-3)" } },
          { value: "yes_fair", label: { tr: "Evet, makul fiyata ($3-5)", en: "Yes, at a fair price ($3-5)" } },
          { value: "no", label: { tr: "Hayır", en: "No" } },
        ],
      },
      {
        id: "mp_8",
        type: "scale",
        question: {
          tr: "Oyundaki özel tekliflerin (limited time offers) cazibesini nasıl değerlendirirsiniz?",
          en: "How would you rate the attractiveness of special offers (limited time)?",
        },
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Hiç cazip değil", en: "Not attractive at all" },
          max: { tr: "Çok cazip", en: "Very attractive" },
        },
      },
      {
        id: "mp_9",
        type: "text",
        question: {
          tr: "Monetization sistemi hakkında eklemek istediğiniz bir şey var mı?",
          en: "Is there anything you'd like to add about the monetization system?",
        },
      },
    ],
  },

  // ===================================================================
  // 7. MARKET RESEARCH (Pazar Araştırma)
  // ===================================================================
  {
    type: "market_research",
    title: { tr: "Pazar Araştırma Anketi", en: "Market Research Survey" },
    description: {
      tr: "Oyuncu demografisi, oynama alışkanlıkları ve rakip oyun tercihlerini analiz edin.",
      en: "Analyze player demographics, play habits, and competitor game preferences.",
    },
    icon: "TrendingUp",
    color: "cyan",
    estimatedMinutes: 6,
    questions: [
      {
        id: "mr_1",
        type: "single",
        question: {
          tr: "Yaş aralığınız nedir?",
          en: "What is your age range?",
        },
        required: true,
        options: [
          { value: "under_18", label: { tr: "18 altı", en: "Under 18" } },
          { value: "18_24", label: { tr: "18-24", en: "18-24" } },
          { value: "25_34", label: { tr: "25-34", en: "25-34" } },
          { value: "35_44", label: { tr: "35-44", en: "35-44" } },
          { value: "45_plus", label: { tr: "45+", en: "45+" } },
        ],
      },
      {
        id: "mr_2",
        type: "single",
        question: {
          tr: "Günde ortalama kaç saat mobil oyun oynuyorsunuz?",
          en: "How many hours per day do you play mobile games on average?",
        },
        required: true,
        options: [
          { value: "less_1", label: { tr: "1 saatten az", en: "Less than 1 hour" } },
          { value: "1_2", label: { tr: "1-2 saat", en: "1-2 hours" } },
          { value: "2_4", label: { tr: "2-4 saat", en: "2-4 hours" } },
          { value: "more_4", label: { tr: "4+ saat", en: "4+ hours" } },
        ],
      },
      {
        id: "mr_3",
        type: "multiple",
        question: {
          tr: "En çok hangi oyun türlerini oynuyorsunuz?",
          en: "Which game genres do you play the most?",
        },
        required: true,
        options: [
          { value: "puzzle", label: { tr: "Puzzle/Bulmaca", en: "Puzzle" } },
          { value: "strategy", label: { tr: "Strateji", en: "Strategy" } },
          { value: "rpg", label: { tr: "RPG", en: "RPG" } },
          { value: "action", label: { tr: "Aksiyon/FPS", en: "Action/FPS" } },
          { value: "casual", label: { tr: "Casual/Hyper-casual", en: "Casual/Hyper-casual" } },
          { value: "simulation", label: { tr: "Simülasyon", en: "Simulation" } },
        ],
      },
      {
        id: "mr_4",
        type: "single",
        question: {
          tr: "Yeni bir oyunu genellikle nasıl keşfediyorsunuz?",
          en: "How do you usually discover new games?",
        },
        options: [
          { value: "store", label: { tr: "App Store/Google Play", en: "App Store/Google Play" } },
          { value: "social", label: { tr: "Sosyal medya reklamları", en: "Social media ads" } },
          { value: "friends", label: { tr: "Arkadaş önerisi", en: "Friend recommendation" } },
          { value: "influencer", label: { tr: "YouTuber/Influencer", en: "YouTuber/Influencer" } },
          { value: "review", label: { tr: "İnceleme siteleri", en: "Review sites" } },
        ],
      },
      {
        id: "mr_5",
        type: "multiple",
        question: {
          tr: "Şu anda aktif olarak oynadığınız rakip oyunlar hangileri?",
          en: "Which competitor games are you actively playing right now?",
        },
        options: [
          { value: "competitor_1", label: { tr: "Rakip 1 (özelleştirin)", en: "Competitor 1 (customize)" } },
          { value: "competitor_2", label: { tr: "Rakip 2 (özelleştirin)", en: "Competitor 2 (customize)" } },
          { value: "competitor_3", label: { tr: "Rakip 3 (özelleştirin)", en: "Competitor 3 (customize)" } },
          { value: "none", label: { tr: "Hiçbiri", en: "None" } },
        ],
      },
      {
        id: "mr_6",
        type: "single",
        question: {
          tr: "Oyun için hangi platformu tercih ediyorsunuz?",
          en: "Which platform do you prefer for gaming?",
        },
        options: [
          { value: "ios", label: { tr: "iOS (iPhone/iPad)", en: "iOS (iPhone/iPad)" } },
          { value: "android", label: { tr: "Android", en: "Android" } },
          { value: "both", label: { tr: "Her ikisi de", en: "Both" } },
        ],
      },
      {
        id: "mr_7",
        type: "single",
        question: {
          tr: "Aylık ortalama ne kadar mobil oyunlara harcıyorsunuz?",
          en: "How much do you spend on mobile games monthly on average?",
        },
        options: [
          { value: "nothing", label: { tr: "Hiç harcamıyorum", en: "Nothing" } },
          { value: "under_5", label: { tr: "$5'tan az", en: "Under $5" } },
          { value: "5_20", label: { tr: "$5-$20", en: "$5-$20" } },
          { value: "20_50", label: { tr: "$20-$50", en: "$20-$50" } },
          { value: "over_50", label: { tr: "$50+", en: "$50+" } },
        ],
      },
      {
        id: "mr_8",
        type: "scale",
        question: {
          tr: "Bir oyunda sosyal özelliklerin (arkadaşlar, klanlar, chat) varlığı sizin için ne kadar önemli?",
          en: "How important are social features (friends, clans, chat) in a game for you?",
        },
        scaleMin: 1,
        scaleMax: 5,
        scaleLabels: {
          min: { tr: "Hiç önemli değil", en: "Not important at all" },
          max: { tr: "Çok önemli", en: "Very important" },
        },
      },
      {
        id: "mr_9",
        type: "single",
        question: {
          tr: "Bir oyunu bırakmanızın en sık nedeni nedir?",
          en: "What is the most common reason you stop playing a game?",
        },
        options: [
          { value: "bored", label: { tr: "Sıkıldım", en: "Got bored" } },
          { value: "too_hard", label: { tr: "Çok zorlaştı", en: "Got too hard" } },
          { value: "p2w", label: { tr: "Para kazanmaya dönüştü", en: "Became pay-to-win" } },
          { value: "new_game", label: { tr: "Yeni oyun buldum", en: "Found a new game" } },
        ],
      },
      {
        id: "mr_10",
        type: "text",
        question: {
          tr: "İdeal mobil oyununuzu tarif edin — ne tür özellikler olmalı?",
          en: "Describe your ideal mobile game — what kind of features should it have?",
        },
      },
    ],
  },
];

export function getTemplateByType(type: SurveyTemplateType): SurveyTemplate | undefined {
  return SURVEY_TEMPLATES.find((t) => t.type === type);
}
