import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RestaurantDialog } from "@/components/admin/restaurant-dialog";
import { InviteRestaurantStaffDialog } from "@/components/admin/invite-restaurant-staff-dialog";
import { StatusToggle } from "@/components/admin/status-toggle";
import { toggleRestaurantStatus } from "@/app/admin/actions";
import { UtensilsCrossed } from "lucide-react";

export default async function AdminRestaurantsPage() {
  const { supabase } = await requireRole("admin");

  const { data: restaurants } = await supabase.from("restaurants").select("*").order("name");

  return (
    <div>
      <PageHeader title="Restorani" description="Upravljaj restoranima i provizijom." actions={<RestaurantDialog />} />

      {!restaurants || restaurants.length === 0 ? (
        <EmptyState icon={UtensilsCrossed} title="Nema dodatih restorana" />
      ) : (
        <div className="space-y-2">
          {restaurants.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{r.name}</span>
                    <Badge variant={r.status === "active" ? "success" : "secondary"}>
                      {r.status === "active" ? "Aktivan" : "Neaktivan"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {r.address || "Bez adrese"} · provizija {r.commission_percent}%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusToggle active={r.status === "active"} onToggle={toggleRestaurantStatus.bind(null, r.id)} />
                  <InviteRestaurantStaffDialog restaurantId={r.id} />
                  <RestaurantDialog restaurant={r} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
