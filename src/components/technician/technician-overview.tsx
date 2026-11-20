"use client";

import Link from "next/link";
import { BadgeCheck, Inbox, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard, StatsCardSkeleton } from "@/components/dashboard/stats-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { BarChartCard } from "@/components/dashboard/status-chart";
import { ErrorState } from "@/components/dashboard/states";
import { formatDate } from "@/lib/format";
import { STATUS_STYLES } from "@/lib/status";
import type { Booking, BookingStatus, Service } from "@/lib/types";
import { useApi } from "@/lib/use-api";

const CHART_ORDER: BookingStatus[] = ["requested", "accepted", "in-progress", "completed", "rejected", "cancelled"];

export function TechnicianOverview() {
  const services = useApi<Service[]>("/services/mine");
  const jobs = useApi<Booking[]>("/bookings/technician");
  const loading = services.loading || jobs.loading;
  const error = services.error || jobs.error;

  if (error) return <ErrorState message={error} onRetry={() => { services.reload(); jobs.reload(); }} />;

  const myServices = services.data ?? [];
  const myJobs = jobs.data ?? [];
  const pending = myJobs.filter((j) => j.status === "requested");
  const chartData = CHART_ORDER.map((status) => ({ label: STATUS_STYLES[status].label, value: myJobs.filter((j) => j.status === status).length }));

  return (
    <>
      <PageHeader title="Overview" description="Your services and incoming jobs at a glance.">
        <Button asChild><Link href="/dashboard/technician/add-service">Add a service</Link></Button>
      </PageHeader>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <><StatsCardSkeleton /><StatsCardSkeleton /><StatsCardSkeleton /></>
        ) : (
          <>
            <StatsCard label="Total Services" value={myServices.length} Icon={Wrench} tone="teal" />
            <StatsCard label="Approved Services" value={myServices.filter((s) => s.approvalStatus === "approved").length} Icon={BadgeCheck} tone="green" />
            <StatsCard label="Pending Requests" value={pending.length} Icon={Inbox} tone="blue" hint="New requests waiting for your answer" />
          </>
        )}
      </div>

      {!loading && (
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <BarChartCard title="Jobs by status" data={chartData} />
          <section className="glass rounded-2xl p-6" aria-labelledby="new-requests-heading">
            <div className="flex items-center justify-between">
              <h2 id="new-requests-heading" className="text-lg font-semibold">New requests</h2>
              <Link href="/dashboard/technician/requests" className="text-sm font-medium text-primary hover:underline">Manage</Link>
            </div>
            {pending.length === 0 ? (
              <p className="mt-6 text-muted-foreground">No new requests right now.</p>
            ) : (
              <ul className="mt-4 divide-y">
                {pending.slice(0, 4).map((j) => (
                  <li key={j._id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{j.serviceTitle}</p>
                      <p className="text-sm text-muted-foreground">{j.customerName} · {formatDate(j.preferredDate, true)}</p>
                    </div>
                    <StatusBadge status={j.status} />
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