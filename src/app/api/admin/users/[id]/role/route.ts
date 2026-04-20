import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/require-pro";

const VALID_ROLES = ["free", "premium", "admin"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const { role } = body as { role?: string };

  if (!role || !VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
    return NextResponse.json(
      { error: "Invalid role. Must be one of: free, premium, admin" },
      { status: 400 }
    );
  }

  if (id === auth.user.id && role !== "admin") {
    return NextResponse.json(
      { error: "Kendi admin yetkini düşüremezsin." },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(profiles)
    .set({
      role: role as (typeof VALID_ROLES)[number],
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, user: updated });
}
