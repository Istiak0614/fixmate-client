"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info, LogIn, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

type Viewer = { role?: string | null } | null;

/**
 * Role-restricted Request Repair button (assignment rules):
 *   logged out          -> link to /sign-in, and back to this page after login
 *   technician / admin  -> disabled, with "Only customers can request a repair"
 *   customer            -> opens the request form (added in Client step 13)
 */
export function RequestRepair({ viewer }: { viewer: Viewer }) {
  const pathname = usePathname();

  if (!viewer) {
    return (
      <Button asChild size="lg" className="h-12 w-full text-base">
        <Link href={`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`}>
          <LogIn className="size-5" /> Sign in to request repair
        </Link>
      </Button>
    );
  }

  if (viewer.role !== "customer") {
    return (
      <div className="space-y-3">
        <Button size="lg" className="h-12 w-full text-base" disabled>
          <Wrench className="size-5" /> Request Repair
        </Button>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="size-4 shrink-0" /> Only customers can request a repair.
        </p>
      </div>
    );
  }

  return (
    <Button size="lg" className="h-12 w-full text-base">
      <Wrench className="size-5" /> Request Repair
    </Button>
  );
}