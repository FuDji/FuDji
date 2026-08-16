import { AuthCard } from "@/components/auth/auth-card";
import { PortalLoginForm } from "@/components/auth/portal-login-form";

export default function EmployeeLoginPage() {
  return (
    <AuthCard>
      <PortalLoginForm scope="app" title="Dobrodošli nazad" description="Prijavi se na svoj Prime Bite nalog" />
    </AuthCard>
  );
}
