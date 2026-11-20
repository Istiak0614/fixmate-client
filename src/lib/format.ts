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