/** Small formatting helpers usable in BOTH server and client components. */

/** "Nusrat Jahan" -> "NJ" (avatar fallback when the user has no photo) */
export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

/** "2026-12-24T00:00:00.000Z" -> "24 Dec 2026". Preferred dates are stored as UTC midnight, so read them in UTC. */
export function formatDate(iso: string, utc = false) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", ...(utc && { timeZone: "UTC" }) });
}

/** "24 Dec 2026, 3:45 pm" in the viewer's own time zone (payments, status changes). */
export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}