import { Suspense } from "react";
import type { Metadata } from "next";
import { ProPlan } from "@/components/plan/pro-plan";

export const metadata: Metadata = { title: "Pro Plan | FixMate" };

// Suspense: ProPlan reads ?session_id / ?canceled with useSearchParams
export default function ProPlanPage() {
  return (
    <Suspense>
      <ProPlan />
    </Suspense>
  );
}