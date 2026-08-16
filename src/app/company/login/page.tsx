import { AuthCard } from "@/components/auth/auth-card";
import { PortalLoginForm } from "@/components/auth/portal-login-form";

export default function CompanyLoginPage() {
  return (
    <AuthCard>
      <PortalLoginForm
        scope="company"
        title="Prijava za firme"
        description="Prijavi se kao office menadžer svoje firme"
      />
    </AuthCard>
  );
}
