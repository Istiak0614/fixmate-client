import type { Metadata } from "next";
import { ManageUsers } from "@/components/admin/manage-users";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Manage Users | FixMate" };

// The admin's own email is passed down so their own role control is disabled (the server blocks it too)
export default async function ManageUsersPage() {
  const user = await getCurrentUser();
  return <ManageUsers currentEmail={user?.email ?? ""} />;
}