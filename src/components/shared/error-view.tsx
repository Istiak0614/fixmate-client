"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Shown by error.tsx when a page crashes while rendering. It explains what happened in plain
 * words and offers a retry; the technical details only go to the console.
 */
export function ErrorView({ error, reset, homeHref = "/" }: { error: Error & { digest?: string }; reset: () => void; homeHref?: string }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-destructive/15 text-destructive">
        <Wrench className="size-8" aria-hidden />
      </span>
      <h1 className="mt-6 text-3xl font-bold">Something broke on our side</h1>
      <p className="mt-3 text-muted-foreground">
        This page couldn&apos;t load. Try again in a moment. If it keeps happening, go back and open the page again.
      </p>
      {error.digest && <p className="mt-2 text-xs text-muted-foreground">Error code: {error.digest}</p>}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={reset}>
          <RotateCw className="size-4" /> Try again
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href={homeHref}>Go back home</Link>
        </Button>
      </div>
    </div>
  );
}