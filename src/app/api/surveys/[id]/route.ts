import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { surveys } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { updateSurveySchema } from "@/lib/types/survey";

type Params = { params: Promise<{ id: string }> };

// GET — get single survey by ID
export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [survey] = await db
    .select()
    .from(surveys)
    .where(and(eq(surveys.id, id), eq(surveys.userId, user.id)));

  if (!survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  return NextResponse.json(survey);
}

// PUT — update survey
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [existing] = await db
    .select()
    .from(surveys)
    .where(and(eq(surveys.id, id), eq(surveys.userId, user.id)));

  if (!existing) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = updateSurveySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
  if (parsed.data.gameId !== undefined) updateData.gameId = parsed.data.gameId;
  if (parsed.data.questions !== undefined) updateData.questions = parsed.data.questions;
  if (parsed.data.settings !== undefined) updateData.settings = parsed.data.settings;
  if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
  if (parsed.data.expiresAt !== undefined) {
    updateData.expiresAt = parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null;
  }

  const [updated] = await db
    .update(surveys)
    .set(updateData)
    .where(eq(surveys.id, id))
    .returning();

  return NextResponse.json(updated);
}

// PATCH — quick status update
export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { status } = body;

  if (!status || !["draft", "active", "expired", "closed"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const [updated] = await db
    .update(surveys)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(surveys.id, id), eq(surveys.userId, user.id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// DELETE — delete survey
export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [deleted] = await db
    .delete(surveys)
    .where(and(eq(surveys.id, id), eq(surveys.userId, user.id)))
    .returning({ id: surveys.id });

  if (!deleted) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
