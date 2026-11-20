"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "./api";

/**
 * Load data from Express in a dashboard page:
 *   const { data, loading, error, reload } = useApi<Booking[]>("/bookings/my");
 * reload() fetches again (e.g. after cancelling a booking).
 */
export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    setError(null);
    try {
      setData(await api<T>(path));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}