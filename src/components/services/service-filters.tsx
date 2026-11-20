"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICE_CATEGORIES, SERVICE_MODES } from "@/lib/constants";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

/**
 * Search bar + filters + sort for /services. It never filters anything itself: it only writes
 * the choices into the URL, and the server page fetches the matching services from Express.
 * Text and price inputs wait 500 ms after typing stops, so we don't send a request per key.
 */
export function ServiceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const fromUrl = useCallback((key: string) => params.get(key) ?? "", [params]);

  // Write changes into the URL. Any filter change goes back to page 1.
  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      next.delete("page");
      const query = next.toString();
      startTransition(() => router.push(query ? `${pathname}?${query}` : pathname, { scroll: false }));
    },
    [params, pathname, router]
  );

  // Typed fields keep a local copy (so typing is instant) and are sent after a pause.
  const [search, setSearch] = useState(fromUrl("search"));
  const [minPrice, setMinPrice] = useState(fromUrl("minPrice"));
  const [maxPrice, setMaxPrice] = useState(fromUrl("maxPrice"));
  const sent = useRef({ search: fromUrl("search"), minPrice: fromUrl("minPrice"), maxPrice: fromUrl("maxPrice") });

  // URL changed from outside (Back button, Clear filters, a category link) -> update the inputs
  useEffect(() => {
    const url = { search: fromUrl("search"), minPrice: fromUrl("minPrice"), maxPrice: fromUrl("maxPrice") };
    if (url.search !== sent.current.search) setSearch(url.search);
    if (url.minPrice !== sent.current.minPrice) setMinPrice(url.minPrice);
    if (url.maxPrice !== sent.current.maxPrice) setMaxPrice(url.maxPrice);
    sent.current = url;
  }, [fromUrl]);

  // Debounce: send the typed values 500 ms after the last key press
  useEffect(() => {
    const typed = { search: search.trim(), minPrice: minPrice.trim(), maxPrice: maxPrice.trim() };
    const changed =
      typed.search !== sent.current.search ||
      typed.minPrice !== sent.current.minPrice ||
      typed.maxPrice !== sent.current.maxPrice;
    if (!changed) return;
    const timer = setTimeout(() => {
      sent.current = typed;
      updateUrl({ search: typed.search || null, minPrice: typed.minPrice || null, maxPrice: typed.maxPrice || null });
    }, 500);
    return () => clearTimeout(timer);
  }, [search, minPrice, maxPrice, updateUrl]);

  const hasFilters = ["search", "category", "mode", "minPrice", "maxPrice", "sort"].some((key) => params.has(key));

  return (
    <div className="glass rounded-2xl p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 z-10 size-5 -translate-y-1/2 text-muted-foreground" />
          <label htmlFor="service-search" className="sr-only">
            Search by title or category
          </label>
          <Input
            id="service-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category, e.g. screen, AC"
            className="h-11 pl-11"
          />
        </div>

        <Select value={fromUrl("sort") || "newest"} onValueChange={(v) => updateUrl({ sort: v === "newest" ? null : v })}>
          <SelectTrigger className="h-11 w-full lg:w-52" aria-label="Sort services">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4 lg:flex lg:items-center">
        <Select value={fromUrl("category") || "all"} onValueChange={(v) => updateUrl({ category: v === "all" ? null : v })}>
          <SelectTrigger className="h-10 w-full lg:w-48" aria-label="Filter by category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {SERVICE_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={fromUrl("mode") || "all"} onValueChange={(v) => updateUrl({ mode: v === "all" ? null : v })}>
          <SelectTrigger className="h-10 w-full lg:w-44" aria-label="Filter by service mode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any service mode</SelectItem>
            {SERVICE_MODES.map((mode) => (
              <SelectItem key={mode} value={mode}>
                {mode}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          inputMode="decimal"
          min={0}
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min $"
          aria-label="Minimum price in dollars"
          className="h-10 lg:w-28"
        />
        <Input
          type="number"
          inputMode="decimal"
          min={0}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max $"
          aria-label="Maximum price in dollars"
          className="h-10 lg:w-28"
        />

        <div className="col-span-2 flex items-center gap-3 md:col-span-4 lg:ml-auto">
          {isPending && (
            <span className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
              <Loader2 className="size-4 animate-spin" /> Updating
            </span>
          )}
          {hasFilters && (
            <Button variant="ghost" onClick={() => startTransition(() => router.push(pathname, { scroll: false }))}>
              <X className="size-4" /> Clear filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}