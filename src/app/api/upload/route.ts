/**
 * POST /api/upload  (Next.js route, NOT Express)
 * Uploads one image to ImgBB and returns its URL. The ImgBB key stays on the server
 * (IMGBB_API_KEY, never NEXT_PUBLIC_), so nobody can copy it from the browser.
 * Only signed-in users can upload, and only real images up to 3 MB.
 * (This route lives in Next, so the /api fallback rewrite to Express never sees it.)
 */
import { auth } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 3 * 1024 * 1024; // 3 MB (Vercel functions accept up to 4.5 MB per request)

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ message: "Please sign in to upload images" }, { status: 401 });

  const key = process.env.IMGBB_API_KEY;
  if (!key) return Response.json({ message: "Image upload is not configured" }, { status: 500 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("image");
  if (!(file instanceof File)) return Response.json({ message: "Choose an image to upload" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return Response.json({ message: "Upload a JPG, PNG or WebP image" }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ message: "Image must be 3 MB or smaller" }, { status: 400 });

  const body = new FormData();
  body.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body }).catch(() => null);
  const data = await res?.json().catch(() => null);

  const url: string | undefined = data?.data?.url;
  if (!res?.ok || !url) return Response.json({ message: "Image upload failed. Please try again." }, { status: 502 });

  return Response.json({ url });
}