import {
  CalendarCheck,
  CirclePlus,
  ClipboardList,
  CreditCard,
  Inbox,
  LayoutDashboard,
  Receipt,
  ShieldCheck,
  UserPen,
  Users,
  Wrench,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";

export type MenuItem = { href: string; label: string; Icon: LucideIcon };

/** The sidebar changes with the logged-in user's role (assignment requirement). */
export const ROLE_MENUS: Record<string, MenuItem[]> = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", Icon: LayoutDashboard },
    { href: "/dashboard/customer/bookings", label: "My Bookings", Icon: CalendarCheck },
    { href: "/dashboard/customer/payments", label: "Payment History", Icon: Receipt },
  ],
  technician: [
    { href: "/dashboard/technician", label: "Overview", Icon: LayoutDashboard },
    { href: "/dashboard/technician/add-service", label: "Add a Service", Icon: CirclePlus },
    { href: "/dashboard/technician/my-services", label: "My Services", Icon: Wrench },
    { href: "/dashboard/technician/requests", label: "Manage Requests", Icon: Inbox },
    { href: "/dashboard/technician/plan", label: "Pro Plan", Icon: BadgeCheck },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", Icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", Icon: Users },
    { href: "/dashboard/admin/services", label: "Service Approval", Icon: ShieldCheck },
    { href: "/dashboard/admin/bookings", label: "All Bookings", Icon: ClipboardList },
    { href: "/dashboard/admin/transactions", label: "Transactions", Icon: CreditCard },
  ],
};

/** Shown for every role, under the role menu. */
export const SHARED_MENU: MenuItem[] = [{ href: "/dashboard/profile", label: "Update Profile", Icon: UserPen }];