"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpenText,
  DoorOpen,
  QrCode,
  Package,
  Wrench,
  BarChart3,
  Printer,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";

export const APARTMENT_NAV_ITEMS = [
  { segment: "overview", label: "Pregled", icon: LayoutDashboard },
  { segment: "guide", label: "Vodič za goste", icon: BookOpenText },
  { segment: "rooms", label: "Vodiči po sobama", icon: DoorOpen },
  { segment: "qr-codes", label: "QR kodovi", icon: QrCode },
  { segment: "inventory", label: "Inventar", icon: Package },
  { segment: "maintenance", label: "Održavanje", icon: Wrench },
  { segment: "analytics", label: "Analitika", icon: BarChart3 },
  { segment: "print-center", label: "Print centar", icon: Printer },
  { segment: "settings", label: "Podešavanja", icon: Settings },
] as const;

export function ApartmentNav({ slug, onNavigate }: { slug: string; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
      {APARTMENT_NAV_ITEMS.map((item) => {
        const href = `/apartments/${slug}/${item.segment}`;
        const isActive = pathname?.startsWith(href);
        return (
          <Link
            key={item.segment}
            href={href}
            onClick={onNavigate}
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
  );
}
