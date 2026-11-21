"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { BadgeCheck, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { ErrorState } from "@/components/dashboard/states";
import { ProBadge } from "@/components/shared/pro-badge";
import { api, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/category-icons";
import { formatDate } from "@/lib/format";
import { useApi } from "@/lib/use-api";
import { cn } from "@/lib/utils";

type PlanInfo = { plan: "free" | "pro"; price: number; serviceCount: number; serviceLimit: number | null; renewsAt: string | null };

const PRO_PERKS = ["Unlimited services", "Verified Pro badge on your cards and profile", "Cancel any time"];

/** Pro Technician Plan: upgrade with Stripe Checkout, see usage, cancel. The server + webhook own the plan. */
export function ProPlan() {
  const router = useRouter();
  const params = useSearchParams();
  const { data: info, loading, error, reload } = useApi<PlanInfo>("/subscriptions/me");
  const [busy, setBusy] = useState(false);
  const handled = useRef(false);

  // Back from Stripe: ?session_id=... (paid) or ?canceled=1 (closed the checkout). Run once.
  useEffect(() => {
    if (handled.current) return;
    const sessionId = params.get("session_id");
    const canceled = params.get("canceled");
    if (!sessionId && !canceled) return;
    handled.current = true;

    (async () => {
      if (canceled) toast.info("Checkout closed. You are still on the Free plan.");
      if (sessionId) {
        try {
          await api(`/subscriptions/verify?session_id=${encodeURIComponent(sessionId)}`);
          toast.success("Welcome to Pro! Your Verified Pro badge is live.");
          await reload();
        } catch (err) {
          toast.error(err instanceof ApiError ? err.message : "Could not confirm the payment");
        }
      }
      router.replace("/dashboard/technician/plan"); // clean the URL so a reload doesn't repeat this
      router.refresh(); // navbar + server pages read the new plan
    })();
  }, [params, reload, router]);

  async function upgrade() {
    setBusy(true);
    try {
      const { url } = await api<{ url: string }>("/subscriptions/checkout", { method: "POST" });
      window.location.assign(url);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not start the checkout");
      setBusy(false);
    }
  }

  async function cancelPro() {
    try {
      const res = await api<{ message: string }>("/subscriptions/cancel", { method: "POST" });
      toast.success(res.message);
      await reload();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not cancel the plan");
    }
  }

  const header = <PageHeader title="Pro Plan" description="Grow beyond 3 services and stand out to customers." />;
  if (error) return (<>{header}<ErrorState message={error} onRetry={reload} /></>);
  if (loading || !info) {
    return (<>{header}<div className="glass h-64 max-w-3xl animate-pulse rounded-2xl" aria-label="Loading plan" /></>);
  }

  const isPro = info.plan === "pro";
  const limit = info.serviceLimit;
  const used = limit ? Math.min(info.serviceCount, limit) : info.serviceCount;
  const full = limit !== null && info.serviceCount >= limit;

  return (
    <>
      {header}
      <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
        {/* Current plan + usage */}
        <section className="glass rounded-2xl p-6" aria-labelledby="current-plan">
          <p id="current-plan" className="text-sm text-muted-foreground">Your plan</p>
          <p className="mt-1 flex items-center gap-2 font-display text-3xl font-bold">
            {isPro ? "Pro" : "Free"} {isPro && <ProBadge />}
          </p>

          <div className="mt-6">
            <div className="flex justify-between text-sm">
              <span>Services</span>
              <span className="font-semibold">{limit ? `${info.serviceCount} of ${limit}` : `${info.serviceCount} · unlimited`}</span>
            </div>
            {limit !== null && (
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={limit} aria-valuenow={used} aria-label="Services used">
                <div className={cn("h-full rounded-full", full ? "bg-highlight" : "bg-primary")} style={{ width: `${(used / limit) * 100}%` }} />
              </div>
            )}
            {full && <p className="mt-2 text-sm text-muted-foreground">You&apos;ve reached the Free limit. Upgrade to add more services.</p>}
          </div>

          {isPro && (
            <div className="mt-6 border-t pt-5 text-sm">
              <p className="text-muted-foreground">
                {info.renewsAt ? <>Renews on <span className="font-medium text-foreground">{formatDate(info.renewsAt)}</span> for {formatPrice(info.price)}.</> : <>Billed {formatPrice(info.price)} every month.</>}
              </p>
              <ConfirmDialog
                title="Cancel your Pro plan?"
                description="You go back to the Free plan right away and lose the Verified Pro badge. Your existing services stay, but you can't add more while you have 3 or more."
                confirmLabel="Cancel Pro"
                destructive
                onConfirm={cancelPro}
                trigger={<Button variant="outline" className="mt-4 text-destructive">Cancel Pro</Button>}
              />
            </div>
          )}
        </section>

        {/* The Pro offer */}
        <section className={cn("glass-strong rounded-2xl border-2 p-6", isPro ? "border-transparent" : "border-highlight/60")} aria-labelledby="pro-offer">
          <p id="pro-offer" className="flex items-center gap-2 font-semibold"><Sparkles className="size-5 text-highlight" aria-hidden /> Pro Technician Plan</p>
          <p className="mt-3">
            <span className="font-display text-4xl font-bold">{formatPrice(info.price)}</span>
            <span className="text-muted-foreground"> / month</span>
          </p>
          <ul className="mt-5 space-y-2.5">
            {PRO_PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-2"><Check className="size-4 shrink-0 text-primary" aria-hidden /> {perk}</li>
            ))}
          </ul>
          {isPro ? (
            <p className="mt-6 flex items-center gap-2 font-medium text-primary"><BadgeCheck className="size-5" aria-hidden /> You&apos;re on Pro</p>
          ) : (
            <>
              <Button size="lg" className="mt-6 w-full" onClick={upgrade} disabled={busy}>
                {busy && <Loader2 className="size-4 animate-spin" />} Upgrade to Pro
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">Secure payment with Stripe. Test card 4242 4242 4242 4242.</p>
            </>
          )}
        </section>
      </div>
    </>
  );
}