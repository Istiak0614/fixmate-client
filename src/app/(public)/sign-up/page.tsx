import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { safeCallbackUrl } from "@/lib/roles";

export const metadata: Metadata = { title: "Sign Up | FixMate" };

// (Logged-in users are redirected away from this page by proxy.ts in Client step 8.)
export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;

  return (
    <AuthShell title="Create your account" subtitle="Book trusted repairs or offer your skills on FixMate.">
      <SignUpForm callbackUrl={safeCallbackUrl(callbackUrl)} />
    </AuthShell>
  );
}