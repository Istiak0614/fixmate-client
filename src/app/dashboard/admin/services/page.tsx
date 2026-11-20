import type { Metadata } from "next";
import { ServiceApproval } from "@/components/admin/service-approval";

export const metadata: Metadata = { title: "Service Approval | FixMate" };

export default function ServiceApprovalPage() {
  return <ServiceApproval />;
}