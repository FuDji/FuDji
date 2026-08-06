import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkDeliveredButton } from "@/components/admin/mark-delivered-button";
import { todayKey } from "@/lib/utils";
import { Truck } from "lucide-react";

export default async function AdminDeliveriesPage() {
  const { supabase } = await requireRole("admin");
  const today = todayKey();
  const now = new Date();

  const [{ data: companies }, { data: deliveries }, { data: orders }] = await Promise.all([
    supabase.from("companies").select("*").eq("status", "active").order("name"),
    supabase.from("deliveries").select("*").eq("delivery_date", today),
    supabase.from("orders").select("company_id").eq("order_date", today).neq("status", "rejected"),
  ]);

  const deliveryByCompany = new Map((deliveries ?? []).map((d) => [d.company_id, d]));
  const orderCounts = new Map<string, number>();
  for (const o of orders ?? []) {
    orderCounts.set(o.company_id, (orderCounts.get(o.company_id) ?? 0) + 1);
  }

  const relevant = (companies ?? []).filter((c) => (orderCounts.get(c.id) ?? 0) > 0);

  return (
    <div>
      <PageHeader title="Dostave" description="Praćenje termina dostave i kašnjenja po firmi." />

      {relevant.length === 0 ? (
        <EmptyState icon={Truck} title="Nema narudžbina za danas — nema dostava za praćenje" />
      ) : (
        <div className="space-y-2">
          {relevant.map((c) => {
            const delivery = deliveryByCompany.get(c.id);
            const scheduledAt = delivery?.scheduled_at ?? `${today}T${c.delivery_time}`;
            const scheduled = new Date(scheduledAt);
            const toleranceMs = c.delivery_tolerance_minutes * 60 * 1000;
            const delivered = delivery?.status === "delivered";
            const isDelayed = !delivered && now.getTime() > scheduled.getTime() + toleranceMs;

            return (
              <Card key={c.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{c.name}</span>
                      {delivered && <Badge variant="success">Dostavljeno</Badge>}
                      {!delivered && isDelayed && <Badge variant="destructive">Kasni</Badge>}
                      {!delivered && !isDelayed && <Badge variant="warning">Zakazano</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Termin {c.delivery_time.slice(0, 5)} (±{c.delivery_tolerance_minutes} min) ·{" "}
                      {orderCounts.get(c.id) ?? 0} obroka
                    </div>
                  </div>
                  {!delivered && (
                    <MarkDeliveredButton companyId={c.id} date={today} scheduledAt={scheduledAt} />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
