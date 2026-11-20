import { Suspense } from "react";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceFilters } from "@/components/services/service-filters";
import { ServiceResults } from "@/components/services/service-results";
import { ServiceGridSkeleton } from "@/components/services/service-grid-skeleton";
import { toServiceQueryString, type ServiceSearchParams } from "@/lib/service-query";

export const metadata: Metadata = { title: "Browse Services | FixMate" };

/**
 * /services (Challenge 1). Filters live in the URL; the server fetches the matching page from
 * Express. The Suspense key changes with the filters, so the skeleton shows while new results load.
 */
export default async function ServicesPage({ searchParams }: { searchParams: Promise<ServiceSearchParams> }) {
  const query = toServiceQueryString(await searchParams);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <SectionHeading
        align="left"
        title="Browse repair services"
        subtitle="Every service here is approved by our admins. Search, filter and compare, then book in minutes."
      />

      <Suspense>
        <ServiceFilters />
      </Suspense>

      <div className="mt-8">
        <Suspense key={query} fallback={<ServiceGridSkeleton />}>
          <ServiceResults query={query} />
        </Suspense>
      </div>
    </main>
  );
}