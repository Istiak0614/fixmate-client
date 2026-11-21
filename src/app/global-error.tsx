"use client";

import "./globals.css";
import { ErrorView } from "@/components/shared/error-view";

// Last safety net: replaces the root layout if it crashes, so it needs its own <html> and <body>
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-dvh flex-col bg-background text-foreground">
        <ErrorView error={error} reset={reset} />
      </body>
    </html>
  );
}