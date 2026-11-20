import type { Metadata } from "next";
import { AddService } from "@/components/technician/add-service";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Add a Service | FixMate" };

// Name and email for the read-only fields come from the session (the layout already checked login)
export default async function AddServicePage() {
  const user = await getCurrentUser();
  return <AddService technician={{ name: user?.name ?? "", email: user?.email ?? "" }} />;
}