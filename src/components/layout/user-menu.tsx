"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut, UserPen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_LABELS, dashboardPath, type Role } from "@/lib/roles";
import { useSignOut } from "@/lib/use-sign-out";

export type NavUser = { name: string; email: string; image?: string | null; role?: string | null };

/** "Nusrat Jahan" -> "NJ" (shown when the user has no photo) */
export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

/** Avatar button + dropdown: name, role badge, Dashboard, Update Profile, Sign Out. */
export function UserMenu({ user }: { user: NavUser }) {
  const handleSignOut = useSignOut();
  const role = (user.role ?? "customer") as Role;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        className="rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <Avatar className="size-9 ring-2 ring-primary/40 transition hover:ring-primary">
          <AvatarImage src={user.image ?? undefined} alt={user.name} className="object-cover" />
          <AvatarFallback className="bg-primary/15 font-semibold text-primary">{initials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="space-y-1.5 font-normal">
          <p className="truncate font-semibold">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <Badge variant="secondary" className="text-primary">
            {ROLE_LABELS[role] ?? "Customer"}
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={dashboardPath(role)}>
            <LayoutDashboard /> Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">
            <UserPen /> Update Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
          <LogOut /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}