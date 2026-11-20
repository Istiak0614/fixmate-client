"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

/**
 * Reusable confirmation modal (assignment: confirm before cancel / reject / delete).
 * `onConfirm` may be async; the modal stays open with a spinner until it finishes.
 * Use it with a `trigger` button, OR control it yourself with `open` + `onOpenChange`
 * (e.g. to confirm a choice made in a dropdown).
 */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  destructive = false,
  onConfirm,
  open: controlledOpen,
  onOpenChange,
}: {
  trigger?: React.ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => Promise<void> | void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [innerOpen, setInnerOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const open = controlledOpen ?? innerOpen;
  const setOpen = (next: boolean) => (onOpenChange ? onOpenChange(next) : setInnerOpen(next));

  async function handleConfirm() {
    setBusy(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !busy && setOpen(next)}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className="bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Keep it</AlertDialogCancel>
          {/* a normal Button (not AlertDialogAction) so the modal doesn't close before the request ends */}
          <Button variant={destructive ? "destructive" : "default"} onClick={handleConfirm} disabled={busy}>
            {busy && <Loader2 className="size-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}