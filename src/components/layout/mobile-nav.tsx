"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, LayoutDashboard, Menu, Plus } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Kontrolna tabla", icon: LayoutDashboard },
  { href: "/apartments", label: "Apartmani", icon: Building2 },
];

export function MobileNav({ active }: { active: "dashboard" | "apartments" }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === `/${active}`;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                    isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Button asChild className="mt-4 w-full" onClick={() => setOpen(false)}>
            <Link href="/apartments/new">
              <Plus className="size-4" /> Novi apartman
            </Link>
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
