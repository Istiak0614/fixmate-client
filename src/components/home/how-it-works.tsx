import { CreditCard, Search, Send, Wrench } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

// The real 4-step order of every FixMate job (so numbered steps make sense here)
const STEPS = [
  { Icon: Search, title: "Find a service", text: "Search by device or problem, compare prices and read about each technician." },
  { Icon: Send, title: "Send a request", text: "Describe the issue, add your address and pick a date that suits you." },
  { Icon: Wrench, title: "Technician fixes it", text: "Your technician accepts, starts work, and you see every status change live." },
  { Icon: CreditCard, title: "Pay after completion", text: "Pay securely by card only when the job is marked completed, never before." },
];

/** Home section 3 (also used on /about): Find → Request → Fix → Pay. */
export function HowItWorks({ withHeading = true }: { withHeading?: boolean }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {withHeading && (
        <SectionHeading
          title="How FixMate works"
          subtitle="Four simple steps from a broken device to a finished repair, with no payment up front."
        />
      )}

      <ol className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* the track that connects the steps on large screens */}
        <span aria-hidden className="absolute top-8 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 lg:block" />
        {STEPS.map(({ Icon, title, text }, index) => (
          <li key={title} className="glass relative flex h-full flex-col rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <span className="relative grid size-16 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Icon className="size-7" />
                <span className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-highlight text-xs font-bold text-highlight-foreground">
                  {index + 1}
                </span>
              </span>
            </div>
            <h3 className="mt-5 text-xl font-semibold">{title}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}