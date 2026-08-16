import { requireRole } from "@/lib/auth";
import { PortalShell } from "@/components/layout/portal-shell";
import { ImpersonationBanner } from "@/components/layout/impersonation-banner";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireRole("admin");

  return (
    <>
      <ImpersonationBanner scope="admin" />
      <PortalShell
        portal="admin"
        user={{ name: profile.full_name ?? user.email ?? "", email: user.email ?? "", avatarUrl: profile.avatar_url }}
        badge="Admin"
      >
        {children}
      </PortalShell>
    </>
  );
}
