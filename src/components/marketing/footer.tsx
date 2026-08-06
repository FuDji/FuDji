import Link from "next/link";

import { Logo } from "@/components/brand/logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Logo />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Prime Bite. Naručivanje obroka za firme.
        </p>
        <div className="flex gap-5 text-sm text-muted-foreground">
          <Link href="/login" className="hover:text-foreground">
            Prijava
          </Link>
        </div>
      </div>
    </footer>
  );
}
