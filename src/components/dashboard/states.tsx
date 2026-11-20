import Link from "next/link";
import { PackageOpen, RotateCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Shown when a list is empty: says what's missing and what to do next. */
export function EmptyState({ title, text, action }: { title: string; text: string; action?: { href: string; label: string } }) {
  return (
    <div className="glass mx-auto max-w-lg rounded-2xl p-10 text-center">
      <PackageOpen className="mx-auto size-12 text-primary" />
      <h2 className="mt-4 text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-muted-foreground">{text}</p>
      {action && (
        <Button asChild className="mt-6">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}

/** Shown when loading failed, with a retry button. */
export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="glass mx-auto max-w-lg rounded-2xl p-10 text-center">
      <TriangleAlert className="mx-auto size-12 text-destructive" />
      <h2 className="mt-4 text-xl font-semibold">Couldn&apos;t load this page</h2>
      <p className="mt-2 text-muted-foreground">{message}</p>
      <Button variant="outline" className="mt-6" onClick={onRetry}>
        <RotateCw className="size-4" /> Try again
      </Button>
    </div>
  );
}

/** Placeholder rows while a table loads. */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass space-y-3 rounded-2xl p-5" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="size-12 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
          <div className="hidden h-4 w-24 animate-pulse rounded bg-muted sm:block" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
        </div>
      ))}
    </div>
  );
}