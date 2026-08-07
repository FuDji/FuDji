import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ClipboardList,
  Download,
  Gift,
  LayoutDashboard,
  ListOrdered,
  Megaphone,
  ReceiptText,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
  UsersRound,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const EMPLOYEE_NAV: NavItem[] = [
  { href: "/app", label: "Danas", icon: LayoutDashboard },
  { href: "/app/menu", label: "Nedeljni meni", icon: CalendarDays },
  { href: "/app/orders", label: "Moje narudžbine", icon: ListOrdered },
  { href: "/app/actions", label: "Akcije", icon: Megaphone },
  { href: "/app/rewards", label: "Nagrade", icon: Gift },
];

export const COMPANY_NAV: NavItem[] = [
  { href: "/company", label: "Pregled", icon: LayoutDashboard },
  { href: "/company/employees", label: "Zaposleni", icon: UsersRound },
  { href: "/company/expenses", label: "Troškovi", icon: Wallet },
  { href: "/company/history", label: "Istorija", icon: ReceiptText },
  { href: "/company/settings", label: "Podešavanja", icon: Settings },
];

export const RESTAURANT_NAV: NavItem[] = [
  { href: "/restaurant", label: "Narudžbine", icon: ShoppingBag },
  { href: "/restaurant/menu", label: "Meni", icon: UtensilsCrossed },
  { href: "/restaurant/capacity", label: "Kapacitet", icon: ClipboardList },
  { href: "/restaurant/stats", label: "Statistika", icon: Sparkles },
];

export const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Pregled", icon: LayoutDashboard },
  { href: "/admin/companies", label: "Firme", icon: Store },
  { href: "/admin/restaurants", label: "Restorani", icon: UtensilsCrossed },
  { href: "/admin/schedule", label: "Nedeljni plan", icon: CalendarDays },
  { href: "/admin/orders", label: "Narudžbine", icon: ListOrdered },
  { href: "/admin/deliveries", label: "Dostave", icon: Truck },
  { href: "/admin/campaigns", label: "Kampanje", icon: Megaphone },
  { href: "/admin/rewards", label: "Nagrade", icon: Gift },
  { href: "/admin/export", label: "Export", icon: Download },
];

export type PortalKey = "employee" | "office_manager" | "restaurant_staff" | "admin";

/**
 * Keyed lookup so server-component layouts can pass a plain string prop to
 * the client-side shell instead of the nav array itself — icon components
 * (functions) can't cross the server/client boundary as props.
 */
export const NAV_BY_PORTAL: Record<PortalKey, NavItem[]> = {
  employee: EMPLOYEE_NAV,
  office_manager: COMPANY_NAV,
  restaurant_staff: RESTAURANT_NAV,
  admin: ADMIN_NAV,
};
