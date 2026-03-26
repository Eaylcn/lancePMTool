import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { surveyResponses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

// POST — create new session
export async function POST() {
  const sessionId = randomUUID();

  await db.insert(surveyResponses).values({
    sessionId,
    responses: {},
    completed: false,
  });

  return NextResponse.json({ sessionId });
}

// GET — get session by sessionId query param
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const [session] = await db
    .select()
    .from(surveyResponses)
    .where(eq(surveyResponses.sessionId, sessionId));

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json(session);
}

// PUT — update responses
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { sessionId, responses } = body;

  if (!sessionId || !responses) {
    return NextResponse.json({ error: "sessionId and responses required" }, { status: 400 });
  }

  const [session] = await db
    .select()
    .from(surveyResponses)
    .where(eq(surveyResponses.sessionId, sessionId));

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.completed) {
    return NextResponse.json({ error: "Survey already completed" }, { status: 400 });
  }

  const merged = { ...(session.responses as Record<string, unknown>), ...responses };

  await db
    .update(surveyResponses)
    .set({ responses: merged })
    .where(eq(surveyResponses.sessionId, sessionId));

  return NextResponse.json({ ok: true });
}

// PATCH — mark as completed
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { sessionId } = body;

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const [session] = await db
    .select()
    .from(surveyResponses)
    .where(eq(surveyResponses.sessionId, sessionId));

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  await db
    .update(surveyResponses)
    .set({ completed: true })
    .where(eq(surveyResponses.sessionId, sessionId));

  return NextResponse.json({ ok: true, completed: true });
}
