import type { Metadata } from "next";
import { PaymentSuccess } from "@/components/payment/payment-success";

export const metadata: Metadata = { title: "Payment successful | FixMate" };

// Customers only (proxy.ts). Stripe sends the customer here with ?session_id=cs_test_...
export default async function PaymentSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  return <PaymentSuccess sessionId={session_id?.startsWith("cs_") ? session_id : null} />;
}