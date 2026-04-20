import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { profiles, games, aiAnalyses } from "@/lib/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/require-pro";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const rows = await db
    .select({
      id: profiles.id,
      username: profiles.username,
      fullName: profiles.fullName,
      avatarUrl: profiles.avatarUrl,
      role: profiles.role,
      locale: profiles.locale,
      createdAt: profiles.createdAt,
      gameCount: sql<number>`(SELECT COUNT(*)::int FROM ${games} WHERE ${games.userId} = ${profiles.id})`,
      aiAnalysisCount: sql<number>`(SELECT COUNT(*)::int FROM ${aiAnalyses} WHERE ${aiAnalyses.userId} = ${profiles.id})`,
    })
    .from(profiles)
    .orderBy(desc(profiles.createdAt));

  return NextResponse.json({ users: rows, total: rows.length });
}
