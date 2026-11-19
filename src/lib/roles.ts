/** Role helpers used by auth pages, the navbar, the dashboard and the proxy. */
export type Role = "customer" | "technician" | "admin";

export const ROLE_LABELS: Record<Role, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

/** Each role's home dashboard. Unknown values fall back to the customer dashboard. */
export function dashboardPath(role?: string | null): string {
  if (role === "admin") return "/dashboard/admin";
  if (role === "technician") return "/dashboard/technician";
  return "/dashboard/customer";
}

/**
 * Only allow redirects to pages on OUR site ("/services/123"), never to another site
 * ("https://evil.com" or "//evil.com") — prevents open-redirect attacks via ?callbackUrl=.
 */
export function safeCallbackUrl(url?: string | string[] | null): string | null {
  const value = Array.isArray(url) ? url[0] : url;
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return null;
  return value;
}