import { requireRole } from "@/lib/auth";
import { PortalShell } from "@/components/layout/portal-shell";

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireRole("employee");

  return (
    <PortalShell
      portal="employee"
      user={{ name: profile.full_name ?? user.email ?? "", email: user.email ?? "" }}
    >
      {children}
    </PortalShell>
  );
}
