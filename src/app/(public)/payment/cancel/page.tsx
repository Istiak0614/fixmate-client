import type { Metadata } from "next";
import Link from "next/link";
import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Payment cancelled | FixMate" };

// Customers only (proxy.ts). Stripe sends the customer here when they leave Checkout without paying.
export default function PaymentCancelPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 items-center px-4 py-16">
      <div className="glass w-full rounded-3xl p-8 text-center sm:p-10">
        <CircleX className="mx-auto size-16 text-muted-foreground" />
        <h1 className="mt-6 text-3xl font-bold">Payment cancelled</h1>
        <p className="mt-3 text-muted-foreground">
          No money was taken. Your completed job is still waiting in My Bookings, so you can pay whenever you&apos;re ready.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/dashboard/customer/bookings">Try Again</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}