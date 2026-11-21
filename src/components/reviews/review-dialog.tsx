"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

const WORDS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

/** "Leave a review" for a PAID booking (the server allows it once). Stars are radio buttons, so arrow keys work. */
export function ReviewDialog({ bookingId, serviceTitle, onDone }: { bookingId: string; serviceTitle: string; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) return setError("Choose a rating from 1 to 5 stars");
    if (review.trim().length < 10) return setError("Write at least 10 characters about the job");
    setError("");
    setSaving(true);
    try {
      await api(`/bookings/${bookingId}/review`, { method: "PATCH", json: { rating, review: review.trim() } });
      toast.success("Thanks for your review!");
      setOpen(false);
      onDone();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save your review");
    } finally {
      setSaving(false);
    }
  }

  const shown = hover || rating;

  return (
    <Dialog open={open} onOpenChange={(next) => !saving && setOpen(next)}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Star className="size-4" /> Review
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background sm:max-w-md">
        <form onSubmit={submit} noValidate>
          <DialogHeader>
            <DialogTitle>Review this job</DialogTitle>
            <DialogDescription>{serviceTitle}. You can review a job once, and other customers will see it.</DialogDescription>
          </DialogHeader>

          <fieldset className="mt-5">
            <legend className="text-sm font-medium">Your rating</legend>
            <div className="mt-2 flex items-center gap-1" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <label key={n} className="cursor-pointer rounded-md p-0.5 has-focus-visible:ring-2 has-focus-visible:ring-ring" onMouseEnter={() => setHover(n)}>
                  <input type="radio" name="rating" value={n} checked={rating === n} onChange={() => { setRating(n); setError(""); }} className="sr-only" />
                  <Star className={cn("size-8 transition-colors", n <= shown ? "fill-highlight text-highlight" : "text-muted-foreground/50")} aria-hidden />
                  <span className="sr-only">{n} star{n > 1 && "s"}, {WORDS[n]}</span>
                </label>
              ))}
              <span className="ml-2 text-sm text-muted-foreground" aria-live="polite">{WORDS[shown]}</span>
            </div>
          </fieldset>

          <div className="mt-5 space-y-2">
            <Label htmlFor="review-text">Your review</Label>
            <Textarea id="review-text" rows={4} maxLength={500} value={review} onChange={(e) => setReview(e.target.value)} placeholder="Was the technician on time? Is the problem fixed?" />
            <p className="text-right text-xs text-muted-foreground">{review.length}/500</p>
          </div>

          {error && <p className="mt-1 text-sm text-destructive" role="alert">{error}</p>}

          <DialogFooter className="mt-5">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={saving}>Not now</Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />} Post review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}