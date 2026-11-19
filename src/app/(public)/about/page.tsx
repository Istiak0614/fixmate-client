import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, CalendarCheck, ClipboardList, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { HowItWorks } from "@/components/home/how-it-works";
import { STATUS_STYLES } from "@/lib/status";
import type { BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "How It Works | FixMate",
  description: "How FixMate connects customers with verified repair technicians, step by step.",
};

const FOR_CUSTOMERS = [
  { Icon: ClipboardList, text: "Browse approved services and compare starting prices." },
  { Icon: CalendarCheck, text: "Request a repair with your address and a preferred date." },
  { Icon: ShieldCheck, text: "Pay by card only after the job is completed, and keep the receipt." },
];

const FOR_TECHNICIANS = [
  { Icon: Wrench, text: "List your services; an admin approves them before they go live." },
  { Icon: BadgeCheck, text: "Accept or reject requests and move each job forward." },
  { Icon: CalendarCheck, text: "Set the final amount when you finish, and get paid through FixMate." },
];

const STATUS_MEANINGS: { status: BookingStatus; text: string }[] = [
  { status: "requested", text: "The customer sent the request and is waiting for the technician." },
  { status: "accepted", text: "The technician accepted and will contact you about the visit or drop-off." },
  { status: "in-progress", text: "Work has started on your device." },
  { status: "completed", text: "The repair is done and the final amount is set. Payment unlocks now." },
  { status: "rejected", text: "The technician can't take this job. You can request another service." },
  { status: "cancelled", text: "The customer cancelled before the technician accepted." },
];

/** /about — How It Works / About (public page from the navbar and footer). */
export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6 lg:pt-24">
        <h1 className="text-4xl font-bold sm:text-5xl">Repairs you can follow from start to finish</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          FixMate connects people who need a phone, laptop or home appliance repaired with technicians our admins have
          verified. Every job has a clear status, and payment only happens after the work is done.
        </p>
      </section>

      <HowItWorks withHeading={false} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading title="Made for both sides of a repair" />
        <div className="grid gap-6 md:grid-cols-2">
          <AudienceCard Icon={UserRound} title="For customers" items={FOR_CUSTOMERS} />
          <AudienceCard Icon={Wrench} title="For technicians" items={FOR_TECHNICIANS} />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <SectionHeading title="What each job status means" subtitle="You will see these badges in your dashboard as your repair moves forward." />
        <GlassCard className="divide-y p-0">
          {STATUS_MEANINGS.map(({ status, text }) => (
            <div key={status} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:gap-6">
              <span className={cn("w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold sm:w-28 sm:text-center", STATUS_STYLES[status].className)}>
                {STATUS_STYLES[status].label}
              </span>
              <p className="text-muted-foreground">{text}</p>
            </div>
          ))}
        </GlassCard>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-3xl font-bold sm:text-4xl">Ready to get something fixed?</h2>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/services">Browse services</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/sign-up">Join as a technician</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

function AudienceCard({
  Icon,
  title,
  items,
}: {
  Icon: typeof UserRound;
  title: string;
  items: { Icon: typeof UserRound; text: string }[];
}) {
  return (
    <GlassCard>
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Icon className="size-5" />
        </span>
        <h3 className="text-2xl font-semibold">{title}</h3>
      </div>
      <ul className="mt-6 space-y-4">
        {items.map(({ Icon: ItemIcon, text }) => (
          <li key={text} className="flex gap-3">
            <ItemIcon className="mt-0.5 size-5 shrink-0 text-primary" />
            <span className="leading-relaxed">{text}</span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}