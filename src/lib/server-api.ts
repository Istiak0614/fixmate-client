/**
 * Fetch from Express on the SERVER (server components): public data like services.
 * Calls SERVER_URL directly (server to server), so there is no extra hop through the rewrite.
 * Returns null on any error, so pages can show a friendly fallback instead of crashing.
 */
import "server-only";

const SERVER_URL = (process.env.SERVER_URL ?? "http://localhost:5000").trim().replace(/\/+$/, "");

export async function serverFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${SERVER_URL}/api${path}`, { cache: "no-store" }); // always fresh data
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}