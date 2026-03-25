import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  decimal,
  integer,
  date,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const userRoleEnum = pgEnum("user_role", ["free", "premium", "admin"]);
export const localeEnum = pgEnum("locale", ["tr", "en"]);
export const platformEnum = pgEnum("platform", ["ios", "android", "both"]);
export const gameStatusEnum = pgEnum("game_status", [
  "playing",
  "completed",
  "dropped",
]);
export const interviewStatusEnum = pgEnum("interview_status", [
  "active",
  "completed",
]);
export const messageRoleEnum = pgEnum("message_role", ["assistant", "user"]);
export const taskStatusEnum = pgEnum("task_status", ["pending", "completed"]);

// ============================================
// Profiles (extends Supabase auth.users)
// ============================================
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // = auth.users.id
  username: text("username").unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  title: text("title"),
  bio: text("bio"),
  role: userRoleEnum("role").default("free").notNull(),
  locale: localeEnum("locale").default("tr").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// Games
// ============================================
export const games = pgTable("games", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id)
    .notNull(),
  title: text("title").notNull(),
  studio: text("studio"),
  genre: jsonb("genre").default([]),
  platform: platformEnum("platform"),
  status: gameStatusEnum("status").default("playing"),
  coverImageUrl: text("cover_image_url"),
  storeUrlIos: text("store_url_ios"),
  storeUrlAndroid: text("store_url_android"),
  overallRating: decimal("overall_rating", { precision: 3, scale: 1 }),
  isTemplate: boolean("is_template").default(false),
  isHidden: boolean("is_hidden").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// Analyses
// ============================================
export const analyses = pgTable("analyses", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameId: uuid("game_id")
    .references(() => games.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => profiles.id)
    .notNull(),

  // FTUE
  ftueFirstImpression: text("ftue_first_impression"),
  ftueOnboardingType: text("ftue_onboarding_type"),
  ftueDuration: text("ftue_duration"),
  ftueFrictionPoints: text("ftue_friction_points"),
  ftuePermissionTiming: text("ftue_permission_timing"),
  ftueRating: decimal("ftue_rating", { precision: 3, scale: 1 }),
  ftueNotes: text("ftue_notes"),

  // Core Loop
  coreLoopDefinition: text("core_loop_definition"),
  coreLoopSessionLength: text("core_loop_session_length"),
  coreLoopMasteryCurve: text("core_loop_mastery_curve"),
  coreLoopVariety: text("core_loop_variety"),
  coreLoopRating: decimal("core_loop_rating", { precision: 3, scale: 1 }),
  coreLoopNotes: text("core_loop_notes"),

  // Monetization
  monetizationModel: text("monetization_model"),
  monetizationIap: text("monetization_iap"),
  monetizationAds: text("monetization_ads"),
  monetizationBattlePass: text("monetization_battle_pass"),
  monetizationVip: text("monetization_vip"),
  monetizationRating: decimal("monetization_rating", { precision: 3, scale: 1 }),
  monetizationNotes: text("monetization_notes"),

  // Retention
  retentionRewards: text("retention_rewards"),
  retentionEnergy: text("retention_energy"),
  retentionNotifications: text("retention_notifications"),
  retentionFomo: text("retention_fomo"),
  retentionSocial: text("retention_social"),
  retentionStreak: text("retention_streak"),
  retentionRating: decimal("retention_rating", { precision: 3, scale: 1 }),
  retentionNotes: text("retention_notes"),

  // UX/UI
  uxMenu: text("ux_menu"),
  uxButtons: text("ux_buttons"),
  uxLoading: text("ux_loading"),
  uxHud: text("ux_hud"),
  uxAccessibility: text("ux_accessibility"),
  uxRating: decimal("ux_rating", { precision: 3, scale: 1 }),
  uxNotes: text("ux_notes"),

  // Meta Game
  metaSystems: text("meta_systems"),
  metaLongTerm: text("meta_long_term"),
  metaRating: decimal("meta_rating", { precision: 3, scale: 1 }),
  metaNotes: text("meta_notes"),

  // Technical
  techLoadTime: text("tech_load_time"),
  techFps: text("tech_fps"),
  techBattery: text("tech_battery"),
  techOffline: text("tech_offline"),
  techSize: text("tech_size"),
  techRating: decimal("tech_rating", { precision: 3, scale: 1 }),
  techNotes: text("tech_notes"),

  // Overall
  overallBestFeature: text("overall_best_feature"),
  overallWorstFeature: text("overall_worst_feature"),
  overallUniqueMechanic: text("overall_unique_mechanic"),
  overallTargetAudience: text("overall_target_audience"),
  overallLearnings: text("overall_learnings"),

  genreSpecificFields: jsonb("genre_specific_fields").default({}),
  aiFilledFields: jsonb("ai_filled_fields").default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// AI Analyses
// ============================================
export const aiAnalyses = pgTable("ai_analyses", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameId: uuid("game_id")
    .references(() => games.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => profiles.id)
    .notNull(),
  executiveSummary: text("executive_summary"),
  overallScoreJustification: text("overall_score_justification"),
  strengths: jsonb("strengths"),
  weaknesses: jsonb("weaknesses"),
  categoryScores: jsonb("category_scores"),
  verdicts: jsonb("verdicts"),
  fieldReviews: jsonb("field_reviews"),
  kpiTrendsInsight: text("kpi_trends_insight"),
  observationLevel: text("observation_level"),
  observationFeedback: jsonb("observation_feedback"),
  pmLearnings: jsonb("pm_learnings"),
  interviewPrep: jsonb("interview_prep"),
  benchmarkComparison: jsonb("benchmark_comparison"),
  pmScenario: jsonb("pm_scenario"),
  mechanicSuggestions: jsonb("mechanic_suggestions"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// Game KPIs
// ============================================
export const gameKpis = pgTable("game_kpis", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameId: uuid("game_id")
    .references(() => games.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => profiles.id)
    .notNull(),
  period: text("period"),
  downloads: integer("downloads"),
  revenue: decimal("revenue"),
  dau: integer("dau"),
  mau: integer("mau"),
  rating: decimal("rating", { precision: 3, scale: 1 }),
  chartPosition: integer("chart_position"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// Game Competitors
// ============================================
export const gameCompetitors = pgTable("game_competitors", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameId: uuid("game_id")
    .references(() => games.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => profiles.id)
    .notNull(),
  competitorName: text("competitor_name").notNull(),
  relationship: text("relationship"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// Game Trends
// ============================================
export const gameTrends = pgTable("game_trends", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameId: uuid("game_id")
    .references(() => games.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => profiles.id)
    .notNull(),
  date: date("date"),
  trendType: text("trend_type"),
  title: text("title"),
  impact: text("impact"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// Comparisons
// ============================================
export const comparisons = pgTable("comparisons", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id)
    .notNull(),
  game1Id: uuid("game1_id")
    .references(() => games.id, { onDelete: "cascade" })
    .notNull(),
  game2Id: uuid("game2_id")
    .references(() => games.id, { onDelete: "cascade" })
    .notNull(),
  aiResult: jsonb("ai_result"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// Interview Sessions
// ============================================
export const interviewSessions = pgTable("interview_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id)
    .notNull(),
  topic: text("topic").notNull(),
  difficulty: text("difficulty"),
  status: interviewStatusEnum("status").default("active"),
  avgScore: decimal("avg_score", { precision: 4, scale: 1 }),
  finalFeedback: jsonb("final_feedback"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// Interview Messages
// ============================================
export const interviewMessages = pgTable("interview_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .references(() => interviewSessions.id, { onDelete: "cascade" })
    .notNull(),
  role: messageRoleEnum("role").notNull(),
  content: text("content").notNull(),
  score: decimal("score", { precision: 4, scale: 1 }),
  feedback: jsonb("feedback"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// Daily Tasks
// ============================================
export const dailyTasks = pgTable("daily_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id)
    .notNull(),
  date: date("date").notNull(),
  type: text("type"),
  title: text("title"),
  description: text("description"),
  difficulty: text("difficulty"),
  response: text("response"),
  aiScore: decimal("ai_score", { precision: 4, scale: 1 }),
  aiFeedback: jsonb("ai_feedback"),
  status: taskStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// Task Streaks
// ============================================
export const taskStreaks = pgTable("task_streaks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id)
    .unique()
    .notNull(),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  totalCompleted: integer("total_completed").default(0),
  lastCompleted: date("last_completed"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// Growth Reports
// ============================================
export const growthReports = pgTable("growth_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id)
    .notNull(),
  currentLevel: text("current_level"),
  overallAssessment: text("overall_assessment"),
  strengths: jsonb("strengths"),
  weaknesses: jsonb("weaknesses"),
  trendAnalysis: jsonb("trend_analysis"),
  genreDiversity: jsonb("genre_diversity"),
  actionPlan: jsonb("action_plan"),
  interviewReadiness: jsonb("interview_readiness"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// Metric Analyses
// ============================================
export const metricAnalyses = pgTable("metric_analyses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id)
    .notNull(),
  gameId: uuid("game_id")
    .references(() => games.id)
    .notNull(),
  rawMetrics: jsonb("raw_metrics"),
  derivedMetrics: jsonb("derived_metrics"),
  aiAnalysis: jsonb("ai_analysis"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// Survey Responses
// ============================================
export const surveyResponses = pgTable("survey_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: text("session_id").unique().notNull(),
  responses: jsonb("responses"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// AI Recommendations
// ============================================
export const aiRecommendations = pgTable("ai_recommendations", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameId: uuid("game_id")
    .references(() => games.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => profiles.id)
    .notNull(),
  questions: jsonb("questions"),
  answers: jsonb("answers"),
  recommendations: jsonb("recommendations"),
  score: decimal("score", { precision: 4, scale: 1 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
