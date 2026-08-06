import Link from "next/link";

import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/orders/status-badge";
import { formatMoney, todayKey } from "@/lib/utils";
import { Download, ListOrdered, Store, UtensilsCrossed, Wallet } from "lucide-react";
import type { OrderWithNames } from "@/types";

export default async function AdminOverviewPage() {
  const { supabase } = await requireRole("admin");
  const today = todayKey();

  const [
    { count: activeCompanies },
    { count: inactiveCompanies },
    { count: activeRestaurants },
    { data: todayOrders },
    { count: futureOrders },
  ] = await Promise.all([
    supabase.from("companies").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("companies").select("id", { count: "exact", head: true }).eq("status", "inactive"),
    supabase.from("restaurants").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase
      .from("orders")
      .select("*, employee:profiles(full_name), company:companies(name), restaurant:restaurants(name)")
      .eq("order_date", today)
      .order("created_at", { ascending: false })
      .returns<OrderWithNames[]>(),
    supabase.from("orders").select("id", { count: "exact", head: true }).gt("order_date", today),
  ]);

  const revenueToday = (todayOrders ?? []).reduce((s, o) => s + o.subtotal, 0);

  return (
    <div>
      <PageHeader
        title="Pregled"
        description="Sve narudžbine, firme i restorani na jednom mestu."
        actions={
          <Button asChild variant="secondary">
            <Link href="/admin/export">
              <Download className="size-4" /> Excel export
            </Link>
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Narudžbine danas" value={todayOrders?.length ?? 0} icon={ListOrdered} />
        <StatCard label="Buduće narudžbine" value={futureOrders ?? 0} icon={ListOrdered} />
        <StatCard label="Prihod danas" value={formatMoney(revenueToday)} icon={Wallet} tone="success" />
        <StatCard
          label="Aktivne firme"
          value={`${activeCompanies ?? 0} / ${(activeCompanies ?? 0) + (inactiveCompanies ?? 0)}`}
          icon={Store}
        />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatCard label="Aktivni restorani" value={activeRestaurants ?? 0} icon={UtensilsCrossed} />
      </div>

      <h2 className="mb-3 text-lg font-semibold">Narudžbine danas</h2>
      {!todayOrders || todayOrders.length === 0 ? (
        <p className="text-sm text-muted-foreground">Još nema narudžbina za danas.</p>
      ) : (
        <div className="space-y-2">
          {todayOrders.slice(0, 20).map((o) => (
            <Card key={o.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="text-sm">
                  <span className="font-medium">{o.employee?.full_name}</span>
                  <span className="text-muted-foreground"> · {o.company?.name} → {o.restaurant?.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{formatMoney(o.subtotal)}</span>
                  <OrderStatusBadge status={o.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
