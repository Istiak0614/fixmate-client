"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/page-header";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/dashboard/states";
import { api, ApiError } from "@/lib/api";
import { formatDate, initials } from "@/lib/format";
import { ROLE_LABELS, type Role } from "@/lib/roles";
import { useApi } from "@/lib/use-api";

type AdminUser = { _id: string; name: string; email: string; image?: string | null; role?: Role; plan?: string; createdAt?: string };
const ROLES: Role[] = ["customer", "technician", "admin"];

export function ManageUsers({ currentEmail }: { currentEmail: string }) {
  const { data: users, loading, error, reload } = useApi<AdminUser[]>("/admin/users");
  const [pending, setPending] = useState<{ user: AdminUser; role: Role } | null>(null);

  async function changeRole() {
    if (!pending) return;
    try {
      await api(`/admin/users/${pending.user._id}/role`, { method: "PATCH", json: { role: pending.role } });
      const label = ROLE_LABELS[pending.role].toLowerCase();
      toast.success(`${pending.user.name} is now ${pending.role === "admin" ? "an" : "a"} ${label}`);
      setPending(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not change the role");
    }
  }

  const header = <PageHeader title="Manage Users" description="Everyone on FixMate. Change a role when someone needs different access." />;
  if (loading && !users) return (<>{header}<TableSkeleton /></>);
  if (error) return (<>{header}<ErrorState message={error} onRetry={reload} /></>);
  if (!users || users.length === 0) return (<>{header}<EmptyState title="No users yet" text="People appear here after they sign up." /></>);

  const roleControl = (u: AdminUser) => {
    const isMe = u.email === currentEmail;
    const role = u.role ?? "customer";
    return (
      <div className="flex items-center gap-2">
        <Select value={role} disabled={isMe} onValueChange={(next) => next !== role && setPending({ user: u, role: next as Role })}>
          <SelectTrigger className="h-9 w-36" aria-label={`Role of ${u.name}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isMe && <span className="text-xs text-muted-foreground">You can&apos;t change your own role</span>}
      </div>
    );
  };

  const person = (u: AdminUser) => (
    <div className="flex items-center gap-3">
      <Avatar className="size-10">
        <AvatarImage src={u.image ?? undefined} alt="" className="object-cover" />
        <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">{initials(u.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-medium">{u.name}</p>
        <p className="truncate text-sm text-muted-foreground">{u.email}</p>
      </div>
    </div>
  );

  return (
    <>
      {header}
      <p className="mb-4 text-sm text-muted-foreground">{users.length} users</p>

      <div className="glass hidden overflow-x-auto rounded-2xl md:block">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-muted-foreground">
            <tr>
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b last:border-0">
                <td className="p-4">{person(u)}</td>
                <td className="p-4">{roleControl(u)}</td>
                <td className="p-4 whitespace-nowrap">{u.createdAt ? formatDate(u.createdAt) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-4 md:hidden">
        {users.map((u) => (
          <li key={u._id} className="glass space-y-3 rounded-2xl p-4">
            {person(u)}
            {roleControl(u)}
            <p className="text-xs text-muted-foreground">Joined {u.createdAt ? formatDate(u.createdAt) : "—"}</p>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        title="Change this user's role?"
        description={pending ? `${pending.user.name} will become ${ROLE_LABELS[pending.role]}. Their access changes on their next request.` : ""}
        confirmLabel="Change role"
        onConfirm={changeRole}
      />
    </>
  );
}