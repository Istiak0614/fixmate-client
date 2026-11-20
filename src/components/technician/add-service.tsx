"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { ServiceForm } from "@/components/technician/service-form";
import { api, ApiError } from "@/lib/api";

export function AddService({ technician }: { technician: { name: string; email: string } }) {
  const router = useRouter();

  async function handleSubmit(data: Record<string, string | number>) {
    try {
      await api("/services", { method: "POST", json: data });
      toast.success("Service submitted", { description: "It is waiting for admin approval and will appear publicly once approved." });
      router.push("/dashboard/technician/my-services");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save the service. Please try again.");
    }
  }

  return (
    <>
      <PageHeader title="Add a Service" description="New services are reviewed by an admin before customers can see them." />
      <div className="glass max-w-4xl rounded-2xl p-6 sm:p-8">
        <ServiceForm technician={technician} submitLabel="Submit for approval" onSubmit={handleSubmit} />
      </div>
    </>
  );
}