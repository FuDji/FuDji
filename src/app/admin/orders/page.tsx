import Link from "next/link";

import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/orders/status-badge";
import { cn, formatDateSr, formatMoney, todayKey } from "@/lib/utils";
import { ListOrdered } from "lucide-react";
import type { OrderWithNames } from "@/types";

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
    .select("*, employee:profiles(full_name), company:companies(name), restaurant:restaurants(name)")
    .order("order_date", { ascending: false })
    .limit(150);

  if (scope === "today") query = query.eq("order_date", today);
  if (scope === "future") query = query.gt("order_date", today);

  const { data: orders } = await query.returns<OrderWithNames[]>();

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
            <Card key={o.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{formatDateSr(o.order_date)}</span>
                    <OrderStatusBadge status={o.status} />
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="font-medium">{o.employee?.full_name}</span>
                    <span className="text-muted-foreground"> · {o.company?.name} → {o.restaurant?.name}</span>
                  </div>
                </div>
                <span className="font-semibold">{formatMoney(o.subtotal)}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
