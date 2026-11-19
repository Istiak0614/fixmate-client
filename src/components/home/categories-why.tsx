import Link from "next/link";
import { BadgeCheck, CreditCard, ReceiptText, Route } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import { SERVICE_CATEGORIES, categoryHref } from "@/lib/constants";

const CATEGORY_NOTES: Record<string, string> = {
  Smartphone: "Screens, batteries, charging ports",
  "Laptop & PC": "Overheating, keyboards, upgrades",
  AC: "Gas refill, cleaning, cooling issues",
  Refrigerator: "Not cooling, compressor, leaks",
  TV: "Panels, boards, no picture or sound",
  "Washing Machine": "Drum, motor, drainage problems",
  Electrical: "Wiring, sockets, fans and lights",
};

const REASONS = [
  { Icon: BadgeCheck, title: "Verified technicians", text: "Every service is reviewed by our admins before customers can see it." },
  { Icon: CreditCard, title: "Pay after service", text: "Payment unlocks only when the job is completed. No deposits, no surprises." },
  { Icon: Route, title: "Track every step", text: "Requested, accepted, in progress, completed: you always know where your device is." },
  { Icon: ReceiptText, title: "Clear final price", text: "You see the final amount before paying, and get a receipt for every job." },
];

/** Home section 4: clickable categories (open /services already filtered) + why choose FixMate. */
export function CategoriesWhy() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading title="Popular repair categories" subtitle="Pick what needs fixing and see the technicians who repair it." />

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {SERVICE_CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category];
          return (
            <li key={category}>
              <Link
                href={categoryHref(category)}
                className="glass group flex h-full flex-col items-center rounded-2xl p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-primary/50 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-7" />
                </span>
                <span className="mt-3 font-semibold">{category}</span>
                <span className="mt-1 text-xs leading-snug text-muted-foreground">{CATEGORY_NOTES[category]}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-20">
        <SectionHeading title="Why people choose FixMate" subtitle="A repair service built around trust, so you never pay for work that isn't done." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map(({ Icon, title, text }) => (
            <div key={title} className="glass h-full rounded-2xl p-6">
              <Icon className="size-8 text-highlight" />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}