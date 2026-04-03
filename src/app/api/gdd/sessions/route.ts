import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { gddSessions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(_request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await db.select().from(gddSessions)
    .where(eq(gddSessions.userId, user.id))
    .orderBy(desc(gddSessions.updatedAt));

  // Return sessions without full messages (lighter payload for list)
  const lightSessions = sessions.map(s => ({
    id: s.id,
    title: s.title,
    genre: s.genre,
    platform: s.platform,
    status: s.status,
    currentPhase: s.currentPhase,
    completedPhases: s.completedPhases,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }));

  return NextResponse.json(lightSessions);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { title, initialIdea } = body as { title?: string; initialIdea?: string };

  const gddData = initialIdea
    ? { _meta: { initial_idea: initialIdea } }
    : {};

  const [session] = await db.insert(gddSessions).values({
    userId: user.id,
    title: title || "İsimsiz GDD",
    gddData,
  }).returning();

  return NextResponse.json(session, { status: 201 });
}
