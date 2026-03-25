import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { taskStreaks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [streak] = await db.select().from(taskStreaks)
      .where(eq(taskStreaks.userId, user.id));

    if (!streak) {
      return NextResponse.json({
        currentStreak: 0,
        longestStreak: 0,
        totalCompleted: 0,
        lastCompleted: null,
      });
    }

    return NextResponse.json({
      currentStreak: streak.currentStreak || 0,
      longestStreak: streak.longestStreak || 0,
      totalCompleted: streak.totalCompleted || 0,
      lastCompleted: streak.lastCompleted,
    });
  } catch (error) {
    console.error("Streak fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch streak" }, { status: 500 });
  }
}
