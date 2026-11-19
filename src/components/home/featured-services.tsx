import Link from "next/link";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceCard } from "@/components/services/service-card";
import type { Service } from "@/lib/types";

/** The 6 latest approved + available services (fetched on the server by the page). */
export function FeaturedServices({ services }: { services: Service[] | null }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        title="Latest verified services"
        subtitle="Fresh listings from technicians our admins have approved, ready to book today."
      />

      {services && services.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service._id} service={service} priority={index < 3} />
          ))}
        </div>
      ) : (
        <div className="glass mx-auto max-w-md rounded-2xl p-10 text-center">
          <Wrench className="mx-auto size-10 text-primary" />
          <p className="mt-4 font-semibold">
            {services ? "New services are on their way" : "We couldn't load services right now"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {services ? "Technicians are adding their first listings. Check back soon." : "Please refresh the page in a moment."}
          </p>
        </div>
      )}

      <div className="mt-10 text-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/services">Browse all services</Link>
        </Button>
      </div>
    </section>
  );
}