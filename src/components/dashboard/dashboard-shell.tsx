"use client";

import { useState } from "react";
import Link from "next/link";
import { House, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu, type NavUser } from "@/components/layout/user-menu";
import { ROLE_LABELS, type Role } from "@/lib/roles";

/**
 * Dashboard Layout: fixed sidebar on desktop, a toggle (sheet) on mobile/tablet,
 * and a sticky top bar with Home link, theme toggle, and the user's avatar + name + role.
 * No public footer here (assignment).
 */
export function DashboardShell({ user, children }: { user: NavUser; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = (user.role ?? "customer") as Role;

  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="glass-strong fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border lg:block">
        <SidebarNav role={role} />
      </aside>

      {/* Mobile / tablet sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 bg-background p-0">
          <SheetTitle className="sr-only">Dashboard menu</SheetTitle>
          <SheetDescription className="sr-only">Pages of your dashboard</SheetDescription>
          <SidebarNav role={role} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="glass-strong sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open dashboard menu" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" />
          </Button>

          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/">
              <House className="size-4" /> Home
            </Link>
          </Button>

          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden text-right leading-tight sm:block">
              <p className="max-w-40 truncate text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground">{ROLE_LABELS[role] ?? "Customer"}</p>
            </div>
            <UserMenu user={user} />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}