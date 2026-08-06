import { requireRole } from "@/lib/auth";
import { PortalShell } from "@/components/layout/portal-shell";
import { RESTAURANT_NAV } from "@/components/layout/portal-nav-items";

export default async function RestaurantLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireRole("restaurant_staff");

  return (
    <PortalShell
      navItems={RESTAURANT_NAV}
      user={{ name: profile.full_name ?? user.email ?? "", email: user.email ?? "" }}
      badge="Portal za restorane"
    >
      {children}
    </PortalShell>
  );
}
