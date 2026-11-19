/**
 * Express JWT cookie helpers (called right after BetterAuth sign up / sign in / sign out).
 * The request goes to /api/jwt on OUR domain and the Next.js rewrite forwards it to Express,
 * so the HttpOnly cookie is stored for our domain.
 */
export async function createJwtCookie(email: string): Promise<boolean> {
  try {
    const res = await fetch("/api/jwt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function clearJwtCookie(): Promise<void> {
  try {
    await fetch("/api/logout", { method: "POST" });
  } catch {
    // Ignore network errors: BetterAuth sign out still happens.
  }
}
