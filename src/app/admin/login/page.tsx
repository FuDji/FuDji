import { AuthCard } from "@/components/auth/auth-card";
import { PortalLoginForm } from "@/components/auth/portal-login-form";

export default function AdminLoginPage() {
  return (
    <AuthCard>
      <PortalLoginForm scope="admin" title="Admin prijava" description="Prijavi se na Prime Bite admin panel" />
    </AuthCard>
  );
}
