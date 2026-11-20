import type { Metadata } from "next";
import { CustomerOverview } from "@/components/customer/customer-overview";

export const metadata: Metadata = { title: "Overview | FixMate" };

export default function CustomerOverviewPage() {
  return <CustomerOverview />;
}