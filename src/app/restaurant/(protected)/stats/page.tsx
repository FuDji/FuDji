import { getRestaurantContext } from "@/app/restaurant/data";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { formatMoney, toDateKey, addDays } from "@/lib/utils";
import { ShoppingBag, TrendingUp, Wallet } from "lucide-react";
import type { Order, OrderItem } from "@/types";

type OrderRow = Order & { order_items: OrderItem[] };

export default async function RestaurantStatsPage() {
  const { supabase, restaurant } = await getRestaurantContext();
  const since = toDateKey(addDays(new Date(), -30));

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("restaurant_id", restaurant.id)
    .gte("order_date", since)
    .neq("status", "rejected")
    .returns<OrderRow[]>();

  const totalOrders = orders?.length ?? 0;
  const revenue = (orders ?? []).reduce((s, o) => s + o.subtotal, 0);
  const commission = revenue * (restaurant.commission_percent / 100);

  const itemCounts = new Map<string, number>();
  for (const o of orders ?? []) {
    for (const item of o.order_items) {
      itemCounts.set(item.name_snapshot, (itemCounts.get(item.name_snapshot) ?? 0) + item.quantity);
    }
  }
  const topItems = [...itemCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div>
      <PageHeader title="Statistika" description="Poslednjih 30 dana." />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Broj narudžbina" value={totalOrders} icon={ShoppingBag} />
        <StatCard label="Prihod" value={formatMoney(revenue)} icon={Wallet} tone="success" />
        <StatCard label="Provizija platforme" value={formatMoney(commission)} icon={TrendingUp} tone="warning" />
      </div>

      <h2 className="mb-3 text-lg font-semibold">Najprodavanija jela</h2>
      {topItems.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nema podataka.</p>
      ) : (
        <div className="space-y-2">
          {topItems.map(([name, count]) => (
            <Card key={name}>
              <CardContent className="flex items-center justify-between py-3">
                <span className="font-medium">{name}</span>
                <span className="text-sm text-muted-foreground">{count}×</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
