"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/auth/form-field";
import { GlassCard } from "@/components/shared/glass-card";
import { ImageUpload } from "@/components/shared/image-upload";
import { api, ApiError } from "@/lib/api";
import { ROLE_LABELS, type Role } from "@/lib/roles";
import { PHONE_REGEX } from "@/lib/validation";

export type ProfileValues = { name: string; email: string; role: Role; image: string; phone: string; area: string; bio: string };
type Errors = Partial<Record<"name" | "phone" | "area" | "bio", string>>;

// Same limits as validateProfileInput on the server
function validate(v: ProfileValues): Errors {
  const errors: Errors = {};
  const name = v.name.trim();
  if (name.length < 2 || name.length > 50) errors.name = "Name must be 2 to 50 characters";
  if (v.phone.trim() && !PHONE_REGEX.test(v.phone.trim())) errors.phone = "Enter a valid phone number, e.g. 01712345678";
  if (v.area.trim().length > 60) errors.area = "Area is too long (max 60 characters)";
  if (v.bio.trim().length > 300) errors.bio = "Bio is too long (max 300 characters)";
  return errors;
}

export function ProfileForm({ initial }: { initial: ProfileValues }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [newImage, setNewImage] = useState(""); // only sent when a new photo was uploaded
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const set = (key: keyof ProfileValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const changed =
    newImage !== "" ||
    (["name", "phone", "area", "bio"] as const).some((k) => values[k].trim() !== initial[k].trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      await api("/users/profile", {
        method: "PATCH",
        json: {
          name: values.name.trim(),
          phone: values.phone.trim(),
          area: values.area.trim(),
          bio: values.bio.trim(),
          ...(newImage && { image: newImage }),
        },
      });
      toast.success("Profile updated");
      if (newImage) setValues((v) => ({ ...v, image: newImage })); // the saved photo becomes the current one
      setNewImage("");
      // Server components (navbar, dashboard top bar) read the user from the DB again
      router.refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update your profile");
    } finally {
      setSaving(false);
    }
  }

  const photo = newImage || values.image;

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6 lg:grid-cols-[18rem_1fr]">
      {/* Left: photo + read-only account info */}
      <GlassCard className="flex flex-col items-center gap-4 p-6 text-center">
        <ImageUpload label="Profile photo" round value={photo} onChange={setNewImage} onUploadingChange={setUploading} />
        <p className="text-xs text-muted-foreground">JPG, PNG or WebP, up to 3 MB. Click the photo to change it.</p>

        <div className="w-full space-y-3 border-t pt-4 text-left text-sm">
          <div>
            <p className="flex items-center gap-1.5 text-muted-foreground"><Lock className="size-3.5" aria-hidden /> Email</p>
            <p className="truncate font-medium" title={values.email}>{values.email}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-muted-foreground"><Lock className="size-3.5" aria-hidden /> Role</p>
            <p className="font-medium">{ROLE_LABELS[values.role]}</p>
          </div>
          <p className="text-xs text-muted-foreground">Email and role can&apos;t be changed here. An admin manages roles.</p>
        </div>
      </GlassCard>

      {/* Right: editable details */}
      <GlassCard className="space-y-5 p-6">
        <FormField id="name" label="Full name" error={errors.name}>
          <Input id="name" value={values.name} onChange={set("name")} autoComplete="name" aria-invalid={!!errors.name} maxLength={50} />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="phone" label="Phone (optional)" error={errors.phone}>
            <Input id="phone" type="tel" value={values.phone} onChange={set("phone")} autoComplete="tel" placeholder="01712345678" aria-invalid={!!errors.phone} />
          </FormField>
          <FormField id="area" label="Area (optional)" error={errors.area}>
            <Input id="area" value={values.area} onChange={set("area")} placeholder="e.g. Dhanmondi, Dhaka" aria-invalid={!!errors.area} maxLength={60} />
          </FormField>
        </div>

        <FormField id="bio" label="Bio (optional)" error={errors.bio}>
          <Textarea
            id="bio"
            rows={5}
            value={values.bio}
            onChange={set("bio")}
            maxLength={300}
            aria-invalid={!!errors.bio}
            placeholder={values.role === "technician" ? "Your experience and the devices you fix best. Customers see this on your services." : "A line about you (optional)."}
          />
          <p className="text-right text-xs text-muted-foreground">{values.bio.length}/300</p>
        </FormField>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t pt-5">
          {uploading && <span className="text-sm text-muted-foreground">Waiting for the photo upload…</span>}
          <Button type="submit" disabled={saving || uploading || !changed}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            Save changes
          </Button>
        </div>
      </GlassCard>
    </form>
  );
}