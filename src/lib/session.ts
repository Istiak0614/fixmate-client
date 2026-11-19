/**
 * Read the logged-in user on the SERVER (layouts, server components).
 * BetterAuth reads the session cookie from the request headers and checks it in MongoDB,
 * so the role/name/photo are always the current values from the database.
 */
import "server-only";
import { headers } from "next/headers";
import { auth, type Session } from "./auth";

export type SessionUser = Session["user"];

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}