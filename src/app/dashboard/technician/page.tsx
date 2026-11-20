import type { Metadata } from "next";
import { TechnicianOverview } from "@/components/technician/technician-overview";

export const metadata: Metadata = { title: "Technician Overview | FixMate" };

export default function TechnicianOverviewPage() {
  return <TechnicianOverview />;
}