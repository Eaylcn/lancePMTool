import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { surveys, surveyResponsesV2 } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

// GET — get all responses for a survey (auth required)
export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify survey ownership
  const [survey] = await db
    .select({ id: surveys.id })
    .from(surveys)
    .where(and(eq(surveys.id, id), eq(surveys.userId, user.id)));

  if (!survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  const responses = await db
    .select()
    .from(surveyResponsesV2)
    .where(eq(surveyResponsesV2.surveyId, id))
    .orderBy(desc(surveyResponsesV2.createdAt));

  return NextResponse.json(responses);
}
