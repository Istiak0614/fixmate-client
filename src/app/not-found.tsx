import type { Metadata } from "next";
import { Logo } from "@/components/shared/logo";
import { NotFoundView } from "@/components/shared/not-found-view";

export const metadata: Metadata = { title: "Page not found | FixMate" };

// Any unknown URL (outside the public layout), e.g. /something-random
export default function NotFound() {
  return (
    <>
      <header className="glass-strong border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6">
          <Logo />
        </div>
      </header>
      <NotFoundView />
    </>
  );
}