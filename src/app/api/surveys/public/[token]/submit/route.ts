import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { surveys, surveyResponsesV2 } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { submitSurveyResponseSchema } from "@/lib/types/survey";
import { randomUUID } from "crypto";

type Params = { params: Promise<{ token: string }> };

// POST — submit a survey response (no auth required)
export async function POST(request: NextRequest, { params }: Params) {
  const { token } = await params;

  const [survey] = await db
    .select()
    .from(surveys)
    .where(eq(surveys.shareToken, token));

  if (!survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  // Check if active
  if (survey.status !== "active") {
    return NextResponse.json({ error: "Survey is not accepting responses" }, { status: 400 });
  }

  // Check expiration
  if (survey.expiresAt && new Date(survey.expiresAt) < new Date()) {
    await db
      .update(surveys)
      .set({ status: "expired", updatedAt: new Date() })
      .where(eq(surveys.id, survey.id));
    return NextResponse.json({ error: "Survey has expired" }, { status: 400 });
  }

  // Check max responses
  const settings = (survey.settings || {}) as { maxResponses?: number };
  if (settings.maxResponses && survey.responseCount >= settings.maxResponses) {
    return NextResponse.json({ error: "Survey has reached maximum responses" }, { status: 400 });
  }

  const body = await request.json();
  const parsed = submitSurveyResponseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Create response
  const [response] = await db.insert(surveyResponsesV2).values({
    surveyId: survey.id,
    respondentId: randomUUID().slice(0, 8),
    responses: parsed.data.responses,
    metadata: parsed.data.metadata || {},
    completedAt: new Date(),
  }).returning();

  // Increment response count
  await db
    .update(surveys)
    .set({
      responseCount: sql`${surveys.responseCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(surveys.id, survey.id));

  return NextResponse.json({ ok: true, responseId: response.id }, { status: 201 });
}
