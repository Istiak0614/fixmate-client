import { STATUS_STYLES } from "@/lib/status";
import type { BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Job status badge with the assignment's colours (same everywhere). */
export function StatusBadge({ status, className }: { status: BookingStatus; className?: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.requested;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap", style.className, className)}>
      <span className={cn("size-1.5 rounded-full", style.dot)} />
      {style.label}
    </span>
  );
}

/** Paid / Unpaid badge for payment columns. */
export function PaymentBadge({ paid }: { paid: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap",
        paid ? "bg-green-500/15 text-green-700 dark:text-green-300" : "bg-slate-500/15 text-slate-700 dark:text-slate-300"
      )}
    >
      {paid ? "Paid" : "Unpaid"}
    </span>
  );
}