/**
 * Shared constants. These MUST match the server's lists (fixmate-server/src/utils/validate.ts),
 * because the server rejects any other category or service mode.
 */
export const SERVICE_CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
] as const;

export const SERVICE_MODES = ["Home Visit", "Shop Drop-off"] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];
export type ServiceMode = (typeof SERVICE_MODES)[number];

/** Link to the Services page with a category already filtered (Challenge 1 reads it from the URL). */
export const categoryHref = (category: string) => `/services?category=${encodeURIComponent(category)}`;