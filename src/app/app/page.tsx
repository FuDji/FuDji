import Link from "next/link";
import { Flame, UtensilsCrossed, Wallet, Clock } from "lucide-react";

import { getEmployeeContext, getOrderForDate, getRestaurantsForDate } from "./data";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { StatCard } from "@/components/layout/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/orders/status-badge";
import { formatMoney, isPastCutoff, todayKey } from "@/lib/utils";

export default async function TodayPage() {
  const { supabase, user, profile, company } = await getEmployeeContext();
  const today = todayKey();

  const [order, restaurants] = await Promise.all([
    getOrderForDate(supabase, user.id, today),
    getRestaurantsForDate(supabase, today),
  ]);

  const budget = profile.daily_budget_override ?? company?.daily_budget ?? 0;
  const cutoffPassed = company ? isPastCutoff(today, company.cutoff_time) : false;
  const deals = restaurants.flatMap((r) =>
    r.menu.filter((m) => m.is_deal_of_day).map((m) => ({ ...m, restaurantName: r.restaurant.name }))
  );

  return (
    <div>
      <PageHeader
        title="Danas"
        description={new Intl.DateTimeFormat("sr-Latn-RS", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }).format(new Date())}
        actions={
          <Button asChild>
            <Link href="/app/menu">
              <UtensilsCrossed className="size-4" /> Naruči
            </Link>
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Dnevni budžet" value={formatMoney(budget)} icon={Wallet} />
        <StatCard
          label="Rok za naručivanje"
          value={company?.cutoff_time?.slice(0, 5) ?? "—"}
          icon={Clock}
          tone={cutoffPassed ? "destructive" : "primary"}
          trend={cutoffPassed ? "Istekao" : "Otvoreno"}
        />
        <StatCard label="Loyalty poeni" value={profile.loyalty_points} icon={Flame} tone="warning" />
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Tvoja narudžbina za danas</h2>
        {order ? (
          <Card>
            <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{order.restaurant?.name}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {order.order_items.map((item) => (
                    <li key={item.id}>
                      {item.quantity}× {item.name_snapshot}
                      {item.note ? ` — ${item.note}` : ""}
                    </li>
                  ))}
                </ul>
                {order.status === "rejected" && order.rejection_reason && (
                  <p className="mt-2 text-sm text-destructive">Razlog: {order.rejection_reason}</p>
                )}
                {order.prep_time_minutes && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Procenjeno vreme pripreme: {order.prep_time_minutes} min
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{formatMoney(order.subtotal)}</div>
                {order.employee_paid > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Ti plaćaš {formatMoney(order.employee_paid)}
                  </div>
                )}
                <Button asChild variant="secondary" size="sm" className="mt-3">
                  <Link href="/app/menu">Izmeni</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            icon={UtensilsCrossed}
            title={cutoffPassed ? "Nisi naručio/la za danas" : "Još nisi naručio/la za danas"}
            description={
              cutoffPassed
                ? "Rok za naručivanje za danas je prošao."
                : "Izaberi restoran i jela iz nedeljnog menija."
            }
            action={
              !cutoffPassed && (
                <Button asChild>
                  <Link href="/app/menu">Naruči sada</Link>
                </Button>
              )
            }
          />
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Ponuda dana</h2>
        {deals.length === 0 ? (
          <p className="text-sm text-muted-foreground">Danas nema posebnih ponuda.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((deal) => (
              <Card key={deal.id} className="overflow-hidden">
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <Badge>{deal.deal_label || "Ponuda dana"}</Badge>
                    <span className="text-xs text-muted-foreground">{deal.restaurantName}</span>
                  </div>
                  <div className="font-medium">{deal.menu_item.name}</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-semibold text-primary">
                      {formatMoney(deal.deal_price ?? deal.menu_item.price)}
                    </span>
                    {deal.deal_price != null && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatMoney(deal.menu_item.price)}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
