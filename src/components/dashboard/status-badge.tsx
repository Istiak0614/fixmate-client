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

/** Admin approval of a service: Pending (amber), Approved (green), Rejected (red). */
export function ApprovalBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  const styles = {
    pending: "bg-amber-500/20 text-amber-800 dark:text-amber-300",
    approved: "bg-green-500/15 text-green-700 dark:text-green-300",
    rejected: "bg-red-500/15 text-red-700 dark:text-red-300",
  };
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap capitalize", styles[status])}>{status}</span>
  );
}