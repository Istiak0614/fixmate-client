import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Dashboard | FixMate" };

/**
 * Second layer of protection (proxy.ts is the first): the layout reads the session on the
 * server, so a dashboard page can never render for a logged-out visitor.
 * Role-specific redirects happen in proxy.ts (src/lib/route-guard.ts).
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/dashboard");

  return (
    <DashboardShell user={{ name: user.name, email: user.email, image: user.image, role: user.role }}>{children}</DashboardShell>
  );
}