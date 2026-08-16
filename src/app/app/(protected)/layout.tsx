import { requireRole } from "@/lib/auth";
import { PortalShell } from "@/components/layout/portal-shell";
import { RatingDialog } from "@/components/app/rating-dialog";
import { getUnratedDeliveredOrder } from "@/app/app/data";

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user, profile } = await requireRole("employee");
  const unratedOrder = await getUnratedDeliveredOrder(supabase, user.id);

  return (
    <PortalShell
      portal="employee"
      user={{ name: profile.full_name ?? user.email ?? "", email: user.email ?? "", avatarUrl: profile.avatar_url }}
    >
      {unratedOrder && (
        <RatingDialog
          orderId={unratedOrder.id}
          mandatory
          restaurantName={unratedOrder.restaurant?.name}
        />
      )}
      {children}
    </PortalShell>
  );
}
