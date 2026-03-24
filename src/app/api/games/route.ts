import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { games } from "@/lib/db/schema";
import { eq, ilike, or, desc, asc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const genre = searchParams.get("genre");
  const status = searchParams.get("status");
  const platform = searchParams.get("platform");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "created_at";
  const order = searchParams.get("order") || "desc";

  const conditions = [eq(games.userId, user.id)];

  if (status) {
    conditions.push(eq(games.status, status as "playing" | "completed" | "dropped"));
  }

  if (platform) {
    conditions.push(eq(games.platform, platform as "ios" | "android" | "both"));
  }

  const whereClause = conditions.length === 1
    ? conditions[0]
    : sql`${sql.join(conditions, sql` AND `)}`;

  let query = db.select().from(games).where(whereClause);

  // Genre filter (JSONB contains)
  if (genre) {
    query = db.select().from(games).where(
      sql`${whereClause} AND ${games.genre} @> ${JSON.stringify([genre])}::jsonb`
    );
  }

  // Search filter
  if (search) {
    const searchWhere = genre
      ? sql`${whereClause} AND ${games.genre} @> ${JSON.stringify([genre])}::jsonb AND (${games.title} ILIKE ${`%${search}%`} OR ${games.studio} ILIKE ${`%${search}%`})`
      : sql`${whereClause} AND (${games.title} ILIKE ${`%${search}%`} OR ${games.studio} ILIKE ${`%${search}%`})`;
    query = db.select().from(games).where(searchWhere);
  }

  // Sorting
  const sortColumn = sort === "title" ? games.title
    : sort === "overall_rating" ? games.overallRating
    : games.createdAt;

  const results = await query.orderBy(
    order === "asc" ? asc(sortColumn) : desc(sortColumn)
  );

  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, studio, genre, platform, status, notes } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const [game] = await db.insert(games).values({
    userId: user.id,
    title,
    studio: studio || null,
    genre: genre || [],
    platform: platform || null,
    status: status || "playing",
    notes: notes || null,
  }).returning();

  return NextResponse.json(game, { status: 201 });
}
