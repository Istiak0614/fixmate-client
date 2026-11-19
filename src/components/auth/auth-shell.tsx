"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";

/**
 * Shared frame for Sign Up / Sign In.
 * Left (desktop only): a "repair ticket" that shows how every FixMate job moves forward.
 * Right: the form inside a glass card. One entrance animation for the whole page.
 */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-4 py-12 lg:grid-cols-2 lg:py-20">
      <RepairTicket />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto w-full max-w-md"
      >
        <GlassCard className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </GlassCard>
      </motion.div>
    </main>
  );
}

// Status colours follow the assignment: Requested blue, Accepted indigo, In Progress amber, Completed green.
const STEPS = [
  { label: "Requested", note: "You describe the problem", dot: "bg-blue-500" },
  { label: "Accepted", note: "A verified technician takes the job", dot: "bg-indigo-500" },
  { label: "In Progress", note: "Your device is being repaired", dot: "bg-amber-500" },
  { label: "Completed", note: "Pay only now, never before", dot: "bg-green-500" },
];

function RepairTicket() {
  return (
    <div className="hidden lg:block">
      <p className="max-w-sm text-2xl font-semibold leading-snug">
        Every repair is a ticket you can follow, from request to payment.
      </p>

      <div className="glass relative mt-8 max-w-sm rounded-2xl p-6">
        {/* the amber "repair tag" notch */}
        <span className="absolute -top-3 right-6 rounded-md bg-highlight px-3 py-1 text-xs font-bold text-highlight-foreground">
          Job #FM-1024
        </span>
        <ol className="space-y-5">
          {STEPS.map((step, index) => (
            <li key={step.label} className="relative flex gap-4">
              {index < STEPS.length - 1 && (
                <span aria-hidden className="absolute top-5 left-[7px] h-[calc(100%+0.25rem)] w-px bg-border" />
              )}
              <span className={`mt-1 size-4 shrink-0 rounded-full ring-4 ring-background ${step.dot}`} />
              <div>
                <p className="font-semibold">{step.label}</p>
                <p className="text-sm text-muted-foreground">{step.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}