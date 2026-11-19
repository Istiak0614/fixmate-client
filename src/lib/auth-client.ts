/**
 * BetterAuth client for React components.
 * No baseURL needed: the auth API lives on the same domain (/api/auth/*).
 * inferAdditionalFields gives TypeScript types for role, phone, area, bio, plan.
 */
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, signOut, useSession } = authClient;