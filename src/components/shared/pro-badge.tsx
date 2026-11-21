import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/** "Verified Pro" label for technicians on the Pro Technician Plan (optional feature). */
export function ProBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-highlight px-2 py-0.5 text-xs font-bold whitespace-nowrap text-highlight-foreground", className)}>
      <BadgeCheck className="size-3.5" aria-hidden /> Verified Pro
    </span>
  );
}