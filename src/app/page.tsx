"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Health = { ok: boolean; db?: string; time?: string };

// TEMPORARY page — replaced by the real Home page in Client step 9.
// The request goes to OUR domain (/api/health) and Next.js forwards it to Express.
export default function Home() {
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(false);

  const checkServer = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      setHealth(await res.json());
    } catch {
      setHealth({ ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-4xl font-bold">🔧 FixMate</h1>
      <p className="text-muted-foreground">Smart Device &amp; Home Appliance Repair — coming soon</p>
      <Button onClick={checkServer} disabled={loading}>
        {loading ? "Checking..." : "Check server connection"}
      </Button>
      {health && (
        <pre className="rounded-lg border p-4 text-left text-sm">{JSON.stringify(health, null, 2)}</pre>
      )}
    </main>
  );
}