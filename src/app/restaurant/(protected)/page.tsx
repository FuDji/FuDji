import Link from "next/link";

import { getRestaurantContext } from "@/app/restaurant/data";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { OrderCard } from "@/components/restaurant/order-card";
import { cn, toDateKey, addDays, formatDateSr, todayKey } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import type { Order, OrderItem } from "@/types";

type IncomingOrder = Order & {
  order_items: OrderItem[];
  company: { name: string } | null;
};

export default async function IncomingOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ day?: string }>;
}) {
  const { supabase, restaurant } = await getRestaurantContext();
  const params = await searchParams;

  const today = todayKey();
  const tomorrow = toDateKey(addDays(new Date(), 1));
  const selectedDay = params.day === "tomorrow" ? tomorrow : today;

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*), company:companies(name)")
    .eq("restaurant_id", restaurant.id)
    .eq("order_date", selectedDay)
    .order("created_at", { ascending: true })
    .returns<IncomingOrder[]>();

  const byCompany = new Map<string, { name: string; orders: IncomingOrder[] }>();
  for (const o of orders ?? []) {
    const key = o.company_id;
    const existing = byCompany.get(key) ?? { name: o.company?.name ?? "Nepoznata firma", orders: [] };
    existing.orders!.push(o);
    byCompany.set(key, existing);
  }

  return (
    <div>
      <PageHeader title="Dolazne narudžbine" description={restaurant.name} />

      <div className="mb-6 flex gap-2">
        {[
          { key: "today", label: `Danas · ${formatDateSr(today)}` },
          { key: "tomorrow", label: `Sutra · ${formatDateSr(tomorrow)}` },
        ].map((tab) => (
          <Link
            key={tab.key}
            href={`/restaurant?day=${tab.key}`}
            className={cn(
              "rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
              (tab.key === "today" ? today : tomorrow) === selectedDay
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-secondary/60"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {byCompany.size === 0 ? (
        <EmptyState icon={ShoppingBag} title="Nema narudžbina za ovaj dan" />
      ) : (
        <div className="space-y-8">
          {[...byCompany.entries()].map(([companyId, group]) => (
            <div key={companyId}>
              <h2 className="mb-3 text-lg font-semibold">{group.name}</h2>
              <div className="space-y-3">
                {group.orders!.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
