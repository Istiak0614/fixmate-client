import type { Metadata } from "next";
import { MyServices } from "@/components/technician/my-services";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "My Services | FixMate" };

export default async function MyServicesPage() {
  const user = await getCurrentUser();
  return <MyServices technician={{ name: user?.name ?? "", email: user?.email ?? "" }} />;
}