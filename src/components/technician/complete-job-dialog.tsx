"use client";

import { useState } from "react";
import { CircleCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/auth/form-field";
import { formatPrice } from "@/lib/category-icons";
import type { Booking } from "@/lib/types";

/** "Mark Completed" opens this small modal: final amount, pre-filled with the base price (> 0). */
export function CompleteJobDialog({ job, onComplete }: { job: Booking; onComplete: (finalAmount: number) => Promise<boolean> }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(String(job.basePrice));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = Number(amount);
    if (!amount || !Number.isFinite(value) || value <= 0) {
      setError("Enter a final amount greater than 0");
      return;
    }
    setSaving(true);
    const ok = await onComplete(Math.round(value * 100) / 100);
    setSaving(false);
    if (ok) setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setAmount(String(job.basePrice));
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <CircleCheck className="size-4" /> Mark Completed
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background sm:max-w-md">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <DialogHeader>
            <DialogTitle>Mark the job as completed</DialogTitle>
            <DialogDescription>
              {job.serviceTitle} for {job.customerName}. The customer pays this amount by card. Base price: {formatPrice(job.basePrice)}.
            </DialogDescription>
          </DialogHeader>
          <FormField id={`final-${job._id}`} label="Final amount (USD)" error={error ?? undefined}>
            <Input
              id={`final-${job._id}`}
              type="number"
              inputMode="decimal"
              min={0.01}
              step="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError(null);
              }}
              aria-invalid={!!error}
              className="h-11 text-lg"
              autoFocus
            />
          </FormField>
          <DialogFooter>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              Complete job
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}