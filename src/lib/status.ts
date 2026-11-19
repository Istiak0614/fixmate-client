/**
 * Labels + colours for job statuses. Colours follow the assignment exactly:
 * Requested = blue, Accepted = indigo, In Progress = amber, Completed = green,
 * Rejected = red, Cancelled = gray. Text/background pairs are readable in both themes.
 */
import type { BookingStatus } from "./types";

export const STATUS_STYLES: Record<BookingStatus, { label: string; className: string; dot: string }> = {
  requested: { label: "Requested", className: "bg-blue-500/15 text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  accepted: { label: "Accepted", className: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300", dot: "bg-indigo-500" },
  "in-progress": { label: "In Progress", className: "bg-amber-500/20 text-amber-800 dark:text-amber-300", dot: "bg-amber-500" },
  completed: { label: "Completed", className: "bg-green-500/15 text-green-700 dark:text-green-300", dot: "bg-green-500" },
  rejected: { label: "Rejected", className: "bg-red-500/15 text-red-700 dark:text-red-300", dot: "bg-red-500" },
  cancelled: { label: "Cancelled", className: "bg-slate-500/15 text-slate-700 dark:text-slate-300", dot: "bg-slate-400" },
};