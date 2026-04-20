import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type AuthedUser = {
  id: string;
  email?: string;
  role: "free" | "premium" | "admin";
};

export type RequireAuthResult =
  | { ok: true; user: AuthedUser }
  | { ok: false; response: NextResponse };

export async function requireUser(): Promise<RequireAuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const [profile] = await db
    .select({ role: profiles.role })
    .from(profiles)
    .where(eq(profiles.id, user.id));

  return {
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      role: profile?.role ?? "free",
    },
  };
}

export async function requirePro(): Promise<RequireAuthResult> {
  const result = await requireUser();
  if (!result.ok) return result;

  if (result.user.role !== "premium" && result.user.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "PREMIUM_REQUIRED",
          message:
            "Bu özellik Premium üyelere özel. Lütfen Premium'a geçerek AI özelliklerine erişin.",
        },
        { status: 402 }
      ),
    };
  }

  return result;
}
