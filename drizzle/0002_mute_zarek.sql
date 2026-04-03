CREATE TYPE "public"."gdd_status" AS ENUM('in_progress', 'completed');--> statement-breakpoint
ALTER TYPE "public"."task_status" ADD VALUE 'expired';--> statement-breakpoint
CREATE TABLE "gdd_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text DEFAULT 'İsimsiz GDD' NOT NULL,
	"genre" text,
	"platform" text,
	"status" "gdd_status" DEFAULT 'in_progress' NOT NULL,
	"current_phase" integer DEFAULT 1 NOT NULL,
	"completed_phases" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"messages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"gdd_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gdd_sessions" ADD CONSTRAINT "gdd_sessions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;