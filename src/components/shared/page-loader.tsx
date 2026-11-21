import { Cog } from "lucide-react";

/** Full-area loading state used by loading.tsx files: a turning gear (still for reduced-motion users). */
export function PageLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-1 flex-col items-center justify-center gap-3 py-32 text-muted-foreground">
      <Cog className="size-10 animate-[spin_3s_linear_infinite] text-primary" strokeWidth={1.6} aria-hidden />
      <p className="text-sm">{label}…</p>
    </div>
  );
}