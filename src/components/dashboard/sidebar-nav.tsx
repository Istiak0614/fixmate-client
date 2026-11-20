"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, LogOut } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ROLE_MENUS, SHARED_MENU, type MenuItem } from "@/components/dashboard/menu";
import { ROLE_LABELS, type Role } from "@/lib/roles";
import { useSignOut } from "@/lib/use-sign-out";
import { cn } from "@/lib/utils";

/**
 * Sidebar content (used in the desktop sidebar AND the mobile sheet).
 * "Overview" is active only on its exact path; other items also stay active on sub-pages.
 */
export function SidebarNav({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname();
  const handleSignOut = useSignOut();
  const menu = ROLE_MENUS[role] ?? ROLE_MENUS.customer;
  const overview = menu[0].href;

  const isActive = (href: string) => (href === overview ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  const renderItem = ({ href, label, Icon }: MenuItem) => {
    const active = isActive(href);
    return (
      <li key={href}>
        <Link
          href={href}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            active ? "bg-primary text-primary-foreground shadow-sm" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <Icon className="size-5 shrink-0" />
          {label}
        </Link>
      </li>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>

      <nav aria-label="Dashboard" className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-xs font-semibold text-muted-foreground">{ROLE_LABELS[role] ?? "Customer"} dashboard</p>
        <ul className="space-y-1">{menu.map(renderItem)}</ul>
        <p className="mt-6 px-3 pb-2 text-xs font-semibold text-muted-foreground">Account</p>
        <ul className="space-y-1">{SHARED_MENU.map(renderItem)}</ul>
      </nav>

      <div className="space-y-1 border-t border-sidebar-border p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent"
        >
          <House className="size-5" /> Back to Home
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
        >
          <LogOut className="size-5" /> Sign Out
        </button>
      </div>
    </div>
  );
}