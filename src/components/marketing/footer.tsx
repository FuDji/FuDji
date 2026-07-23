import Link from "next/link";

import { Logo } from "@/components/brand/logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Logo />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} FuDji. The guest experience layer for independent hosts.
        </p>
        <div className="flex gap-5 text-sm text-muted-foreground">
          <Link href="/login" className="hover:text-foreground">
            Sign in
          </Link>
          <Link href="/register" className="hover:text-foreground">
            Get started
          </Link>
        </div>
      </div>
    </footer>
  );
}
