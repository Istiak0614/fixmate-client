import { Check } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { STATUS_STYLES } from "@/lib/status";
import type { Booking } from "@/lib/types";
import { cn } from "@/lib/utils";

const PIPELINE = ["requested", "accepted", "in-progress", "completed", "paid"] as const;
const LABELS: Record<string, string> = { ...Object.fromEntries(Object.entries(STATUS_STYLES).map(([k, v]) => [k, v.label])), paid: "Paid" };

/**
 * (Optional feature) Job Timeline Tracker: Requested → Accepted → In Progress → Completed → Paid,
 * with the time of each step from booking.statusHistory. A rejected/cancelled job ends early.
 */
export function JobTimeline({ booking }: { booking: Booking }) {
  const when = new Map(booking.statusHistory.map((h) => [h.status, h.changedAt]));
  const stopped = booking.status === "rejected" || booking.status === "cancelled" ? booking.status : null;
  const steps: string[] = stopped ? ["requested", stopped] : [...PIPELINE];

  return (
    <ol className="flex flex-col gap-4 sm:flex-row sm:gap-0">
      {steps.map((step, index) => {
        const time = when.get(step as never);
        const done = Boolean(time);
        const isStop = step === stopped;
        return (
          <li key={step} className="relative flex gap-3 sm:flex-1 sm:flex-col sm:items-center sm:text-center">
            {index < steps.length - 1 && (
              <span aria-hidden className={cn("absolute top-8 left-3.5 h-[calc(100%-1rem)] w-0.5 sm:top-3.5 sm:left-1/2 sm:h-0.5 sm:w-full", done ? "bg-primary" : "bg-border")} />
            )}
            <span
              className={cn(
                "relative z-10 grid size-7 shrink-0 place-items-center rounded-full border-2 text-xs font-bold",
                isStop ? "border-red-500 bg-red-500 text-white" : done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"
              )}
            >
              {done && !isStop ? <Check className="size-4" /> : index + 1}
            </span>
            <div className="sm:mt-2 sm:px-2">
              <p className={cn("text-sm font-semibold", !done && "text-muted-foreground")}>{LABELS[step]}</p>
              <p className="text-xs text-muted-foreground">{time ? formatDateTime(time) : "Waiting"}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}