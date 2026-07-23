import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { UserMenu } from "@/components/layout/user-menu";
import { ApartmentNav } from "@/components/layout/apartment-nav";
import { ApartmentMobileNav } from "@/components/layout/apartment-mobile-nav";
import { initials } from "@/lib/utils";
import type { Apartment } from "@/types";

export function ApartmentShell({
  apartment,
  user,
  children,
}: {
  apartment: Apartment;
  user: { name: string; email: string; avatarUrl?: string | null };
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <Link
            href="/apartments"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex min-w-0 items-center gap-2">
            <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary text-xs font-medium">
              {apartment.logo_url ? (
                <Image src={apartment.logo_url} alt={apartment.name} fill className="object-cover" unoptimized />
              ) : (
                initials(apartment.name)
              )}
            </div>
            <span className="truncate text-sm font-medium">{apartment.name}</span>
          </div>
        </div>
        <ApartmentNav slug={apartment.slug} />
        <div className="border-t border-sidebar-border p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          >
            <Logo className="scale-90" />
          </Link>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-8">
          <ApartmentMobileNav apartment={apartment} />
          <div className="hidden md:block" />
          <UserMenu name={user.name} email={user.email} avatarUrl={user.avatarUrl} />
        </header>
        <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
