import { requireRole } from "@/lib/auth";
import { PortalShell } from "@/components/layout/portal-shell";

export default async function CompanyLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireRole("office_manager");

  return (
    <PortalShell
      portal="office_manager"
      user={{ name: profile.full_name ?? user.email ?? "", email: user.email ?? "", avatarUrl: profile.avatar_url }}
      badge="Office menadžer"
    >
      {children}
    </PortalShell>
  );
}
