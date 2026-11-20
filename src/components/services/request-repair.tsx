"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info, LogIn, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RequestForm, type RequestFormUser } from "@/components/services/request-form";

type Viewer = (RequestFormUser & { role?: string | null }) | null;

/**
 * Role-restricted Request Repair button (assignment rules):
 *   logged out          -> link to /sign-in, and back to this page after login
 *   technician / admin  -> disabled, with "Only customers can request a repair"
 *   customer            -> opens the request form in a modal
 */
export function RequestRepair({ viewer, service }: { viewer: Viewer; service: { _id: string; title: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="h-12 w-full text-base">
          <Wrench className="size-5" /> Request Repair
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[90dvh] overflow-y-auto bg-background sm:max-w-xl"
        // start on the first field the customer actually fills in (Name/Email are read-only)
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          document.getElementById("req-phone")?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Request a repair</DialogTitle>
          <DialogDescription>{service.title}</DialogDescription>
        </DialogHeader>
        <RequestForm serviceId={service._id} user={viewer} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}