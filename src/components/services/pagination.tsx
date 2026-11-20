import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Page numbers to show: all when few, otherwise 1 … around current … last */
function pageList(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "gap")[] = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) result.push("gap");
    result.push(page);
  });
  return result;
}

/** Previous / page numbers / Next as real links (work with JavaScript off and keep the filters). */
export function Pagination({ query, page, totalPages }: { query: string; page: number; totalPages: number }) {
  if (totalPages <= 1) return null;

  const href = (target: number) => {
    const params = new URLSearchParams(query);
    if (target > 1) params.set("page", String(target));
    else params.delete("page");
    const qs = params.toString();
    return qs ? `/services?${qs}` : "/services";
  };

  const linkClass = "grid h-10 min-w-10 place-items-center rounded-lg border px-3 text-sm font-medium transition-colors";

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={href(page - 1)} className={cn(linkClass, "hover:bg-accent")} aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className={cn(linkClass, "opacity-40")} aria-hidden>
          <ChevronLeft className="size-4" />
        </span>
      )}

      {pageList(page, totalPages).map((item, i) =>
        item === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={href(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(linkClass, item === page ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent")}
          >
            {item}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link href={href(page + 1)} className={cn(linkClass, "hover:bg-accent")} aria-label="Next page">
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={cn(linkClass, "opacity-40")} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}