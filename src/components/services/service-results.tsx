import Link from "next/link";
import { SearchX, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/services/service-card";
import { Pagination } from "@/components/services/pagination";
import { serverFetch } from "@/lib/server-api";
import { hasActiveFilters } from "@/lib/service-query";
import type { ServiceListResponse } from "@/lib/types";

/** Fetches the filtered page from Express (on the server) and shows the grid, an empty state or an error. */
export async function ServiceResults({ query }: { query: string }) {
  const data = await serverFetch<ServiceListResponse>(`/services${query ? `?${query}` : ""}`);

  if (!data) {
    return (
      <StateBox Icon={ServerCrash} title="We couldn't load services right now" text="Please refresh the page in a moment." />
    );
  }

  if (data.total === 0) {
    const filtered = hasActiveFilters(query);
    return (
      <StateBox
        Icon={SearchX}
        title={filtered ? "No services match your search" : "No services yet"}
        text={filtered ? "Try another word, a different category, or a wider price range." : "Approved services will appear here soon."}
        action={filtered ? { href: "/services", label: "Clear all filters" } : undefined}
      />
    );
  }

  const from = (data.page - 1) * data.limit + 1;
  const to = Math.min(data.page * data.limit, data.total);

  return (
    <>
      <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">
        Showing {from}–{to} of {data.total} service{data.total === 1 ? "" : "s"}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.services.map((service, index) => (
          <ServiceCard key={service._id} service={service} priority={index < 4} />
        ))}
      </div>
      <Pagination query={query} page={data.page} totalPages={data.totalPages} />
    </>
  );
}

function StateBox({
  Icon,
  title,
  text,
  action,
}: {
  Icon: typeof SearchX;
  title: string;
  text: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="glass mx-auto mt-6 max-w-md rounded-2xl p-10 text-center">
      <Icon className="mx-auto size-12 text-primary" />
      <h2 className="mt-4 text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-muted-foreground">{text}</p>
      {action && (
        <Button asChild className="mt-6">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}