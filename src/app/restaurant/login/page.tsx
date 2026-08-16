import { AuthCard } from "@/components/auth/auth-card";
import { PortalLoginForm } from "@/components/auth/portal-login-form";

export default function RestaurantLoginPage() {
  return (
    <AuthCard>
      <PortalLoginForm
        scope="restaurant"
        title="Prijava za restorane"
        description="Prijavi se na svoj restoranski nalog"
      />
    </AuthCard>
  );
}
