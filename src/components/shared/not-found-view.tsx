import Link from "next/link";
import { Cog } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Repair-themed 404: the "0" in 404 is a slowly turning gear (still for reduced-motion users).
 * Used by the global not-found page and by notFound() inside the public pages.
 */
export function NotFoundView() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <div aria-hidden className="flex items-center font-display text-[7rem] leading-none font-bold sm:text-[9rem]">
        <span>4</span>
        <Cog className="mx-1 size-[0.85em] animate-[spin_8s_linear_infinite] text-primary" strokeWidth={1.6} />
        <span>4</span>
      </div>
      <span className="mt-2 rounded-md bg-highlight px-3 py-1 text-xs font-bold text-highlight-foreground">Out for repair</span>
      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">We couldn&apos;t find that page</h1>
      <p className="mt-3 max-w-md text-lg text-muted-foreground">
        The link may be broken, or the service is no longer available. Let&apos;s get you back to something that works.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/services">Browse services</Link>
        </Button>
      </div>
    </main>
  );
}