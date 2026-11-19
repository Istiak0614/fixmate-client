import Link from "next/link";
import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The ONE FixMate logo (assignment: same style and size on every page).
 * Used in the navbar, footer and dashboard sidebar.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="FixMate home" className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Wrench className="size-5" />
      </span>
      <span className="font-display text-xl font-bold tracking-tight">FixMate</span>
    </Link>
  );
}