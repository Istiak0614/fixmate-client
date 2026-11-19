/**
 * Fetch helper for calling the Express API from client components.
 *
 *   const services = await api<Service[]>("/services/mine");
 *   await api("/services", { method: "POST", json: formData });
 *
 * - Calls /api/... on our own domain (the rewrite forwards it to Express, cookies included).
 * - If Express says 401 but the BetterAuth session is still valid (e.g. the 7-day JWT expired
 *   while the session was refreshed), it gets a new JWT cookie and retries ONCE.
 * - Throws ApiError with the server's message, so pages can show it in a toast.
 */
import { authClient } from "./auth-client";
import { createJwtCookie } from "./jwt";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

type ApiOptions = Omit<RequestInit, "body"> & { json?: unknown };

export async function api<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const { json, headers, ...rest } = options;

  const send = () =>
    fetch(`/api${path}`, {
      ...rest,
      headers: { ...(json !== undefined && { "Content-Type": "application/json" }), ...headers },
      body: json !== undefined ? JSON.stringify(json) : undefined,
      cache: "no-store",
    });

  let res = await send();

  if (res.status === 401) {
    const { data } = await authClient.getSession();
    if (data?.user?.email && (await createJwtCookie(data.user.email))) {
      res = await send(); // retry once with the fresh JWT
    }
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(body?.message ?? "Something went wrong. Please try again.", res.status);
  }
  return body as T;
}