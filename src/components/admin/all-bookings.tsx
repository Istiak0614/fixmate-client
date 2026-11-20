"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { PaymentBadge, StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/dashboard/states";
import { formatPrice } from "@/lib/category-icons";
import { formatDate } from "@/lib/format";
import { STATUS_STYLES } from "@/lib/status";
import type { Booking, BookingStatus } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { cn } from "@/lib/utils";

const FILTERS: ("all" | BookingStatus)[] = ["all", "requested", "accepted", "in-progress", "completed", "rejected", "cancelled"];

/** Admin: every booking on the platform, read-only. The status filter runs on the server (?status=). */
export function AllBookings() {
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const path = filter === "all" ? "/admin/bookings" : `/admin/bookings?status=${filter}`;
  const { data: bookings, loading, error, reload } = useApi<Booking[]>(path);

  const amount = (b: Booking) => (b.finalAmount > 0 ? formatPrice(b.finalAmount) : `from ${formatPrice(b.basePrice)}`);

  let body: React.ReactNode;
  if (loading && !bookings) body = <TableSkeleton />;
  else if (error) body = <ErrorState message={error} onRetry={reload} />;
  else if (!bookings || bookings.length === 0)
    body = (
      <EmptyState
        title={filter === "all" ? "No bookings yet" : `No ${STATUS_STYLES[filter].label.toLowerCase()} bookings`}
        text={filter === "all" ? "Bookings appear here when customers request a repair." : "Choose another status to see more bookings."}
      />
    );
  else
    body = (
      // dim the old rows while the next filter loads instead of flashing a skeleton
      <div className={cn("transition-opacity", loading && "opacity-60")} aria-busy={loading}>
        <p className="mb-4 text-sm text-muted-foreground">{bookings.length} booking{bookings.length === 1 ? "" : "s"}</p>

        <div className="glass hidden overflow-x-auto rounded-2xl lg:block">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Service</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Technician</th>
                <th className="p-4 font-medium">Preferred date</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Payment</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b last:border-0">
                  <td className="max-w-56 p-4 font-medium">{b.serviceTitle}</td>
                  <td className="p-4"><p>{b.customerName}</p><p className="text-xs text-muted-foreground">{b.customerEmail}</p></td>
                  <td className="p-4"><p>{b.technicianName}</p><p className="text-xs text-muted-foreground">{b.technicianEmail}</p></td>
                  <td className="p-4 whitespace-nowrap">{formatDate(b.preferredDate, true)}</td>
                  <td className="p-4 font-semibold whitespace-nowrap">{amount(b)}</td>
                  <td className="p-4"><StatusBadge status={b.status} /></td>
                  <td className="p-4"><PaymentBadge paid={b.paymentStatus === "paid"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="space-y-4 lg:hidden">
          {bookings.map((b) => (
            <li key={b._id} className="glass rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{b.serviceTitle}</p>
                <span className="font-display font-bold whitespace-nowrap">{amount(b)}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {b.customerName} → {b.technicianName}
              </p>
              <p className="text-sm text-muted-foreground">Preferred {formatDate(b.preferredDate, true)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge status={b.status} />
                <PaymentBadge paid={b.paymentStatus === "paid"} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <>
      <PageHeader title="All Bookings" description="Every repair request on FixMate. This view is read-only." />

      <div role="group" aria-label="Filter by booking status" className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              filter === f ? "border-primary bg-primary text-primary-foreground" : "glass hover:border-primary/50"
            )}
          >
            {f !== "all" && <span className={cn("size-2 rounded-full", STATUS_STYLES[f].dot)} aria-hidden />}
            {f === "all" ? "All" : STATUS_STYLES[f].label}
          </button>
        ))}
      </div>

      {body}
    </>
  );
}