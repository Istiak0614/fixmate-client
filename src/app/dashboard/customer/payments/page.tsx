import type { Metadata } from "next";
import { PaymentHistory } from "@/components/customer/payment-history";

export const metadata: Metadata = { title: "Payment History | FixMate" };

export default function PaymentHistoryPage() {
  return <PaymentHistory />;
}