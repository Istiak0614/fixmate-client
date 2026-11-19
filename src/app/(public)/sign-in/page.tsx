import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { safeCallbackUrl } from "@/lib/roles";

export const metadata: Metadata = { title: "Sign In | FixMate" };

// ?callbackUrl=/services/123 -> after login the user goes back there.
// (Logged-in users are redirected away from this page by proxy.ts in Client step 8.)
export default async function SignInPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to track your repairs and manage your jobs.">
      <SignInForm callbackUrl={safeCallbackUrl(callbackUrl)} />
    </AuthShell>
  );
}