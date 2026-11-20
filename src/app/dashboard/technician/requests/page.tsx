import type { Metadata } from "next";
import { ManageRequests } from "@/components/technician/manage-requests";

export const metadata: Metadata = { title: "Manage Requests | FixMate" };

export default function ManageRequestsPage() {
  return <ManageRequests />;
}