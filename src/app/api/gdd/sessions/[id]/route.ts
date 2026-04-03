import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { gddSessions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [session] = await db.select().from(gddSessions)
    .where(and(eq(gddSessions.id, id), eq(gddSessions.userId, user.id)));

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json(session);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  // Verify ownership
  const [existing] = await db.select({ id: gddSessions.id }).from(gddSessions)
    .where(and(eq(gddSessions.id, id), eq(gddSessions.userId, user.id)));

  if (!existing) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  if (body.title !== undefined) updateData.title = body.title;
  if (body.genre !== undefined) updateData.genre = body.genre;
  if (body.platform !== undefined) updateData.platform = body.platform;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.currentPhase !== undefined) updateData.currentPhase = body.currentPhase;
  if (body.completedPhases !== undefined) updateData.completedPhases = body.completedPhases;
  if (body.messages !== undefined) updateData.messages = body.messages;
  if (body.gddData !== undefined) updateData.gddData = body.gddData;

  const [updated] = await db.update(gddSessions)
    .set(updateData)
    .where(eq(gddSessions.id, id))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [deleted] = await db.delete(gddSessions)
    .where(and(eq(gddSessions.id, id), eq(gddSessions.userId, user.id)))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
