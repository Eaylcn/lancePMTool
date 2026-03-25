CREATE TYPE "public"."game_status" AS ENUM('playing', 'completed', 'dropped');--> statement-breakpoint
CREATE TYPE "public"."interview_status" AS ENUM('active', 'completed');--> statement-breakpoint
CREATE TYPE "public"."locale" AS ENUM('tr', 'en');--> statement-breakpoint
CREATE TYPE "public"."message_role" AS ENUM('assistant', 'user');--> statement-breakpoint
CREATE TYPE "public"."platform" AS ENUM('ios', 'android', 'both');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('pending', 'completed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('free', 'premium', 'admin');--> statement-breakpoint
CREATE TABLE "ai_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"executive_summary" text,
	"overall_score_justification" text,
	"strengths" jsonb,
	"weaknesses" jsonb,
	"category_scores" jsonb,
	"verdicts" jsonb,
	"field_reviews" jsonb,
	"kpi_trends_insight" text,
	"observation_level" text,
	"observation_feedback" jsonb,
	"pm_learnings" jsonb,
	"interview_prep" jsonb,
	"benchmark_comparison" jsonb,
	"pm_scenario" jsonb,
	"mechanic_suggestions" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_recommendations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"questions" jsonb,
	"answers" jsonb,
	"recommendations" jsonb,
	"score" numeric(4, 1),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"ftue_first_impression" text,
	"ftue_onboarding_type" text,
	"ftue_duration" text,
	"ftue_friction_points" text,
	"ftue_permission_timing" text,
	"ftue_rating" numeric(3, 1),
	"ftue_notes" text,
	"core_loop_definition" text,
	"core_loop_session_length" text,
	"core_loop_mastery_curve" text,
	"core_loop_variety" text,
	"core_loop_rating" numeric(3, 1),
	"core_loop_notes" text,
	"monetization_model" text,
	"monetization_iap" text,
	"monetization_ads" text,
	"monetization_battle_pass" text,
	"monetization_vip" text,
	"monetization_rating" numeric(3, 1),
	"monetization_notes" text,
	"retention_rewards" text,
	"retention_energy" text,
	"retention_notifications" text,
	"retention_fomo" text,
	"retention_social" text,
	"retention_streak" text,
	"retention_rating" numeric(3, 1),
	"retention_notes" text,
	"ux_menu" text,
	"ux_buttons" text,
	"ux_loading" text,
	"ux_hud" text,
	"ux_accessibility" text,
	"ux_rating" numeric(3, 1),
	"ux_notes" text,
	"meta_systems" text,
	"meta_long_term" text,
	"meta_rating" numeric(3, 1),
	"meta_notes" text,
	"tech_load_time" text,
	"tech_fps" text,
	"tech_battery" text,
	"tech_offline" text,
	"tech_size" text,
	"tech_rating" numeric(3, 1),
	"tech_notes" text,
	"overall_best_feature" text,
	"overall_worst_feature" text,
	"overall_unique_mechanic" text,
	"overall_target_audience" text,
	"overall_learnings" text,
	"genre_specific_fields" jsonb DEFAULT '{}'::jsonb,
	"ai_filled_fields" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comparisons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"game1_id" uuid NOT NULL,
	"game2_id" uuid NOT NULL,
	"ai_result" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"type" text,
	"title" text,
	"description" text,
	"difficulty" text,
	"response" text,
	"ai_score" numeric(4, 1),
	"ai_feedback" jsonb,
	"status" "task_status" DEFAULT 'pending',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_competitors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"competitor_name" text NOT NULL,
	"relationship" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_kpis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"period" text,
	"downloads" integer,
	"revenue" numeric,
	"dau" integer,
	"mau" integer,
	"rating" numeric(3, 1),
	"chart_position" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_trends" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date,
	"trend_type" text,
	"title" text,
	"impact" text,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"studio" text,
	"genre" jsonb DEFAULT '[]'::jsonb,
	"platform" "platform",
	"status" "game_status" DEFAULT 'playing',
	"cover_image_url" text,
	"store_url_ios" text,
	"store_url_android" text,
	"overall_rating" numeric(3, 1),
	"is_template" boolean DEFAULT false,
	"is_hidden" boolean DEFAULT false,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "growth_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"current_level" text,
	"overall_assessment" text,
	"strengths" jsonb,
	"weaknesses" jsonb,
	"trend_analysis" jsonb,
	"genre_diversity" jsonb,
	"action_plan" jsonb,
	"interview_readiness" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"role" "message_role" NOT NULL,
	"content" text NOT NULL,
	"score" numeric(4, 1),
	"feedback" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"topic" text NOT NULL,
	"difficulty" text,
	"status" "interview_status" DEFAULT 'active',
	"avg_score" numeric(4, 1),
	"final_feedback" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metric_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"game_id" uuid NOT NULL,
	"raw_metrics" jsonb,
	"derived_metrics" jsonb,
	"ai_analysis" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" text,
	"full_name" text,
	"avatar_url" text,
	"title" text,
	"bio" text,
	"role" "user_role" DEFAULT 'free' NOT NULL,
	"locale" "locale" DEFAULT 'tr' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "survey_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"responses" jsonb,
	"completed" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "survey_responses_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "task_streaks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"total_completed" integer DEFAULT 0,
	"last_completed" date,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "task_streaks_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "ai_analyses" ADD CONSTRAINT "ai_analyses_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_analyses" ADD CONSTRAINT "ai_analyses_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_recommendations" ADD CONSTRAINT "ai_recommendations_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_recommendations" ADD CONSTRAINT "ai_recommendations_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_game1_id_games_id_fk" FOREIGN KEY ("game1_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_game2_id_games_id_fk" FOREIGN KEY ("game2_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_tasks" ADD CONSTRAINT "daily_tasks_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_competitors" ADD CONSTRAINT "game_competitors_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_competitors" ADD CONSTRAINT "game_competitors_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_kpis" ADD CONSTRAINT "game_kpis_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_kpis" ADD CONSTRAINT "game_kpis_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_trends" ADD CONSTRAINT "game_trends_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_trends" ADD CONSTRAINT "game_trends_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "growth_reports" ADD CONSTRAINT "growth_reports_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_messages" ADD CONSTRAINT "interview_messages_session_id_interview_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."interview_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_analyses" ADD CONSTRAINT "metric_analyses_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_analyses" ADD CONSTRAINT "metric_analyses_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_streaks" ADD CONSTRAINT "task_streaks_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;