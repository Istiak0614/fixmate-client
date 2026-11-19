"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BadgeCheck, CreditCard, Route, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobTicketDemo } from "@/components/home/job-ticket-demo";

const PROMISES = [
  { Icon: BadgeCheck, text: "Admin-verified technicians" },
  { Icon: Route, text: "Track every step of the job" },
  { Icon: CreditCard, text: "Pay only after it's fixed" },
];

/** Home hero: headline, search box that opens /services?search=..., CTA, and the live job ticket. */
export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const search = query.trim();
    router.push(search ? `/services?search=${encodeURIComponent(search)}` : "/services");
  }

  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-20 lg:pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
        <h1 className="max-w-xl text-4xl leading-[1.08] font-bold sm:text-5xl lg:text-6xl">
          Broken device? Get it fixed by verified technicians.
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
          Book a repair for your phone, laptop, AC or fridge in minutes, follow the job step by step, and pay only
          when the work is done.
        </p>

        <form onSubmit={handleSearch} role="search" className="mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
          <label htmlFor="hero-search" className="sr-only">
            Search repair services
          </label>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 z-10 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="hero-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try 'iPhone screen' or 'AC'"
              className="glass h-12 rounded-xl pl-11 text-base"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 rounded-xl px-6 text-base">
            Find a technician
          </Button>
        </form>

        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
          {PROMISES.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-2">
              <Icon className="size-4 text-primary" /> {text}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-muted-foreground">
          Or{" "}
          <Link href="/services" className="font-semibold text-primary hover:underline">
            browse all services
          </Link>
        </p>
      </motion.div>

      <JobTicketDemo />
    </section>
  );
}