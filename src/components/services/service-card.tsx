import Link from "next/link";
import { House, MapPin, Store, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceImage } from "@/components/services/service-image";
import { formatPrice } from "@/lib/category-icons";
import type { Service } from "@/lib/types";

/**
 * The one service card used on Home and Services.
 * Equal height in any grid: h-full + flex column + the button pushed to the bottom (mt-auto),
 * and the title always reserves two lines.
 */
export function ServiceCard({ service, priority = false }: { service: Service; priority?: boolean }) {
  const ModeIcon = service.serviceMode === "Home Visit" ? House : Store;

  return (
    <article className="glass group flex h-full flex-col overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1 hover:border-primary/40">
      <ServiceImage
        src={service.image}
        alt={service.title}
        category={service.category}
        priority={priority}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="aspect-[4/3]"
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-accent px-2.5 py-1 text-accent-foreground">{service.category}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
            <ModeIcon className="size-3.5" /> {service.serviceMode}
          </span>
        </div>

        <h3 className="mt-3 line-clamp-2 min-h-[3.25rem] text-lg leading-snug font-semibold">{service.title}</h3>

        <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">{service.serviceArea}</span>
          </li>
          <li className="flex items-center gap-2">
            <UserRound className="size-4 shrink-0" />
            <span className="truncate">{service.technicianName}</span>
          </li>
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="leading-tight">
            <span className="block text-xs text-muted-foreground">Starting at</span>
            <span className="font-display text-2xl font-bold">{formatPrice(service.basePrice)}</span>
          </p>
          <Button asChild>
            <Link href={`/services/${service._id}`} aria-label={`View details of ${service.title}`}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}