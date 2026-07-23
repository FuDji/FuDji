"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ApartmentNav } from "@/components/layout/apartment-nav";
import type { Apartment } from "@/types";

export function ApartmentMobileNav({ apartment }: { apartment: Apartment }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Link href="/apartments" className="text-muted-foreground">
                <ArrowLeft className="size-4" />
              </Link>
              {apartment.name}
            </SheetTitle>
          </SheetHeader>
          <ApartmentNav slug={apartment.slug} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <span className="text-sm font-medium">{apartment.name}</span>
    </div>
  );
}
