import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock3, House, MapPin, ShieldCheck, Store } from "lucide-react";
import { ServiceImage } from "@/components/services/service-image";
import { RequestRepair } from "@/components/services/request-repair";
import { TechnicianSummary } from "@/components/services/technician-summary";
import { formatPrice } from "@/lib/category-icons";
import { serverGet } from "@/lib/server-api";
import { getCurrentUser } from "@/lib/session";
import type { ServiceDetails } from "@/lib/types";
import { RatingSummary } from "@/components/reviews/stars";
import { ServiceReviews } from "@/components/reviews/service-reviews";

type PageProps = { params: Promise<{ id: string }> };

// cache(): generateMetadata and the page share ONE request to Express
const getService = cache(async (id: string) => {
  const { data, status } = await serverGet<ServiceDetails>(`/services/${encodeURIComponent(id)}`);
  if (status === 404) notFound(); // missing, pending, rejected or unavailable -> Not Found page
  if (!data) throw new Error("Could not load this service. Please try again."); // -> error page
  return data;
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const service = await getService((await params).id);
  return { title: `${service.title} | FixMate`, description: service.description.slice(0, 150) };
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const [service, user] = await Promise.all([getService(id), getCurrentUser()]);
  const ModeIcon = service.serviceMode === "Home Visit" ? House : Store;

  const facts = [
    { Icon: Clock3, label: "Estimated duration", value: service.estimatedDuration },
    { Icon: ModeIcon, label: "Service mode", value: service.serviceMode },
    { Icon: MapPin, label: "Service area", value: service.serviceArea },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <Link href="/services" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary">
        <ChevronLeft className="size-4" /> All services
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        {/* Left: image + description */}
        <div className="space-y-8">
          <ServiceImage
            src={service.image}
            alt={service.title}
            category={service.category}
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="glass aspect-[4/3] rounded-3xl"
          />
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-2xl font-bold">
              About this service
            </h2>
            <p className="mt-4 text-lg leading-relaxed whitespace-pre-line text-muted-foreground">{service.description}</p>
          </section>
          <ServiceReviews serviceId={service._id} average={service.ratingAverage} count={service.ratingCount} />
        </div>

        {/* Right: key info + request (sticky on desktop) */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="glass rounded-3xl p-6 sm:p-8">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{service.category}</span>
            <h1 className="mt-4 text-3xl leading-tight font-bold sm:text-4xl">{service.title}</h1>
            <RatingSummary average={service.ratingAverage} count={service.ratingCount} className="mt-3" />

            <p className="mt-6">
              <span className="block text-sm text-muted-foreground">Starting price</span>
              <span className="font-display text-4xl font-bold">{formatPrice(service.basePrice)}</span>
            </p>

            <dl className="mt-6 space-y-3 border-y py-5">
              {facts.map(({ Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="size-5 shrink-0 text-primary" />
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="ml-auto text-right font-medium">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6">
                            <RequestRepair
                service={{ _id: service._id, title: service.title }}
                viewer={user ? { name: user.name, email: user.email, phone: user.phone, role: user.role } : null}
              />
            </div>
            <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              No payment now. You pay the final amount only after the job is completed.
            </p>
          </div>

          <TechnicianSummary technician={service.technician} />
        </aside>
      </div>
    </main>
  );
}