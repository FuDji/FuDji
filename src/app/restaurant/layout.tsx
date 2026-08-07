import { requireRole } from "@/lib/auth";
import { PortalShell } from "@/components/layout/portal-shell";

export default async function RestaurantLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireRole("restaurant_staff");

  return (
    <PortalShell
      portal="restaurant_staff"
      user={{ name: profile.full_name ?? user.email ?? "", email: user.email ?? "" }}
      badge="Portal za restorane"
    >
      {children}
    </PortalShell>
  );
}
