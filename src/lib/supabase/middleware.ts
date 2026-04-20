import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshing the auth token. If the refresh token is expired/invalid,
  // clear the Supabase auth cookies so the user is treated as logged out
  // instead of crashing the middleware.
  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      await supabase.auth.signOut();
    } else {
      user = data.user;
    }
  } catch {
    await supabase.auth.signOut().catch(() => {});
  }

  return { supabaseResponse, user };
}
