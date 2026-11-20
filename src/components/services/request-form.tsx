"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/auth/form-field";
import { api, ApiError } from "@/lib/api";
import { PHONE_REGEX, todayLocal } from "@/lib/validation";

export type RequestFormUser = { name: string; email: string; phone?: string | null };
type Errors = Partial<Record<"phone" | "address" | "date" | "problem", string>>;

const MIN_PROBLEM = 20;

/**
 * Repair request form (customers only). Name and email come from the session and are read-only.
 * Everything is checked here for instant feedback AND again on the server (Server step 10).
 */
export function RequestForm({ serviceId, user, onDone }: { serviceId: string; user: RequestFormUser; onDone: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({ phone: user.phone ?? "", address: "", date: "", problem: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const minDate = todayLocal();

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  function validate(): Errors {
    const next: Errors = {};
    if (!PHONE_REGEX.test(form.phone.trim())) next.phone = "Enter a valid phone number, e.g. 01712345678";
    if (form.address.trim().length < 5) next.address = "Enter the address where the repair or pickup happens";
    if (!form.date) next.date = "Choose a preferred date";
    else if (form.date < minDate) next.date = "Choose today or a future date"; // "YYYY-MM-DD" compares correctly as text
    if (form.problem.trim().length < MIN_PROBLEM) next.problem = `Describe the problem in at least ${MIN_PROBLEM} characters`;
    return next;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      await api("/bookings", {
        method: "POST",
        json: {
          serviceId,
          customerPhone: form.phone.trim(),
          address: form.address.trim(),
          preferredDate: form.date,
          problemDescription: form.problem.trim(),
        },
      });
      toast.success("Repair request sent", {
        description: "The technician will review it soon. Track it in My Bookings.",
        action: { label: "My Bookings", onClick: () => router.push("/dashboard/customer/bookings") },
      });
      onDone();
    } catch (error) {
      // e.g. 409 "You already have an active request for this service"
      toast.error(error instanceof ApiError ? error.message : "Could not send the request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const problemLength = form.problem.trim().length;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="req-name" label="Name">
          <Input id="req-name" value={user.name} readOnly className="h-11 bg-muted/60" />
        </FormField>
        <FormField id="req-email" label="Email">
          <Input id="req-email" value={user.email} readOnly className="h-11 bg-muted/60" />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="req-phone" label="Phone" error={errors.phone}>
          <Input id="req-phone" type="tel" autoComplete="tel" placeholder="01712345678" value={form.phone} onChange={update("phone")} aria-invalid={!!errors.phone} className="h-11" />
        </FormField>
        <FormField id="req-date" label="Preferred date" error={errors.date}>
          <Input id="req-date" type="date" min={minDate} value={form.date} onChange={update("date")} aria-invalid={!!errors.date} className="h-11" />
        </FormField>
      </div>

      <FormField id="req-address" label="Address" error={errors.address}>
        <Input id="req-address" autoComplete="street-address" placeholder="House, road, area, city" value={form.address} onChange={update("address")} aria-invalid={!!errors.address} className="h-11" />
      </FormField>

      <FormField id="req-problem" label="Problem description" error={errors.problem}>
        <Textarea
          id="req-problem"
          rows={4}
          placeholder="What happened, what you have tried, and the device model"
          value={form.problem}
          onChange={update("problem")}
          aria-invalid={!!errors.problem}
          aria-describedby="req-problem-count"
          className="min-h-28"
        />
        <p id="req-problem-count" className={problemLength >= MIN_PROBLEM ? "text-xs text-green-600 dark:text-green-400" : "text-xs text-muted-foreground"}>
          {problemLength}/{MIN_PROBLEM} characters minimum
        </p>
      </FormField>

      <Button type="submit" size="lg" className="h-11 w-full text-base" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        {loading ? "Sending request..." : "Send repair request"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        No payment now. Need to change your phone or name? Update your{" "}
        <Link href="/dashboard/profile" className="font-medium text-primary hover:underline">
          profile
        </Link>
        .
      </p>
    </form>
  );
}