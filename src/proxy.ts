/**
 * Route protection (Next.js 16 "proxy", formerly "middleware").
 *
 * Runs on the server BEFORE a protected page renders. It asks BetterAuth for the session
 * (cookie -> MongoDB), so a reload never logs a valid user out, and the role is always current.
 * The actual rules live in src/lib/route-guard.ts.
 *
 * The dashboard layout ALSO checks the session (Client step 14) — never rely on one check only.
 */
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getRedirect } from "@/lib/route-guard";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  const { pathname, search } = request.nextUrl;

  const target = getRedirect(pathname, search, session?.user ?? null);
  if (target) {
    return NextResponse.redirect(new URL(target, request.url));
  }
  return NextResponse.next();
}

// Only run on pages that need it (never on images, CSS, JS or API routes)
export const config = {
    matcher: ["/dashboard", "/dashboard/:path*", "/payment/:path*", "/sign-in", "/sign-up"],
};