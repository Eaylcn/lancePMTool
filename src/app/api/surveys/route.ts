import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { surveys, surveyResponsesV2, games } from "@/lib/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import { createSurveySchema } from "@/lib/types/survey";
import { randomUUID } from "crypto";

// GET — list surveys for authenticated user
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status");
  const gameId = request.nextUrl.searchParams.get("gameId");

  let query = db
    .select({
      id: surveys.id,
      userId: surveys.userId,
      gameId: surveys.gameId,
      gameTitle: games.title,
      title: surveys.title,
      description: surveys.description,
      templateType: surveys.templateType,
      questionCount: sql<number>`jsonb_array_length(${surveys.questions})`,
      settings: surveys.settings,
      shareToken: surveys.shareToken,
      status: surveys.status,
      expiresAt: surveys.expiresAt,
      responseCount: surveys.responseCount,
      createdAt: surveys.createdAt,
      updatedAt: surveys.updatedAt,
    })
    .from(surveys)
    .leftJoin(games, eq(surveys.gameId, games.id))
    .where(eq(surveys.userId, user.id))
    .orderBy(desc(surveys.createdAt))
    .$dynamic();

  if (status) {
    query = query.where(and(eq(surveys.userId, user.id), eq(surveys.status, status as "draft" | "active" | "expired" | "closed")));
  }

  if (gameId) {
    query = query.where(and(eq(surveys.userId, user.id), eq(surveys.gameId, gameId)));
  }

  const results = await query;

  return NextResponse.json(results);
}

// POST — create new survey
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const parsed = createSurveySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const shareToken = randomUUID().replace(/-/g, "").slice(0, 12);

  const [created] = await db.insert(surveys).values({
    userId: user.id,
    title: parsed.data.title,
    description: parsed.data.description || null,
    gameId: parsed.data.gameId || null,
    templateType: parsed.data.templateType || null,
    questions: parsed.data.questions,
    settings: parsed.data.settings || {},
    shareToken,
    status: "draft",
    expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
  }).returning();

  return NextResponse.json(created, { status: 201 });
}
