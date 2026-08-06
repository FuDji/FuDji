import { requireRole } from "@/lib/auth";
import { PortalShell } from "@/components/layout/portal-shell";
import { EMPLOYEE_NAV } from "@/components/layout/portal-nav-items";

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireRole("employee");

  return (
    <PortalShell
      navItems={EMPLOYEE_NAV}
      user={{ name: profile.full_name ?? user.email ?? "", email: user.email ?? "" }}
    >
      {children}
    </PortalShell>
  );
}
