import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { comparisons, games } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(_request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await db
    .select({
      id: comparisons.id,
      game1Id: comparisons.game1Id,
      game2Id: comparisons.game2Id,
      aiResult: comparisons.aiResult,
      createdAt: comparisons.createdAt,
      game1Title: games.title,
      game1Genre: games.genre,
    })
    .from(comparisons)
    .leftJoin(games, eq(comparisons.game1Id, games.id))
    .where(eq(comparisons.userId, user.id))
    .orderBy(desc(comparisons.createdAt));

  // Fetch game2 titles separately (Drizzle doesn't support multiple joins to same table easily)
  const game2Ids = [...new Set(results.map(r => r.game2Id))];
  const game2Map: Record<string, { title: string; genre: unknown }> = {};

  if (game2Ids.length > 0) {
    const game2s = await db.select({ id: games.id, title: games.title, genre: games.genre })
      .from(games);
    for (const g of game2s) {
      game2Map[g.id] = { title: g.title, genre: g.genre };
    }
  }

  const enriched = results.map(r => ({
    ...r,
    game2Title: game2Map[r.game2Id]?.title || "Unknown",
    game2Genre: game2Map[r.game2Id]?.genre || [],
  }));

  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { game1Id, game2Id } = body;

  if (!game1Id || !game2Id) {
    return NextResponse.json({ error: "game1Id and game2Id are required" }, { status: 400 });
  }

  if (game1Id === game2Id) {
    return NextResponse.json({ error: "Cannot compare a game with itself" }, { status: 400 });
  }

  const [comparison] = await db.insert(comparisons).values({
    userId: user.id,
    game1Id,
    game2Id,
  }).returning();

  return NextResponse.json(comparison, { status: 201 });
}
