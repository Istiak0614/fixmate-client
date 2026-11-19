"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, CreditCard, Laptop } from "lucide-react";
import { STATUS_STYLES } from "@/lib/status";
import type { BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS: { status: BookingStatus; note: string }[] = [
  { status: "requested", note: "Request sent with photos of the problem" },
  { status: "accepted", note: "Rafi accepted and confirmed Saturday, 10 AM" },
  { status: "in-progress", note: "Battery being replaced at the shop" },
  { status: "completed", note: "Tested and ready. Final amount: $45" },
];

/**
 * Hero illustration: a FixMate job ticket that moves through the real status pipeline,
 * then shows the "pay after completion" step. One orchestrated animation for the whole page.
 * With reduced motion it simply shows the finished ticket.
 */
export function JobTicketDemo() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(reduceMotion ? STEPS.length : 0); // STEPS.length = the "pay" state

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => setStep((s) => (s >= STEPS.length + 1 ? 0 : s + 1)), 1700);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  const current = STEPS[Math.min(step, STEPS.length - 1)];
  const showPay = step >= STEPS.length;

  return (
    <div
      role="img"
      aria-label="Example FixMate job moving from Requested to Accepted, In Progress and Completed, then paid"
      className="glass relative mx-auto w-full max-w-md rounded-3xl p-6 sm:p-7"
    >
      <span className="absolute -top-3 right-6 rounded-md bg-highlight px-3 py-1 text-xs font-bold text-highlight-foreground shadow">
        Job #FM-2048
      </span>

      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
          <Laptop className="size-6" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-lg font-semibold leading-tight">MacBook Air battery replacement</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            Rafi Ahmed <BadgeCheck className="size-4 text-primary" /> Verified technician
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Status</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={current.status}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={cn("rounded-full px-3 py-1 text-xs font-bold", STATUS_STYLES[current.status].className)}
          >
            {STATUS_STYLES[current.status].label}
          </motion.span>
        </AnimatePresence>
      </div>

      <ol className="mt-4 space-y-4">
        {STEPS.map((s, index) => {
          const done = index <= step;
          return (
            <li key={s.status} className="flex gap-3">
              <span
                className={cn(
                  "mt-1.5 size-3 shrink-0 rounded-full transition-colors duration-500",
                  done ? STATUS_STYLES[s.status].dot : "bg-border"
                )}
              />
              <div className={cn("transition-opacity duration-500", done ? "opacity-100" : "opacity-40")}>
                <p className="text-sm font-semibold">{STATUS_STYLES[s.status].label}</p>
                <p className="text-sm text-muted-foreground">{s.note}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div
        className={cn(
          "mt-5 flex items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-500",
          showPay ? "border-green-500/40 bg-green-500/10" : "border-dashed opacity-50"
        )}
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <CreditCard className="size-4" />
          {showPay ? "Paid after the work was done" : "Payment unlocks after completion"}
        </span>
        <span className="font-display font-bold">$45</span>
      </div>
    </div>
  );
}