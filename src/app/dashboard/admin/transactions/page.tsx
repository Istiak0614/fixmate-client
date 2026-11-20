import type { Metadata } from "next";
import { Transactions } from "@/components/admin/transactions";

export const metadata: Metadata = { title: "Transactions | FixMate" };

export default function TransactionsPage() {
  return <Transactions />;
}