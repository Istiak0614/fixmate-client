"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

/**
 * "Continue with Google" (optional feature). Google sends the user back to /auth/callback,
 * which creates the Express JWT cookie and opens the right page.
 * On sign up, the chosen role is passed along; the server still only accepts customer/technician.
 */
export function GoogleButton({ callbackUrl, role }: { callbackUrl: string | null; role?: "customer" | "technician" }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const next = callbackUrl ? `?next=${encodeURIComponent(callbackUrl)}` : "";
    const { error } = await signIn.social({
      provider: "google",
      callbackURL: `/auth/callback${next}`,
      errorCallbackURL: "/sign-in?error=google",
      ...(role && { additionalData: { role } }),
    });
    if (error) {
      toast.error(error.message ?? "Google sign in is not available right now");
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="outline" size="lg" className="glass h-11 w-full text-base" onClick={handleClick} disabled={loading}>
      {loading && <Loader2 className="size-4 animate-spin" />}
      Continue with Google
    </Button>
  );
}

/** "or" divider between Google and the email form. */
export function OrDivider({ label = "or use your email" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground" role="separator">
      <span className="h-px flex-1 bg-border" /> {label} <span className="h-px flex-1 bg-border" />
    </div>
  );
}