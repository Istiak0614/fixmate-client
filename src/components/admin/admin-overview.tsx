"use client";

import { Hourglass, UserCog, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard, StatsCardSkeleton } from "@/components/dashboard/stats-card";
import { BarChartCard } from "@/components/dashboard/status-chart";
import { ErrorState } from "@/components/dashboard/states";
import { formatPrice } from "@/lib/category-icons";
import { STATUS_STYLES } from "@/lib/status";
import type { BookingStatus } from "@/lib/types";
import { useApi } from "@/lib/use-api";

type AdminStats = {
  totalUsers: number;
  totalTechnicians: number;
  pendingServices: number;
  totalBookings: number;
  totalRevenue: number;
  bookingsByStatus: Record<string, number>;
  monthlyRevenue: { month: string; revenue: number }[];
};

const CHART_ORDER: BookingStatus[] = ["requested", "accepted", "in-progress", "completed", "rejected", "cancelled"];
const monthLabel = (ym: string) => new Date(`${ym}-01T00:00:00Z`).toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });

export function AdminOverview() {
  const { data: stats, loading, error, reload } = useApi<AdminStats>("/admin/stats");
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <>
      <PageHeader title="Overview" description="The whole platform at a glance." />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {loading || !stats ? (
          <><StatsCardSkeleton /><StatsCardSkeleton /><StatsCardSkeleton /></>
        ) : (
          <>
            <StatsCard label="Total Users" value={stats.totalUsers} Icon={Users} tone="blue" />
            <StatsCard label="Total Technicians" value={stats.totalTechnicians} Icon={UserCog} tone="teal" />
            <StatsCard label="Pending Services" value={stats.pendingServices} Icon={Hourglass} tone="amber" hint="Waiting for your approval" />
          </>
        )}
      </div>

      {stats && !loading && (
        <>
          <p className="mt-8 text-sm text-muted-foreground">
            {stats.totalBookings} bookings in total, {formatPrice(stats.totalRevenue)} revenue collected.
          </p>
          <div className="mt-4 grid gap-6 xl:grid-cols-2">
            <BarChartCard title="Revenue, last 6 months" currency data={stats.monthlyRevenue.map((m) => ({ label: monthLabel(m.month), value: m.revenue }))} />
            <BarChartCard title="Bookings by status" data={CHART_ORDER.map((s) => ({ label: STATUS_STYLES[s].label, value: stats.bookingsByStatus[s] ?? 0 }))} />
          </div>
        </>
      )}
    </>
  );
}