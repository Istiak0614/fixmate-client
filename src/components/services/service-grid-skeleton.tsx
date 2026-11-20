/** Placeholder cards shown while a new page of services loads (same size as real cards). */
export function ServiceGridSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading services">
      <div className="mb-5 h-4 w-48 animate-pulse rounded bg-muted" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="glass overflow-hidden rounded-2xl">
            <div className="aspect-[4/3] animate-pulse bg-muted" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              <div className="flex items-end justify-between pt-4">
                <div className="h-7 w-16 animate-pulse rounded bg-muted" />
                <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}