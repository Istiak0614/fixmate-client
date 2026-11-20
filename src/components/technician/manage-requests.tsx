"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Phone, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { PaymentBadge, StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/dashboard/states";
import { CompleteJobDialog } from "@/components/technician/complete-job-dialog";
import { api, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/category-icons";
import { formatDate } from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { cn } from "@/lib/utils";

const FILTERS: { value: "all" | BookingStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function ManageRequests() {
  const { data: jobs, loading, error, reload } = useApi<Booking[]>("/bookings/technician");
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  /** Moves a job to its next status (the server checks the allowed moves). Returns true on success. */
  async function changeStatus(job: Booking, status: BookingStatus, finalAmount?: number): Promise<boolean> {
    setBusyId(job._id);
    try {
      const res = await api<{ message: string }>(`/bookings/${job._id}/status`, { method: "PATCH", json: { status, finalAmount } });
      toast.success(res.message);
      await reload();
      return true;
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update the job. Please try again.");
      return false;
    } finally {
      setBusyId(null);
    }
  }

  const header = <PageHeader title="Manage Requests" description="Accept new requests and move each job forward until it's done." />;
  if (loading && !jobs) return (<>{header}<TableSkeleton /></>);
  if (error) return (<>{header}<ErrorState message={error} onRetry={reload} /></>);

  const all = jobs ?? [];
  const shown = filter === "all" ? all : all.filter((j) => j.status === filter);
  const count = (value: "all" | BookingStatus) => (value === "all" ? all.length : all.filter((j) => j.status === value).length);

  // Only the valid buttons for each status (assignment table)
  const actions = (j: Booking) => {
    const busy = busyId === j._id;
    switch (j.status) {
      case "requested":
        return (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => changeStatus(j, "accepted")} disabled={busy}>
              <Check className="size-4" /> Accept
            </Button>
            <ConfirmDialog
              title="Reject this request?"
              description={`${j.customerName}'s request for "${j.serviceTitle}" will be rejected. This can't be undone.`}
              confirmLabel="Reject request"
              destructive
              onConfirm={async () => {
                await changeStatus(j, "rejected");
              }}
              trigger={
                <Button size="sm" variant="outline" className="text-destructive" disabled={busy}>
                  <X className="size-4" /> Reject
                </Button>
              }
            />
          </div>
        );
      case "accepted":
        return (
          <Button size="sm" onClick={() => changeStatus(j, "in-progress")} disabled={busy}>
            <Play className="size-4" /> Start Work
          </Button>
        );
      case "in-progress":
        return <CompleteJobDialog job={j} onComplete={(amount) => changeStatus(j, "completed", amount)} />;
      case "completed":
        return (
          <div className="flex items-center gap-2">
            <PaymentBadge paid={j.paymentStatus === "paid"} />
            <span className="text-sm font-semibold">{formatPrice(j.finalAmount)}</span>
          </div>
        );
      default:
        return <span className="text-sm text-muted-foreground">No action</span>;
    }
  };

  const phone = (j: Booking) => (
    <a href={`tel:${j.customerPhone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1 text-sm whitespace-nowrap text-primary hover:underline">
      <Phone className="size-3.5" /> {j.customerPhone}
    </a>
  );

  return (
    <>
      {header}

      {/* Status filter */}
      <div role="group" aria-label="Filter by status" className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              filter === f.value ? "border-primary bg-primary text-primary-foreground" : "glass hover:border-primary/50"
            )}
          >
            {f.label}
            <span className={cn("rounded-full px-1.5 text-xs", filter === f.value ? "bg-primary-foreground/20" : "bg-muted")}>{count(f.value)}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState
          title={all.length === 0 ? "No requests yet" : "Nothing in this filter"}
          text={all.length === 0 ? "When customers request your approved services, they appear here." : "Choose another status to see more jobs."}
        />
      ) : (
        <>
          <div className="glass hidden overflow-x-auto rounded-2xl lg:block">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-muted-foreground">
                <tr>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Address</th>
                  <th className="p-4 font-medium">Preferred date</th>
                  <th className="p-4 font-medium">Problem</th>
                  <th className="p-4 font-medium">Service</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((j) => (
                  <tr key={j._id} className="border-b align-top last:border-0">
                    <td className="p-4"><p className="font-medium">{j.customerName}</p>{phone(j)}</td>
                    <td className="max-w-44 p-4">{j.address}</td>
                    <td className="p-4 whitespace-nowrap">{formatDate(j.preferredDate, true)}</td>
                    <td className="max-w-64 p-4"><p className="line-clamp-3 text-muted-foreground" title={j.problemDescription}>{j.problemDescription}</p></td>
                    <td className="max-w-44 p-4 font-medium">{j.serviceTitle}</td>
                    <td className="p-4"><StatusBadge status={j.status} /></td>
                    <td className="p-4">{actions(j)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-4 lg:hidden">
            {shown.map((j) => (
              <li key={j._id} className="glass rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">{j.serviceTitle}</p>
                    <p className="text-sm">{j.customerName}</p>
                    {phone(j)}
                  </div>
                  <StatusBadge status={j.status} />
                </div>
                <dl className="mt-3 space-y-1 text-sm">
                  <div><dt className="inline text-muted-foreground">Date: </dt><dd className="inline">{formatDate(j.preferredDate, true)}</dd></div>
                  <div><dt className="inline text-muted-foreground">Address: </dt><dd className="inline">{j.address}</dd></div>
                  <div><dt className="text-muted-foreground">Problem:</dt><dd>{j.problemDescription}</dd></div>
                </dl>
                <div className="mt-4">{actions(j)}</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}