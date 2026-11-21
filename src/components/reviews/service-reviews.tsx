import { MessageSquareText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RatingSummary, Stars } from "@/components/reviews/stars";
import { formatDate, initials } from "@/lib/format";
import { serverFetch } from "@/lib/server-api";
import type { Review } from "@/lib/types";

/** Reviews on the service details page (server component). Customers review after paying for a job. */
export async function ServiceReviews({ serviceId, average, count }: { serviceId: string; average?: number; count?: number }) {
  const reviews = await serverFetch<Review[]>(`/services/${encodeURIComponent(serviceId)}/reviews`);

  return (
    <section aria-labelledby="reviews-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="reviews-heading" className="text-2xl font-bold">Customer reviews</h2>
        <RatingSummary average={average} count={count} />
      </div>

      {reviews === null ? (
        <p className="mt-4 text-muted-foreground">Reviews couldn&apos;t be loaded right now.</p>
      ) : reviews.length === 0 ? (
        <div className="glass mt-4 flex items-center gap-3 rounded-2xl p-5 text-muted-foreground">
          <MessageSquareText className="size-5 shrink-0 text-primary" aria-hidden />
          No reviews yet. Customers can review this service after a paid job.
        </div>
      ) : (
        <ul className="mt-4 space-y-4">
          {reviews.map((r) => (
            <li key={r._id} className="glass rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage src={r.image ?? undefined} alt="" className="object-cover" />
                  <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">{initials(r.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(r.reviewedAt)}</p>
                </div>
                <Stars value={r.rating} className="ml-auto" />
              </div>
              <p className="mt-3 leading-relaxed">{r.review}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}