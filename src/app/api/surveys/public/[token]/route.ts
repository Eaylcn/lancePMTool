import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { surveys } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type Params = { params: Promise<{ token: string }> };

// GET — get survey by share token (no auth required)
export async function GET(request: NextRequest, { params }: Params) {
  const { token } = await params;

  const [survey] = await db
    .select({
      id: surveys.id,
      title: surveys.title,
      description: surveys.description,
      questions: surveys.questions,
      settings: surveys.settings,
      status: surveys.status,
      expiresAt: surveys.expiresAt,
    })
    .from(surveys)
    .where(eq(surveys.shareToken, token));

  if (!survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  // Check if expired
  const now = new Date();
  const isExpired =
    survey.status === "expired" ||
    survey.status === "closed" ||
    (survey.expiresAt && new Date(survey.expiresAt) < now);

  if (isExpired) {
    // Auto-update status if time-expired but not yet marked
    if (survey.status === "active" && survey.expiresAt && new Date(survey.expiresAt) < now) {
      await db
        .update(surveys)
        .set({ status: "expired", updatedAt: now })
        .where(eq(surveys.shareToken, token));
    }

    return NextResponse.json({
      expired: true,
      survey: { title: survey.title, description: survey.description },
    });
  }

  if (survey.status !== "active") {
    return NextResponse.json({
      expired: true,
      survey: { title: survey.title, description: survey.description },
    });
  }

  return NextResponse.json({
    expired: false,
    survey,
  });
}
