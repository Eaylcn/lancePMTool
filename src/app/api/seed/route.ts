import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { games } from "@/lib/db/schema";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized — giriş yap önce" }, { status: 401 });
  }

  const seedGames = [
    {
      userId: user.id,
      title: "Clash Royale",
      studio: "Supercell",
      genre: ["strategy", "card", "moba"],
      platform: "both" as const,
      status: "completed" as const,
      overallRating: "8.5",
    },
    {
      userId: user.id,
      title: "Royal Match",
      studio: "Dream Games",
      genre: ["match3", "puzzle", "casual"],
      platform: "both" as const,
      status: "playing" as const,
      overallRating: "7.8",
    },
    {
      userId: user.id,
      title: "PUBG Mobile",
      studio: "Tencent Games",
      genre: ["battle_royale", "shooter"],
      platform: "both" as const,
      status: "completed" as const,
      overallRating: "7.2",
    },
    {
      userId: user.id,
      title: "Idle Heroes",
      studio: "DH Games",
      genre: ["idle", "rpg"],
      platform: "both" as const,
      status: "dropped" as const,
      overallRating: "5.5",
    },
    {
      userId: user.id,
      title: "Monopoly GO!",
      studio: "Scopely",
      genre: ["casual", "social_casino"],
      platform: "both" as const,
      status: "playing" as const,
      overallRating: "6.9",
    },
  ];

  const inserted = await db.insert(games).values(seedGames).returning();

  return NextResponse.json({
    message: `${inserted.length} seed oyun eklendi`,
    games: inserted.map((g) => ({ id: g.id, title: g.title })),
  });
}
