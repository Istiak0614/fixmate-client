"use client";

import { useId, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload";
import { cn } from "@/lib/utils";

/**
 * File input that uploads to ImgBB as soon as a file is chosen and shows a preview.
 * The parent only receives the final https://i.ibb.co/... URL (assignment: a file input, not a URL field).
 */
export function ImageUpload({
  value,
  onChange,
  onUploadingChange,
  invalid,
  label = "Service image",
  round = false,
}: {
  value: string;
  onChange: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
  invalid?: boolean;
  label?: string;
  round?: boolean;
}) {
  const id = useId();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow choosing the same file again
    if (!file) return;

    setPreview(URL.createObjectURL(file)); // instant local preview
    setUploading(true);
    onUploadingChange?.(true);
    try {
      onChange(await uploadImage(file));
      toast.success("Image uploaded");
    } catch (err) {
      setPreview(null);
      toast.error(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  const shown = preview ?? value;

  return (
    <label
      htmlFor={id}
      className={cn(
        "group relative flex cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed bg-muted/40 transition-colors hover:border-primary/60",
        round ? "size-32 rounded-full" : "aspect-[16/9] w-full rounded-2xl",
        invalid ? "border-destructive" : "border-border",
        "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- local blob previews can't use next/image */}
      {shown && <img src={shown} alt="" className="absolute inset-0 size-full object-cover" />}
      <span
        className={cn(
          "relative z-10 flex flex-col items-center gap-2 rounded-xl px-4 py-3 text-center text-sm font-medium",
          shown ? "bg-background/85 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100" : "text-muted-foreground",
          uploading && "opacity-100"
        )}
      >
        {uploading ? <Loader2 className="size-6 animate-spin text-primary" /> : <ImagePlus className="size-6 text-primary" />}
        {uploading ? "Uploading..." : shown ? "Change image" : round ? "Upload photo" : "Upload an image (JPG, PNG or WebP, max 3 MB)"}
      </span>
      <input id={id} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} disabled={uploading} className="sr-only" aria-label={label} />
    </label>
  );
}