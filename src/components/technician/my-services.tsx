"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { ApprovalBadge } from "@/components/dashboard/status-badge";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/dashboard/states";
import { ServiceImage } from "@/components/services/service-image";
import { ServiceForm, type ServiceFormValues } from "@/components/technician/service-form";
import { api, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/category-icons";
import type { Service } from "@/lib/types";
import { useApi } from "@/lib/use-api";

const toFormValues = (s: Service): ServiceFormValues => ({
  title: s.title,
  category: s.category,
  description: s.description ?? "",
  image: s.image,
  basePrice: String(s.basePrice),
  estimatedDuration: s.estimatedDuration,
  serviceMode: s.serviceMode,
  serviceArea: s.serviceArea,
});

const errorText = (err: unknown, fallback: string) => (err instanceof ApiError ? err.message : fallback);

export function MyServices({ technician }: { technician: { name: string; email: string } }) {
  const { data: services, loading, error, reload } = useApi<Service[]>("/services/mine");
  const [editing, setEditing] = useState<Service | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  async function toggleAvailability(s: Service, isAvailable: boolean) {
    setToggling(s._id);
    try {
      await api(`/services/${s._id}/availability`, { method: "PATCH", json: { isAvailable } });
      toast.success(isAvailable ? "Service is available again" : "Service hidden from customers");
      await reload();
    } catch (err) {
      toast.error(errorText(err, "Could not change availability"));
    } finally {
      setToggling(null);
    }
  }

  async function deleteService(id: string) {
    try {
      await api(`/services/${id}`, { method: "DELETE" });
      toast.success("Service deleted");
      await reload();
    } catch (err) {
      toast.error(errorText(err, "Could not delete the service"));
    }
  }

  async function saveEdit(data: Record<string, string | number>) {
    if (!editing) return;
    try {
      await api(`/services/${editing._id}`, { method: "PATCH", json: data });
      toast.success("Service updated", { description: "It is pending admin approval again." });
      setEditing(null);
      await reload();
    } catch (err) {
      toast.error(errorText(err, "Could not save the changes"));
    }
  }

  const header = (
    <PageHeader title="My Services" description="Edit, hide or delete the services you offer.">
      <Button asChild>
        <Link href="/dashboard/technician/add-service"><Plus className="size-4" /> Add a service</Link>
      </Button>
    </PageHeader>
  );

  if (loading && !services) return (<>{header}<TableSkeleton /></>);
  if (error) return (<>{header}<ErrorState message={error} onRetry={reload} /></>);
  if (!services || services.length === 0) {
    return (<>{header}<EmptyState title="No services yet" text="Add your first service. An admin approves it before customers can book it." action={{ href: "/dashboard/technician/add-service", label: "Add a service" }} /></>);
  }

  const availability = (s: Service) => (
    <label className="flex items-center gap-2 text-sm">
      <Switch checked={s.isAvailable} disabled={toggling === s._id} onCheckedChange={(on) => toggleAvailability(s, on)} aria-label={`Availability of ${s.title}`} />
      <span className={s.isAvailable ? "" : "text-muted-foreground"}>{s.isAvailable ? "Available" : "Hidden"}</span>
    </label>
  );

  const actions = (s: Service) => (
    <div className="flex items-center gap-1">
      <Button size="sm" variant="ghost" onClick={() => setEditing(s)} aria-label={`Edit ${s.title}`}>
        <Pencil className="size-4" /> Edit
      </Button>
      <ConfirmDialog
        title="Delete this service?"
        description={`"${s.title}" will be removed permanently. Existing bookings keep their details.`}
        confirmLabel="Delete service"
        destructive
        onConfirm={() => deleteService(s._id)}
        trigger={
          <Button size="sm" variant="ghost" className="text-destructive" aria-label={`Delete ${s.title}`}>
            <Trash2 className="size-4" /> Delete
          </Button>
        }
      />
    </div>
  );

  const thumb = (s: Service) => (
    <ServiceImage src={s.image} alt="" category={s.category} sizes="64px" className="h-12 w-16 shrink-0 rounded-lg [&_svg]:size-5" />
  );

  return (
    <>
      {header}

      <div className="glass hidden overflow-x-auto rounded-2xl md:block">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-muted-foreground">
            <tr>
              <th className="p-4 font-medium">Service</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Approval</th>
              <th className="p-4 font-medium">Availability</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s._id} className="border-b last:border-0">
                <td className="p-4"><div className="flex items-center gap-3">{thumb(s)}<span className="max-w-64 font-medium">{s.title}</span></div></td>
                <td className="p-4">{s.category}</td>
                <td className="p-4 font-semibold">{formatPrice(s.basePrice)}</td>
                <td className="p-4"><ApprovalBadge status={s.approvalStatus} /></td>
                <td className="p-4">{availability(s)}</td>
                <td className="p-4">{actions(s)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-4 md:hidden">
        {services.map((s) => (
          <li key={s._id} className="glass rounded-2xl p-4">
            <div className="flex gap-3">
              {thumb(s)}
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.category} · {formatPrice(s.basePrice)}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <ApprovalBadge status={s.approvalStatus} />
              {availability(s)}
            </div>
            <div className="mt-2">{actions(s)}</div>
          </li>
        ))}
      </ul>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto bg-background sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Edit service</DialogTitle>
            <DialogDescription>After saving, the service goes back to Pending until an admin approves it again.</DialogDescription>
          </DialogHeader>
          {editing && <ServiceForm key={editing._id} initial={toFormValues(editing)} technician={technician} submitLabel="Save changes" onSubmit={saveEdit} />}
        </DialogContent>
      </Dialog>
    </>
  );
}