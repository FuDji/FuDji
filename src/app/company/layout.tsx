import { requireRole } from "@/lib/auth";
import { PortalShell } from "@/components/layout/portal-shell";
import { COMPANY_NAV } from "@/components/layout/portal-nav-items";

export default async function CompanyLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireRole("office_manager");

  return (
    <PortalShell
      navItems={COMPANY_NAV}
      user={{ name: profile.full_name ?? user.email ?? "", email: user.email ?? "" }}
      badge="Office menadžer"
    >
      {children}
    </PortalShell>
  );
}
