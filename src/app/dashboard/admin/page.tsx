import type { Metadata } from "next";
import { AdminOverview } from "@/components/admin/admin-overview";

export const metadata: Metadata = { title: "Admin Overview | FixMate" };

export default function AdminOverviewPage() {
  return <AdminOverview />;
}