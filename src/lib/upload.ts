/** Upload an image through our /api/upload route (which forwards it to ImgBB). Returns the image URL. */
export async function uploadImage(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Upload a JPG, PNG or WebP image");
  if (file.size > 3 * 1024 * 1024) throw new Error("Image must be 3 MB or smaller");

  const form = new FormData();
  form.append("image", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.url) throw new Error(data?.message ?? "Image upload failed. Please try again.");
  return data.url as string;
}