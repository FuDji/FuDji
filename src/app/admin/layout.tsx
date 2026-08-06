import { requireRole } from "@/lib/auth";
import { PortalShell } from "@/components/layout/portal-shell";
import { ADMIN_NAV } from "@/components/layout/portal-nav-items";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireRole("admin");

  return (
    <PortalShell
      navItems={ADMIN_NAV}
      user={{ name: profile.full_name ?? user.email ?? "", email: user.email ?? "" }}
      badge="Admin"
    >
      {children}
    </PortalShell>
  );
}
