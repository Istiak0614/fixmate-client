"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/dashboard/states";
import { formatPrice } from "@/lib/category-icons";
import { formatDateTime } from "@/lib/format";
import type { Payment } from "@/lib/types";
import { useApi } from "@/lib/use-api";

export function PaymentHistory() {
  const { data: payments, loading, error, reload } = useApi<Payment[]>("/payments/my");
  const header = <PageHeader title="Payment History" description="Every repair you have paid for through FixMate." />;

  if (loading && !payments) return (<>{header}<TableSkeleton /></>);
  if (error) return (<>{header}<ErrorState message={error} onRetry={reload} /></>);
  if (!payments || payments.length === 0) {
    return (
      <>
        {header}
        <EmptyState title="No payments yet" text="When a technician completes your job, pay from My Bookings and the receipt appears here." action={{ href: "/dashboard/customer/bookings", label: "Go to My Bookings" }} />
      </>
    );
  }

  const total = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <>
      {header}
      <p className="mb-4 text-sm text-muted-foreground">
        {payments.length} payment{payments.length === 1 ? "" : "s"}, {formatPrice(Math.round(total * 100) / 100)} in total
      </p>

      <div className="glass hidden overflow-x-auto rounded-2xl md:block">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-muted-foreground">
            <tr>
              <th className="p-4 font-medium">Service</th>
              <th className="p-4 font-medium">Technician</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Transaction ID</th>
              <th className="p-4 font-medium">Paid on</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-b last:border-0">
                <td className="p-4 font-medium">{p.serviceTitle}</td>
                <td className="p-4">{p.technicianName}</td>
                <td className="p-4 font-semibold whitespace-nowrap">{formatPrice(p.amount)}</td>
                <td className="max-w-56 truncate p-4 text-muted-foreground" title={p.transactionId}>{p.transactionId}</td>
                <td className="p-4 whitespace-nowrap">{formatDateTime(p.paidAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-4 md:hidden">
        {payments.map((p) => (
          <li key={p._id} className="glass rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold">{p.serviceTitle}</p>
                <p className="text-sm text-muted-foreground">{p.technicianName}</p>
              </div>
              <span className="font-display text-lg font-bold">{formatPrice(p.amount)}</span>
            </div>
            <p className="mt-2 truncate text-xs text-muted-foreground">{p.transactionId}</p>
            <p className="text-xs text-muted-foreground">{formatDateTime(p.paidAt)}</p>
          </li>
        ))}
      </ul>
    </>
  );
}