"use client";

import Link from "next/link";
import { CalendarCheck, CircleCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard, StatsCardSkeleton } from "@/components/dashboard/stats-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { BarChartCard } from "@/components/dashboard/status-chart";
import { ErrorState } from "@/components/dashboard/states";
import { formatDate } from "@/lib/format";
import { STATUS_STYLES } from "@/lib/status";
import type { Booking, BookingStatus } from "@/lib/types";
import { useApi } from "@/lib/use-api";

const ACTIVE: BookingStatus[] = ["requested", "accepted", "in-progress"];
const CHART_ORDER: BookingStatus[] = ["requested", "accepted", "in-progress", "completed", "rejected", "cancelled"];

export function CustomerOverview() {
  const { data: bookings, loading, error, reload } = useApi<Booking[]>("/bookings/my");

  if (error) return <ErrorState message={error} onRetry={reload} />;

  const list = bookings ?? [];
  const count = (statuses: BookingStatus[]) => list.filter((b) => statuses.includes(b.status)).length;
  const chartData = CHART_ORDER.map((status) => ({ label: STATUS_STYLES[status].label, value: count([status]) }));

  return (
    <>
      <PageHeader title="Overview" description="Your repair requests at a glance.">
        <Button asChild>
          <Link href="/services">Book a repair</Link>
        </Button>
      </PageHeader>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <StatsCard label="Total Requests" value={list.length} Icon={CalendarCheck} tone="blue" />
            <StatsCard label="Active Jobs" value={count(ACTIVE)} Icon={Wrench} tone="amber" hint="Requested, accepted or in progress" />
            <StatsCard label="Completed Jobs" value={count(["completed"])} Icon={CircleCheck} tone="green" />
          </>
        )}
      </div>

      {!loading && (
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <BarChartCard title="Bookings by status" data={chartData} />

          <section className="glass rounded-2xl p-6" aria-labelledby="recent-heading">
            <div className="flex items-center justify-between">
              <h2 id="recent-heading" className="text-lg font-semibold">
                Recent requests
              </h2>
              <Link href="/dashboard/customer/bookings" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            {list.length === 0 ? (
              <p className="mt-6 text-muted-foreground">No requests yet. Find a service and send your first request.</p>
            ) : (
              <ul className="mt-4 divide-y">
                {list.slice(0, 4).map((b) => (
                  <li key={b._id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{b.serviceTitle}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(b.preferredDate, true)}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </>
  );
}