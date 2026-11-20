"use client";

import { Receipt, Wallet } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard, StatsCardSkeleton } from "@/components/dashboard/stats-card";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/dashboard/states";
import { formatPrice } from "@/lib/category-icons";
import { formatDateTime } from "@/lib/format";
import type { Payment } from "@/lib/types";
import { useApi } from "@/lib/use-api";

type PaymentsResponse = { payments: Payment[]; totalRevenue: number };

// Job payments go customer → technician; a Pro plan payment is made by the technician alone
const payer = (p: Payment) => (p.type === "subscription" ? p.technicianName || p.customerName : p.customerName);
const what = (p: Payment) => (p.type === "subscription" ? "Pro Technician Plan" : p.serviceTitle);

/** Admin: every successful payment, with the total revenue shown above the table (assignment). */
export function Transactions() {
  const { data, loading, error, reload } = useApi<PaymentsResponse>("/admin/payments");
  const header = <PageHeader title="Transactions" description="Every successful Stripe payment on FixMate." />;

  if (error) return (<>{header}<ErrorState message={error} onRetry={reload} /></>);
  if (loading || !data)
    return (
      <>
        {header}
        <div className="mb-8 grid gap-6 sm:grid-cols-2"><StatsCardSkeleton /><StatsCardSkeleton /></div>
        <TableSkeleton />
      </>
    );

  const { payments, totalRevenue } = data;

  return (
    <>
      {header}

      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        <StatsCard label="Total Revenue" value={totalRevenue} currency Icon={Wallet} tone="teal" />
        <StatsCard label="Payments" value={payments.length} Icon={Receipt} tone="blue" />
      </div>

      {payments.length === 0 ? (
        <EmptyState title="No payments yet" text="Paid jobs and Pro plan payments will be listed here." />
      ) : (
        <>
          <div className="glass hidden overflow-x-auto rounded-2xl lg:block">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-muted-foreground">
                <tr>
                  <th className="p-4 font-medium">For</th>
                  <th className="p-4 font-medium">Paid by</th>
                  <th className="p-4 font-medium">Technician</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Transaction ID</th>
                  <th className="p-4 font-medium">Paid on</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="border-b last:border-0">
                    <td className="max-w-56 p-4 font-medium">{what(p)}</td>
                    <td className="p-4"><p>{payer(p)}</p><p className="text-xs text-muted-foreground">{p.customerEmail}</p></td>
                    <td className="p-4">{p.technicianName || "—"}</td>
                    <td className="p-4 font-semibold whitespace-nowrap">{formatPrice(p.amount)}</td>
                    <td className="max-w-48 truncate p-4 text-muted-foreground" title={p.transactionId}>{p.transactionId}</td>
                    <td className="p-4 whitespace-nowrap">{formatDateTime(p.paidAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-4 lg:hidden">
            {payments.map((p) => (
              <li key={p._id} className="glass rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">{what(p)}</p>
                    <p className="text-sm text-muted-foreground">Paid by {payer(p)}</p>
                  </div>
                  <span className="font-display text-lg font-bold">{formatPrice(p.amount)}</span>
                </div>
                <p className="mt-2 truncate text-xs text-muted-foreground">{p.transactionId}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(p.paidAt)}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}