"use client";

import { Fragment, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, CreditCard, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { ServiceImage } from "@/components/services/service-image";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { JobTimeline } from "@/components/dashboard/job-timeline";
import { PaymentBadge, StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/dashboard/states";
import { api, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/category-icons";
import { formatDate } from "@/lib/format";
import type { Booking } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { cn } from "@/lib/utils";

export function MyBookings() {
  const { data: bookings, loading, error, reload } = useApi<Booking[]>("/bookings/my");
  const [openTimeline, setOpenTimeline] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  async function cancelBooking(id: string) {
    try {
      await api(`/bookings/${id}/cancel`, { method: "PATCH" });
      toast.success("Request cancelled");
      await reload();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not cancel. Please try again.");
    }
  }

  // Stripe Checkout: the server checks the booking and uses booking.finalAmount (never our number)
  async function payNow(id: string) {
    setPayingId(id);
    try {
      const { url } = await api<{ url: string }>("/payments/create-checkout-session", { method: "POST", json: { bookingId: id } });
      window.location.assign(url); // leave to Stripe's secure page
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not start the payment. Please try again.");
      setPayingId(null);
    }
  }

  const header = <PageHeader title="My Bookings" description="Every repair you have requested, with live status and payment." />;
  if (loading && !bookings) return (<>{header}<TableSkeleton /></>);
  if (error) return (<>{header}<ErrorState message={error} onRetry={reload} /></>);
  if (!bookings || bookings.length === 0) {
    return (
      <>
        {header}
        <EmptyState title="No bookings yet" text="When you request a repair, it will appear here with its status." action={{ href: "/services", label: "Browse services" }} />
      </>
    );
  }

  // Buttons for one booking (same on desktop rows and mobile cards)
  const actions = (b: Booking) => (
    <div className="flex flex-wrap items-center gap-2">
      {b.status === "requested" && (
        <ConfirmDialog
          title="Cancel this request?"
          description={`Your request for "${b.serviceTitle}" will be cancelled. The technician will no longer see it as active.`}
          confirmLabel="Cancel request"
          destructive
          onConfirm={() => cancelBooking(b._id)}
          trigger={
            <Button size="sm" variant="outline" className="text-destructive">
              <X className="size-4" /> Cancel
            </Button>
          }
        />
      )}
      {b.status === "completed" && b.paymentStatus === "unpaid" && (
        <Button size="sm" onClick={() => payNow(b._id)} disabled={payingId !== null}>
          {payingId === b._id ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
          Pay {formatPrice(b.finalAmount)}
        </Button>
      )}
      <Button
        size="sm"
        variant="ghost"
        aria-expanded={openTimeline === b._id}
        onClick={() => setOpenTimeline(openTimeline === b._id ? null : b._id)}
      >
        Track <ChevronDown className={cn("size-4 transition-transform", openTimeline === b._id && "rotate-180")} />
      </Button>
    </div>
  );

  const price = (b: Booking) =>
    b.status === "completed" ? (
      <span className="font-semibold">{formatPrice(b.finalAmount)}</span>
    ) : (
      <span className="text-muted-foreground">From {formatPrice(b.basePrice)}</span>
    );

  // same photo-or-category-icon fallback as the service cards
  const thumb = (b: Booking) => (
    <ServiceImage src={b.serviceImage} alt="" category={b.category} sizes="48px" className="size-12 shrink-0 rounded-lg [&_svg]:size-5" />
  );

  return (
    <>
      {header}

      {/* Desktop / tablet: table */}
      <div className="glass hidden overflow-x-auto rounded-2xl md:block">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-muted-foreground">
            <tr>
              <th className="p-4 font-medium">Service</th>
              <th className="p-4 font-medium">Technician</th>
              <th className="p-4 font-medium">Preferred date</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Payment</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <Fragment key={b._id}>
                <tr className="border-b last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {thumb(b)}
                      <span className="max-w-56 font-medium">{b.serviceTitle}</span>
                    </div>
                  </td>
                  <td className="p-4">{b.technicianName}</td>
                  <td className="p-4 whitespace-nowrap">{formatDate(b.preferredDate, true)}</td>
                  <td className="p-4 whitespace-nowrap">{price(b)}</td>
                  <td className="p-4"><StatusBadge status={b.status} /></td>
                  <td className="p-4"><PaymentBadge paid={b.paymentStatus === "paid"} /></td>
                  <td className="p-4">{actions(b)}</td>
                </tr>
                {openTimeline === b._id && (
                  <tr className="border-b bg-muted/30">
                    <td colSpan={7} className="p-6"><JobTimeline booking={b} /></td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <ul className="space-y-4 md:hidden">
        {bookings.map((b) => (
          <li key={b._id} className="glass rounded-2xl p-4">
            <div className="flex gap-3">
              {thumb(b)}
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{b.serviceTitle}</p>
                <p className="text-sm text-muted-foreground">{b.technicianName} · {formatDate(b.preferredDate, true)}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={b.status} />
              <PaymentBadge paid={b.paymentStatus === "paid"} />
              <span className="ml-auto text-sm">{price(b)}</span>
            </div>
            <div className="mt-3">{actions(b)}</div>
            {openTimeline === b._id && <div className="mt-4 border-t pt-4"><JobTimeline booking={b} /></div>}
          </li>
        ))}
      </ul>
    </>
  );
}