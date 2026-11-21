"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CircleCheck, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/category-icons";
import { formatDateTime } from "@/lib/format";
import { InvoiceButton } from "@/components/payment/invoice-button";

type VerifyResult = { paymentId: string; amount: number; transactionId: string; serviceTitle: string; paidAt: string };

/**
 * /payment/success?session_id=cs_test_...
 * Asks the server to verify the Stripe session. The server saves the payment ONCE, so reloading
 * this page (or the webhook arriving too) never creates a second payment.
 */
export function PaymentSuccess({ sessionId }: { sessionId: string | null }) {
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(sessionId ? null : "This page needs a payment session. Open it from Stripe after paying.");
  const started = useRef(false);

  useEffect(() => {
    if (!sessionId || started.current) return;
    started.current = true; // React dev mode runs effects twice; one request is enough
    api<VerifyResult>(`/payments/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then(setResult)
      .catch((err) => setError(err instanceof ApiError ? err.message : "We couldn't confirm the payment. Please check My Bookings."));
  }, [sessionId]);

  if (error) {
    return (
      <Shell>
        <TriangleAlert className="mx-auto size-14 text-amber-500" />
        <h1 className="mt-6 text-3xl font-bold">We couldn&apos;t confirm this payment</h1>
        <p className="mt-3 text-muted-foreground">{error}</p>
        <p className="mt-2 text-sm text-muted-foreground">If you were charged, the payment still appears in My Bookings within a minute.</p>
        <Actions />
      </Shell>
    );
  }

  if (!result) {
    return (
      <Shell>
        <Loader2 className="mx-auto size-12 animate-spin text-primary" />
        <h1 className="mt-6 text-2xl font-bold">Confirming your payment</h1>
        <p className="mt-2 text-muted-foreground">This only takes a moment.</p>
      </Shell>
    );
  }

  return (
    <Shell>
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
        <CircleCheck className="mx-auto size-16 text-green-500" />
      </motion.div>
      <h1 className="mt-6 text-3xl font-bold">Payment successful</h1>
      <p className="mt-3 text-muted-foreground">Thank you. Your payment for {result.serviceTitle} is confirmed.</p>

      <dl className="mx-auto mt-8 max-w-sm space-y-3 rounded-2xl border bg-background/40 p-5 text-left text-sm">
        <Row label="Amount paid" value={<span className="font-display text-xl font-bold">{formatPrice(result.amount)}</span>} />
        <Row label="Transaction ID" value={<span className="break-all">{result.transactionId}</span>} />
        <Row label="Paid on" value={formatDateTime(result.paidAt)} />
      </dl>
      <div className="mt-4 flex justify-center">
      <InvoiceButton paymentId={result.paymentId} variant="ghost" />
      </div>
      <Actions />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 items-center px-4 py-16">
      <div className="glass w-full rounded-3xl p-8 text-center sm:p-10" role="status" aria-live="polite">
        {children}
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function Actions() {
  return (
    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
      <Button asChild size="lg">
        <Link href="/dashboard/customer/bookings">Back to My Bookings</Link>
      </Button>
      <Button asChild size="lg" variant="outline">
        <Link href="/dashboard/customer/payments">Payment History</Link>
      </Button>
    </div>
  );
}