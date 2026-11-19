"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";
import { SectionHeading } from "@/components/shared/section-heading";

type Health = { ok: boolean; db?: string; time?: string };

// TEMPORARY page — a theme preview + server check. Replaced by the real Home page in Client step 9.
export default function Home() {
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(false);

  const checkServer = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      const data: Health = await res.json();
      setHealth(data);
      if (data.ok) toast.success("Server and database are connected");
      else toast.error("Server is up, but the database is not connected");
    } catch {
      setHealth({ ok: false });
      toast.error("Could not reach the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16">
      <SectionHeading
        title="Broken device? Get it fixed by verified technicians"
        subtitle="Theme preview: switch light/dark with the button above and check that every text stays easy to read."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <GlassCard interactive>
          <h3 className="text-xl font-semibold">Glass card</h3>
          <p className="mt-2 text-muted-foreground">Frosted surface over the blueprint grid. Hover me.</p>
        </GlassCard>
        <GlassCard interactive>
          <h3 className="text-xl font-semibold">Brand colours</h3>
          <div className="mt-3 flex gap-2">
            <span className="rounded-md bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">Teal</span>
            <span className="rounded-md bg-highlight px-3 py-1 text-sm font-semibold text-highlight-foreground">Amber</span>
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="text-xl font-semibold">Server check</h3>
          <Button className="mt-3" onClick={checkServer} disabled={loading}>
            {loading ? "Checking..." : "Check server connection"}
          </Button>
          {health && <pre className="mt-3 overflow-x-auto text-xs">{JSON.stringify(health, null, 2)}</pre>}
        </GlassCard>
      </div>
    </main>
  );
}