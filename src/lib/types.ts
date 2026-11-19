/**
 * Shapes of the data the Express API sends to the client (JSON: ids and dates are strings).
 * They mirror the server's 4 collections.
 */
import type { ServiceCategory, ServiceMode } from "./constants";

export type BookingStatus = "requested" | "accepted" | "rejected" | "in-progress" | "completed" | "cancelled";

export type Service = {
  _id: string;
  title: string;
  category: ServiceCategory;
  description?: string; // not included in list responses
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  createdAt: string;
};

export type ServiceDetails = Service & {
  description: string;
  technician: { name: string; image: string | null; area: string; bio: string; plan: "free" | "pro" };
};

export type ServiceListResponse = {
  services: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type Booking = {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: ServiceCategory;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: BookingStatus;
  finalAmount: number;
  paymentStatus: "unpaid" | "paid";
  createdAt: string;
  statusHistory: { status: BookingStatus | "paid"; changedAt: string }[];
  rating?: number;
  review?: string;
};

export type Payment = {
  _id: string;
  type: "job" | "subscription";
  bookingId?: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: "usd";
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string;
};