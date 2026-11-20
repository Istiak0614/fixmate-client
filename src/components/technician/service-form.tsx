"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/auth/form-field";
import { ImageUpload } from "@/components/shared/image-upload";
import { SERVICE_CATEGORIES, SERVICE_MODES } from "@/lib/constants";

export type ServiceFormValues = {
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
};

export const EMPTY_SERVICE: ServiceFormValues = {
  title: "",
  category: "",
  description: "",
  image: "",
  basePrice: "",
  estimatedDuration: "",
  serviceMode: "",
  serviceArea: "",
};

type Errors = Partial<Record<keyof ServiceFormValues, string>>;

/** Same rules as the server (fixmate-server/src/utils/validate.ts). */
function validate(v: ServiceFormValues): Errors {
  const e: Errors = {};
  const price = Number(v.basePrice);
  if (v.title.trim().length < 5 || v.title.trim().length > 80) e.title = "Title must be 5 to 80 characters";
  if (!v.category) e.category = "Choose a category";
  if (v.description.trim().length < 20) e.description = "Description must be at least 20 characters";
  if (!v.image) e.image = "Upload a service image";
  if (!v.basePrice || !Number.isFinite(price) || price <= 0) e.basePrice = "Base price must be a positive number";
  if (!v.estimatedDuration.trim()) e.estimatedDuration = "Estimated duration is required";
  if (!v.serviceMode) e.serviceMode = "Choose a service mode";
  if (!v.serviceArea.trim()) e.serviceArea = "Service area is required";
  return e;
}

/**
 * Add / edit a service. Technician name and email are shown read-only from the session.
 * onSubmit receives clean values (numbers as numbers) and may throw; the parent shows the toast.
 */
export function ServiceForm({
  initial = EMPTY_SERVICE,
  technician,
  submitLabel,
  onSubmit,
}: {
  initial?: ServiceFormValues;
  technician: { name: string; email: string };
  submitLabel: string;
  onSubmit: (data: Record<string, string | number>) => Promise<void>;
}) {
  const [values, setValues] = useState<ServiceFormValues>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (field: keyof ServiceFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };
  const input = (field: keyof ServiceFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(field, e.target.value);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      await onSubmit({
        title: values.title.trim(),
        category: values.category,
        description: values.description.trim(),
        image: values.image,
        basePrice: Number(values.basePrice),
        estimatedDuration: values.estimatedDuration.trim(),
        serviceMode: values.serviceMode,
        serviceArea: values.serviceArea.trim(),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="space-y-2">
        <Label>Service image</Label>
        <ImageUpload value={values.image} onChange={(url) => set("image", url)} onUploadingChange={setUploading} invalid={!!errors.image} />
        {errors.image && <p role="alert" className="text-sm font-medium text-destructive">{errors.image}</p>}
      </div>

      <FormField id="svc-title" label="Title" error={errors.title}>
        <Input id="svc-title" value={values.title} onChange={input("title")} placeholder="e.g. iPhone 14/15 Screen Replacement" aria-invalid={!!errors.title} className="h-11" />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="svc-category" label="Category" error={errors.category}>
          <Select value={values.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger id="svc-category" className="h-11 w-full" aria-invalid={!!errors.category}>
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField id="svc-mode" label="Service mode" error={errors.serviceMode}>
          <Select value={values.serviceMode} onValueChange={(v) => set("serviceMode", v)}>
            <SelectTrigger id="svc-mode" className="h-11 w-full" aria-invalid={!!errors.serviceMode}>
              <SelectValue placeholder="Home Visit or Shop Drop-off" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_MODES.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <FormField id="svc-description" label="Description" error={errors.description}>
        <Textarea id="svc-description" rows={5} value={values.description} onChange={input("description")} placeholder="What's included, parts used, warranty..." aria-invalid={!!errors.description} className="min-h-32" />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField id="svc-price" label="Base price (USD)" error={errors.basePrice}>
          <Input id="svc-price" type="number" inputMode="decimal" min={1} step="0.01" value={values.basePrice} onChange={input("basePrice")} placeholder="49" aria-invalid={!!errors.basePrice} className="h-11" />
        </FormField>
        <FormField id="svc-duration" label="Estimated duration" error={errors.estimatedDuration}>
          <Input id="svc-duration" value={values.estimatedDuration} onChange={input("estimatedDuration")} placeholder="1-2 hours" aria-invalid={!!errors.estimatedDuration} className="h-11" />
        </FormField>
        <FormField id="svc-area" label="Service area" error={errors.serviceArea}>
          <Input id="svc-area" value={values.serviceArea} onChange={input("serviceArea")} placeholder="Dhanmondi, Dhaka" aria-invalid={!!errors.serviceArea} className="h-11" />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="svc-tech-name" label="Technician name">
          <Input id="svc-tech-name" value={technician.name} readOnly className="h-11 bg-muted/60" />
        </FormField>
        <FormField id="svc-tech-email" label="Technician email">
          <Input id="svc-tech-email" value={technician.email} readOnly className="h-11 bg-muted/60" />
        </FormField>
      </div>

      <Button type="submit" size="lg" className="h-11 w-full text-base sm:w-auto" disabled={saving || uploading}>
        {(saving || uploading) && <Loader2 className="size-4 animate-spin" />}
        {uploading ? "Waiting for the image..." : saving ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}