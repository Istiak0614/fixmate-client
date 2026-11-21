import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Read-only stars, e.g. 4.5 -> four full stars and one half star. The number is in the label for screen readers. */
export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, value - (n - 1))); // 0, 0.5 or 1 for this star
        return (
          <span key={n} className="relative inline-block size-4">
            <Star className="absolute inset-0 size-4 text-muted-foreground/40" aria-hidden />
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="size-4 fill-highlight text-highlight" aria-hidden />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

/** "★ 4.7 (12)" for cards; "New" when a service has no reviews yet. */
export function RatingSummary({ average, count, className }: { average?: number; count?: number; className?: string }) {
  if (!count) return <span className={cn("text-xs font-medium text-muted-foreground", className)}>No reviews yet</span>;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm", className)}>
      <Stars value={average ?? 0} />
      <span className="font-semibold">{(average ?? 0).toFixed(1)}</span>
      <span className="text-muted-foreground">({count})</span>
    </span>
  );
}