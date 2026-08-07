"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { UserMenu } from "@/components/layout/user-menu";
import { PortalMobileNav } from "@/components/layout/portal-mobile-nav";
import { cn } from "@/lib/utils";
import { NAV_BY_PORTAL, type PortalKey } from "@/components/layout/portal-nav-items";

const ROOTS = ["/app", "/company", "/restaurant", "/admin"];

export function PortalShell({
  portal,
  user,
  badge,
  children,
}: {
  portal: PortalKey;
  user: { name: string; email: string; avatarUrl?: string | null };
  badge?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navItems = NAV_BY_PORTAL[portal];

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-16 items-center justify-between px-6">
          <Logo />
        </div>
        {badge && (
          <div className="mx-3 mb-2 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            {badge}
          </div>
        )}
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const isRoot = ROOTS.includes(item.href);
            const isActive = isRoot ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-8">
          <PortalMobileNav portal={portal} />
          <div className="hidden md:block" />
          <UserMenu name={user.name} email={user.email} avatarUrl={user.avatarUrl} />
        </header>
        <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
