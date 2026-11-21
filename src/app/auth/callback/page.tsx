"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { createJwtCookie } from "@/lib/jwt";
import { dashboardPath, safeCallbackUrl } from "@/lib/roles";

/**
 * Google sends the user here after signing in (BetterAuth already set its session cookie).
 * We create the Express JWT cookie, then open ?next= (only our own pages) or the role's dashboard.
 */
function Finish() {
  const router = useRouter();
  const params = useSearchParams();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      const { data } = await authClient.getSession();
      if (!data?.user) return router.replace("/sign-in?error=google");
      await createJwtCookie(data.user.email);
      router.replace(safeCallbackUrl(params.get("next")) ?? dashboardPath(data.user.role));
      router.refresh();
    })();
  }, [params, router]);

  return null;
}

export default function AuthCallbackPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 text-muted-foreground" aria-live="polite">
      <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
      <p>Signing you in…</p>
      <Suspense>
        <Finish />
      </Suspense>
    </main>
  );
}