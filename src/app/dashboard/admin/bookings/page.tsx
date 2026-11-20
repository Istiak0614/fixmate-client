import type { Metadata } from "next";
import { AllBookings } from "@/components/admin/all-bookings";

export const metadata: Metadata = { title: "All Bookings | FixMate" };

export default function AllBookingsPage() {
  return <AllBookings />;
}