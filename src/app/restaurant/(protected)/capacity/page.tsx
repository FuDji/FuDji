import { getRestaurantContext } from "@/app/restaurant/data";
import { PageHeader } from "@/components/layout/page-header";
import { CapacityEditor } from "@/components/restaurant/capacity-editor";
import { toDateKey, addDays } from "@/lib/utils";

export default async function CapacityPage() {
  const { supabase, restaurant } = await getRestaurantContext();

  const days = Array.from({ length: 14 }, (_, i) => toDateKey(addDays(new Date(), i)));

  const [{ data: schedule }, { data: orders }] = await Promise.all([
    supabase
      .from("restaurant_schedule")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .in("date", days),
    supabase
      .from("orders")
      .select("order_date")
      .eq("restaurant_id", restaurant.id)
      .in("order_date", days)
      .neq("status", "rejected"),
  ]);

  const orderCounts: Record<string, number> = {};
  for (const o of orders ?? []) {
    orderCounts[o.order_date] = (orderCounts[o.order_date] ?? 0) + 1;
  }

  return (
    <div>
      <PageHeader
        title="Kapacitet"
        description="Definiši koji dan restoran radi i dnevni limit obroka — minimum nedelju dana unapred."
      />
      <CapacityEditor days={days} schedule={schedule ?? []} orderCounts={orderCounts} />
    </div>
  );
}
