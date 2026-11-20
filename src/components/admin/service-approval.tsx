"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { ApprovalBadge } from "@/components/dashboard/status-badge";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/dashboard/states";
import { ServiceImage } from "@/components/services/service-image";
import { api, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/category-icons";
import type { Service } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { cn } from "@/lib/utils";

type Filter = "all" | "pending" | "approved" | "rejected";
const FILTERS: { value: Filter; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
];

/** Admin: every service from every technician. Pending is the default filter (easy to find). */
export function ServiceApproval() {
  const { data: services, loading, error, reload } = useApi<Service[]>("/admin/services"); // server sorts pending first
  const [filter, setFilter] = useState<Filter>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setApproval(s: Service, approvalStatus: "approved" | "rejected") {
    setBusyId(s._id);
    try {
      await api(`/admin/services/${s._id}/approval`, { method: "PATCH", json: { approvalStatus } });
      toast.success(approvalStatus === "approved" ? "Service approved and now public" : "Service rejected");
      await reload();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update the service");
    } finally {
      setBusyId(null);
    }
  }

  const header = <PageHeader title="Service Approval" description="Review new and edited services before customers can see them." />;
  if (loading && !services) return (<>{header}<TableSkeleton /></>);
  if (error) return (<>{header}<ErrorState message={error} onRetry={reload} /></>);

  const all = services ?? [];
  const count = (f: Filter) => (f === "all" ? all.length : all.filter((s) => s.approvalStatus === f).length);
  const shown = filter === "all" ? all : all.filter((s) => s.approvalStatus === filter);

  const actions = (s: Service) => (
    <div className="flex flex-wrap items-center gap-2">
      {s.approvalStatus !== "approved" && (
        <Button size="sm" onClick={() => setApproval(s, "approved")} disabled={busyId === s._id}>
          <Check className="size-4" /> Approve
        </Button>
      )}
      {s.approvalStatus !== "rejected" && (
        <ConfirmDialog
          title="Reject this service?"
          description={`"${s.title}" by ${s.technicianName} will be hidden from customers. The technician can edit it and submit it again.`}
          confirmLabel="Reject service"
          destructive
          onConfirm={() => setApproval(s, "rejected")}
          trigger={
            <Button size="sm" variant="outline" className="text-destructive" disabled={busyId === s._id}>
              <X className="size-4" /> Reject
            </Button>
          }
        />
      )}
      {s.approvalStatus === "approved" && s.isAvailable && (
        <Button asChild size="sm" variant="ghost">
          <Link href={`/services/${s._id}`} target="_blank" aria-label={`View ${s.title} publicly`}>
            <ExternalLink className="size-4" /> View
          </Link>
        </Button>
      )}
    </div>
  );

  return (
    <>
      {header}

      <div role="group" aria-label="Filter by approval status" className="mb-6 flex flex-wrap gap-2">
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
          title={filter === "pending" ? "Nothing waiting for approval" : "No services here"}
          text={filter === "pending" ? "New and edited services will appear here for review." : "Choose another filter to see more services."}
        />
      ) : (
        <>
          <div className="glass hidden overflow-x-auto rounded-2xl md:block">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-muted-foreground">
                <tr>
                  <th className="p-4 font-medium">Service</th>
                  <th className="p-4 font-medium">Technician</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((s) => (
                  <tr key={s._id} className="border-b last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <ServiceImage src={s.image} alt="" category={s.category} sizes="64px" className="h-12 w-16 shrink-0 rounded-lg [&_svg]:size-5" />
                        <span className="max-w-60 font-medium">{s.title}</span>
                      </div>
                    </td>
                    <td className="p-4"><p>{s.technicianName}</p><p className="text-xs text-muted-foreground">{s.technicianEmail}</p></td>
                    <td className="p-4">{s.category}</td>
                    <td className="p-4 font-semibold">{formatPrice(s.basePrice)}</td>
                    <td className="p-4"><ApprovalBadge status={s.approvalStatus} /></td>
                    <td className="p-4">{actions(s)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-4 md:hidden">
            {shown.map((s) => (
              <li key={s._id} className="glass rounded-2xl p-4">
                <div className="flex gap-3">
                  <ServiceImage src={s.image} alt="" category={s.category} sizes="64px" className="h-12 w-16 shrink-0 rounded-lg [&_svg]:size-5" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-sm text-muted-foreground">{s.technicianName} · {s.category} · {formatPrice(s.basePrice)}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <ApprovalBadge status={s.approvalStatus} />
                  {actions(s)}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}