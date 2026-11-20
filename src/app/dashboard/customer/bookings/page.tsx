import type { Metadata } from "next";
import { MyBookings } from "@/components/customer/my-bookings";

export const metadata: Metadata = { title: "My Bookings | FixMate" };

export default function MyBookingsPage() {
  return <MyBookings />;
}