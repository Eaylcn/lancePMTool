import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Routes that don't require authentication
const publicPaths = ["/login", "/survey", "/about", "/api/"];

function isPublicPath(pathname: string): boolean {
  // Remove locale prefix for checking
  const pathWithoutLocale = pathname.replace(/^\/(tr|en)/, "") || "/";
  return (
    pathWithoutLocale === "/" ||
    publicPaths.some((path) => pathWithoutLocale.startsWith(path))
  );
}

export async function middleware(request: NextRequest) {
  // Skip auth for API routes (they handle their own auth)
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Refresh Supabase session
  const { supabaseResponse, user } = await updateSession(request);

  // Apply i18n middleware
  const intlResponse = intlMiddleware(request);

  // Copy Supabase cookies to intl response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  // Auth check: redirect to login if not authenticated and not on public path
  if (!user && !isPublicPath(request.nextUrl.pathname)) {
    const locale = request.nextUrl.pathname.startsWith("/en") ? "en" : "tr";
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    const redirectResponse = NextResponse.redirect(url);

    // Copy Supabase cookies to redirect response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });

    return redirectResponse;
  }

  return intlResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
