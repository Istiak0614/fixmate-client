/**
 * The routing rules used by proxy.ts, kept as a plain function so they are easy to read and test.
 * Returns the path to redirect to, or null to let the request continue.
 */
import { dashboardPath, safeCallbackUrl } from "./roles";

const AUTH_PAGES = ["/sign-in", "/sign-up"];

// Which role may open which dashboard section. "/dashboard/profile" is for everyone.
const ROLE_SECTIONS: Record<string, string> = {
  "/dashboard/customer": "customer",
  "/dashboard/technician": "technician",
  "/dashboard/admin": "admin",
};

export function getRedirect(
  pathname: string,
  search: string,
  user: { role?: string | null } | null
): string | null {
  const isAuthPage = AUTH_PAGES.includes(pathname);
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  // 1. Logged-out user on a private page -> Sign In, then come back here afterwards
  if (!user) {
    if (isDashboard) return `/sign-in?callbackUrl=${encodeURIComponent(pathname + search)}`;
    return null;
  }

  const ownDashboard = dashboardPath(user.role);

  // 2. Logged-in user on Sign In / Sign Up -> where they wanted to go, or their dashboard
  if (isAuthPage) {
    const callbackUrl = safeCallbackUrl(new URLSearchParams(search).get("callbackUrl"));
    return callbackUrl ?? ownDashboard;
  }

  // 3. "/dashboard" itself -> the role's own dashboard
  if (pathname === "/dashboard") return ownDashboard;

  // 4. Wrong role for this section (e.g. a customer opening /dashboard/admin) -> own dashboard
  for (const [section, role] of Object.entries(ROLE_SECTIONS)) {
    if ((pathname === section || pathname.startsWith(`${section}/`)) && user.role !== role) {
      return ownDashboard;
    }
  }

  return null;
}