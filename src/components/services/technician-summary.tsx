import { MapPin } from "lucide-react";
import { ProBadge } from "@/components/shared/pro-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/format";
import type { ServiceDetails } from "@/lib/types";

/** Technician summary on the details page: photo, name, area, bio (+ "Verified Pro" for Pro technicians). */
export function TechnicianSummary({ technician }: { technician: ServiceDetails["technician"] }) {
  return (
    <section aria-labelledby="technician-heading" className="glass rounded-2xl p-6">
      <h2 id="technician-heading" className="text-sm font-semibold text-muted-foreground">
        Your technician
      </h2>
      <div className="mt-4 flex items-center gap-4">
        <Avatar className="size-16 ring-2 ring-primary/40">
          <AvatarImage src={technician.image ?? undefined} alt={technician.name} className="object-cover" />
          <AvatarFallback className="bg-primary/15 text-lg font-semibold text-primary">{initials(technician.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-xl font-semibold">
            {technician.name}
            {technician.plan === "pro" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-highlight px-2 py-0.5 text-xs font-bold text-highlight-foreground">
                {technician.plan === "pro" && <ProBadge />}
              </span>
            )}
          </p>
          {technician.area && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" /> {technician.area}
            </p>
          )}
        </div>
      </div>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        {technician.bio || "This technician hasn't added a bio yet."}
      </p>
    </section>
  );
}