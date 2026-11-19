import { AirVent, Laptop, PlugZap, Refrigerator, Smartphone, Tv, WashingMachine, type LucideIcon } from "lucide-react";
import type { ServiceCategory } from "./constants";

/** One icon per repair category (category cards, image fallbacks, filters). */
export const CATEGORY_ICONS: Record<ServiceCategory, LucideIcon> = {
  Smartphone: Smartphone,
  "Laptop & PC": Laptop,
  AC: AirVent,
  Refrigerator: Refrigerator,
  TV: Tv,
  "Washing Machine": WashingMachine,
  Electrical: PlugZap,
};

export const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: amount % 1 ? 2 : 0 }).format(amount);