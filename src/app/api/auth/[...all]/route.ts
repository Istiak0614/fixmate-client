/**
 * BetterAuth's API: /api/auth/sign-up/email, /api/auth/sign-in/email, /api/auth/get-session, ...
 * This route lives in Next.js. Every OTHER /api/* path is forwarded to Express by the
 * "fallback" rewrite in next.config.ts.
 */
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

export const { GET, POST } = toNextJsHandler(auth);