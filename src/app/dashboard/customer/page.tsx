import { CalendarCheck, CircleCheck, Wrench } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { StatusBadge } from "@/components/dashboard/status-badge";

// TEMPORARY overview so the layout can be tested — replaced with real data in Client step 15.
export default function CustomerOverviewPage() {
  return (
    <>
      <PageHeader title="Overview" description="Your repair requests at a glance." />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard label="Total Requests" value={12} Icon={CalendarCheck} tone="blue" />
        <StatsCard label="Active Jobs" value={3} Icon={Wrench} tone="amber" />
        <StatsCard label="Completed Jobs" value={8} Icon={CircleCheck} tone="green" />
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {(["requested", "accepted", "in-progress", "completed", "rejected", "cancelled"] as const).map((s) => (
          <StatusBadge key={s} status={s} />
        ))}
      </div>
    </>
  );
}