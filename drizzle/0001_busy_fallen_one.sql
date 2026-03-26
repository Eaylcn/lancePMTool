ALTER TABLE "comparisons" DROP CONSTRAINT "comparisons_game1_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "comparisons" DROP CONSTRAINT "comparisons_game2_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_game1_id_games_id_fk" FOREIGN KEY ("game1_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_game2_id_games_id_fk" FOREIGN KEY ("game2_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;