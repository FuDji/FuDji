import { requireRole } from "@/lib/auth";
import { PortalShell } from "@/components/layout/portal-shell";
import { ImpersonationBanner } from "@/components/layout/impersonation-banner";

export default async function RestaurantLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireRole("restaurant_staff");

  return (
    <>
      <ImpersonationBanner scope="restaurant" />
      <PortalShell
        portal="restaurant_staff"
        user={{ name: profile.full_name ?? user.email ?? "", email: user.email ?? "", avatarUrl: profile.avatar_url }}
        badge="Portal za restorane"
      >
        {children}
      </PortalShell>
    </>
  );
}
