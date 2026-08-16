import Link from "next/link";

import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { OrderDetailCard } from "@/components/admin/order-detail-card";
import { cn, todayKey } from "@/lib/utils";
import { ListOrdered } from "lucide-react";
import type { OrderWithProfit } from "@/types";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ scope?: string }>;
}) {
  const { supabase } = await requireRole("admin");
  const params = await searchParams;
  const scope = params.scope === "future" ? "future" : params.scope === "all" ? "all" : "today";
  const today = todayKey();

  let query = supabase
    .from("orders")
    .select(
      "*, order_items(*), company:companies(name, address), restaurant:restaurants(name, commission_percent)"
    )
    .order("order_date", { ascending: false })
    .limit(150);

  if (scope === "today") query = query.eq("order_date", today);
  if (scope === "future") query = query.gt("order_date", today);

  const { data: orders } = await query.returns<OrderWithProfit[]>();

  return (
    <div>
      <PageHeader title="Narudžbine" description="Aktivne, buduće i status u realnom vremenu." />

      <div className="mb-6 flex gap-2">
        {[
          { key: "today", label: "Danas" },
          { key: "future", label: "Buduće" },
          { key: "all", label: "Sve" },
        ].map((tab) => (
          <Link
            key={tab.key}
            href={`/admin/orders?scope=${tab.key}`}
            className={cn(
              "rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
              scope === tab.key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-secondary/60"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {!orders || orders.length === 0 ? (
        <EmptyState icon={ListOrdered} title="Nema narudžbina" />
      ) : (
        <div className="space-y-2">
          {orders.map((o) => (
            <OrderDetailCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}
