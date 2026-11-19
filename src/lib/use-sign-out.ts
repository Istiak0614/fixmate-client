"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signOut } from "@/lib/auth-client";
import { clearJwtCookie } from "@/lib/jwt";

/** Signs out of BOTH systems (BetterAuth session + Express JWT cookie), then goes home. */
export function useSignOut() {
  const router = useRouter();

  return async function handleSignOut() {
    await Promise.all([signOut(), clearJwtCookie()]);
    toast.success("You have been signed out");
    router.push("/");
    router.refresh(); // re-render the navbar without the user
  };
}