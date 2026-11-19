import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { BackgroundDecor } from "@/components/shared/background-decor";

// Display font: headings & logo — a grotesque with a hand-built, workshop character.
const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display-family",
  display: "swap",
});

// Body font: clean and very readable at small sizes (tables, forms).
const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FixMate — Smart Device & Home Appliance Repair",
  description:
    "Book verified repair technicians, track every job step by step, and pay only after the work is done.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: next-themes adds class="dark" before React loads (expected).
    <html lang="en" suppressHydrationWarning className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <Providers>
          <BackgroundDecor />
          {children}
        </Providers>
      </body>
    </html>
  );
}