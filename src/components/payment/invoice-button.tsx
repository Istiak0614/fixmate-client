"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { downloadInvoice } from "@/lib/invoice";

/** Downloads the PDF invoice for one payment (data fetched fresh from the server). */
export function InvoiceButton({ paymentId, size = "sm", variant = "outline" }: { paymentId: string; size?: "sm" | "lg"; variant?: "outline" | "ghost" }) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    try {
      await downloadInvoice(paymentId);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not create the invoice. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button type="button" size={size} variant={variant} onClick={handleClick} disabled={busy} aria-label="Download PDF invoice">
      {busy ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
      Invoice
    </Button>
  );
}