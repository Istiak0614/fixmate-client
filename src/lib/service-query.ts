/**
 * The URL is the single source of truth for /services filters (Challenge 1):
 *   /services?search=iphone&category=Smartphone&mode=Home%20Visit&minPrice=10&maxPrice=60&sort=price-asc&page=2
 * So filters survive a reload, can be shared as a link, and Home category cards can open
 * the page already filtered. Only these keys are passed on to the API.
 */
export const SERVICE_QUERY_KEYS = ["search", "category", "mode", "minPrice", "maxPrice", "sort", "page"] as const;

export type ServiceSearchParams = Partial<Record<(typeof SERVICE_QUERY_KEYS)[number], string | string[]>>;

/** Page searchParams -> "search=...&category=..." (known keys only, empty values dropped) */
export function toServiceQueryString(params: ServiceSearchParams): string {
  const query = new URLSearchParams();
  for (const key of SERVICE_QUERY_KEYS) {
    const raw = params[key];
    const value = (Array.isArray(raw) ? raw[0] : raw)?.trim();
    if (value) query.set(key, value);
  }
  return query.toString();
}

/** True when any filter (not just the page number or sort) is active. */
export const hasActiveFilters = (query: string) =>
  ["search", "category", "mode", "minPrice", "maxPrice"].some((key) => new URLSearchParams(query).has(key));