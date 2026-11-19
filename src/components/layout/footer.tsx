import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { FacebookLogo, LinkedInLogo, XLogo } from "@/components/shared/social-icons";
import { SERVICE_CATEGORIES, categoryHref } from "@/lib/constants";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

const SOCIAL_LINKS = [
  { href: "https://x.com", label: "FixMate on X", Icon: XLogo },
  { href: "https://facebook.com", label: "FixMate on Facebook", Icon: FacebookLogo },
  { href: "https://linkedin.com", label: "FixMate on LinkedIn", Icon: LinkedInLogo },
];

/** Public footer: logo + tagline, quick links, popular categories, contact, social, copyright. */
export function Footer() {
  return (
    <footer className="glass-strong mt-20 border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        {/* Brand */}
        <div>
          <Logo />
          <p className="mt-4 max-w-xs leading-relaxed text-muted-foreground">
            Verified repair technicians, a job you can track step by step, and payment only after the work is done.
          </p>
          <ul className="mt-6 flex gap-3">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterColumn title="Quick links">
          {QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-muted-foreground transition-colors hover:text-primary">
                {link.label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Popular categories">
          {SERVICE_CATEGORIES.slice(0, 5).map((category) => (
            <li key={category}>
              <Link href={categoryHref(category)} className="text-muted-foreground transition-colors hover:text-primary">
                {category} repair
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Contact">
          <li className="flex gap-3 text-muted-foreground">
            <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
            <a href="mailto:support@fixmate.com" className="hover:text-primary">
              support@fixmate.com
            </a>
          </li>
          <li className="flex gap-3 text-muted-foreground">
            <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
            <a href="tel:+8801700000000" className="hover:text-primary">
              +880 1700-000000
            </a>
          </li>
          <li className="flex gap-3 text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>House 12, Road 5, Dhanmondi, Dhaka 1205</span>
          </li>
        </FooterColumn>
      </div>

      <div className="border-t">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-sm text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} FixMate. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm">{children}</ul>
    </div>
  );
}