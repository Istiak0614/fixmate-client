import type { LucideIcon } from "lucide-react";
import { AnimatedNumber } from "@/components/dashboard/animated-number";
import { cn } from "@/lib/utils";

const TONES = {
  teal: "bg-primary/15 text-primary",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  blue: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  green: "bg-green-500/15 text-green-700 dark:text-green-300",
  indigo: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
};

/** Reusable overview card (assignment: every overview page uses reusable stats cards). */
export function StatsCard({
  label,
  value,
  Icon,
  hint,
  currency = false,
  tone = "teal",
}: {
  label: string;
  value: number;
  Icon: LucideIcon;
  hint?: string;
  currency?: boolean;
  tone?: keyof typeof TONES;
}) {
  return (
    <div className="glass flex h-full items-start justify-between gap-4 rounded-2xl p-6">
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          <AnimatedNumber value={value} currency={currency} />
        </p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl", TONES[tone])}>
        <Icon className="size-6" />
      </span>
    </div>
  );
}

/** Same size as a StatsCard, shown while numbers load. */
export function StatsCardSkeleton() {
  return (
    <div className="glass h-full rounded-2xl p-6">
      <div className="h-4 w-28 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-9 w-16 animate-pulse rounded bg-muted" />
    </div>
  );
}