import Link from "next/link";

import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Button } from "@/components/ui/button";
import { OrderDetailCard } from "@/components/admin/order-detail-card";
import { computeOrderProfit } from "@/lib/orders";
import { formatMoney, todayKey } from "@/lib/utils";
import { Download, ListOrdered, Store, UtensilsCrossed, Wallet } from "lucide-react";
import type { OrderWithProfit } from "@/types";

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
      .select(
        "*, order_items(*), company:companies(name, address), restaurant:restaurants(name, commission_percent)"
      )
      .eq("order_date", today)
      .order("created_at", { ascending: false })
      .returns<OrderWithProfit[]>(),
    supabase.from("orders").select("id", { count: "exact", head: true }).gt("order_date", today),
  ]);

  const revenueToday = (todayOrders ?? [])
    .filter((o) => o.status !== "rejected")
    .reduce((s, o) => s + computeOrderProfit(o.subtotal, o.restaurant?.commission_percent ?? 0).totalProfit, 0);

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
        <StatCard label="Profit Prime Bite danas" value={formatMoney(revenueToday)} icon={Wallet} tone="success" />
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
            <OrderDetailCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}
