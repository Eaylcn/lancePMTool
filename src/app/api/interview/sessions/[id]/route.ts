import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { interviewSessions, interviewMessages } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";

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

  const [session] = await db.select().from(interviewSessions)
    .where(and(eq(interviewSessions.id, id), eq(interviewSessions.userId, user.id)));

  if (!session) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const messages = await db.select().from(interviewMessages)
    .where(eq(interviewMessages.sessionId, id))
    .orderBy(asc(interviewMessages.createdAt));

  return NextResponse.json({ session, messages });
}
