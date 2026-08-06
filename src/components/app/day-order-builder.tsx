"use client";

import { useMemo, useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, ChevronLeft, Minus, Plus, Store } from "lucide-react";

import { placeOrder, cancelOrder } from "@/app/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { OrderStatusBadge } from "@/components/orders/status-badge";
import { computeOrderSplit } from "@/lib/orders";
import { formatMoney } from "@/lib/utils";
import type { DailyMenu, MenuItem, OrderItem, OrderStatus, PaymentType, Restaurant } from "@/types";

type RestaurantOption = {
  schedule: { restaurant_id: string; meal_limit: number };
  restaurant: Pick<Restaurant, "id" | "name" | "logo_url">;
  menu: (DailyMenu & { menu_item: MenuItem })[];
  ordersCount: number;
  full: boolean;
};

type ExistingOrder = {
  id: string;
  restaurant_id: string;
  status: OrderStatus;
  locked: boolean;
  note: string | null;
  order_items: OrderItem[];
  restaurant?: { id: string; name: string } | null;
  rejection_reason: string | null;
  prep_time_minutes: number | null;
} | null;

export function DayOrderBuilder({
  date,
  restaurants,
  existingOrder,
  cutoffPassed,
  cutoffTime,
  budget,
  paymentType,
  mixedCap,
}: {
  date: string;
  restaurants: RestaurantOption[];
  existingOrder: ExistingOrder;
  cutoffPassed: boolean;
  cutoffTime: string;
  budget: number;
  paymentType: PaymentType;
  mixedCap: number | null;
}) {
  const [restaurantId, setRestaurantId] = useState<string | null>(
    existingOrder?.restaurant_id ?? null
  );
  const [cart, setCart] = useState<Record<string, { quantity: number; note: string }>>(() => {
    const initial: Record<string, { quantity: number; note: string }> = {};
    for (const item of existingOrder?.order_items ?? []) {
      if (item.menu_item_id) initial[item.menu_item_id] = { quantity: item.quantity, note: item.note ?? "" };
    }
    return initial;
  });
  const [note, setNote] = useState(existingOrder?.note ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const selected = restaurants.find((r) => r.restaurant.id === restaurantId);

  const subtotal = useMemo(() => {
    if (!selected) return 0;
    return Object.entries(cart).reduce((sum, [itemId, { quantity }]) => {
      const row = selected.menu.find((m) => m.menu_item_id === itemId);
      if (!row) return sum;
      const price = row.is_deal_of_day && row.deal_price != null ? row.deal_price : row.menu_item.price;
      return sum + price * quantity;
    }, 0);
  }, [cart, selected]);

  const split = computeOrderSplit(paymentType, subtotal, budget, mixedCap);
  const itemCount = Object.values(cart).reduce((n, l) => n + l.quantity, 0);

  function updateQty(itemId: string, delta: number) {
    setCart((prev) => {
      const current = prev[itemId]?.quantity ?? 0;
      const next = Math.max(0, current + delta);
      const copy = { ...prev };
      if (next === 0) delete copy[itemId];
      else copy[itemId] = { quantity: next, note: prev[itemId]?.note ?? "" };
      return copy;
    });
  }

  function submit() {
    if (!restaurantId) return;
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const items = Object.entries(cart).map(([menuItemId, { quantity, note }]) => ({
        menuItemId,
        quantity,
        note,
      }));
      const result = await placeOrder(date, restaurantId, items, note);
      if (result?.error) setError(result.error);
      else setSuccess(true);
    });
  }

  function remove() {
    if (!existingOrder) return;
    setError(null);
    startTransition(async () => {
      const result = await cancelOrder(existingOrder.id);
      if (result?.error) setError(result.error);
      else {
        setCart({});
        setRestaurantId(null);
      }
    });
  }

  if (cutoffPassed && !existingOrder) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Rok za naručivanje ({cutoffTime}) za ovaj dan je prošao, a nisi imao/la narudžbinu.
        </CardContent>
      </Card>
    );
  }

  const readOnly = cutoffPassed || (existingOrder ? existingOrder.locked : false);

  if (restaurantId && selected) {
    return (
      <div>
        {!readOnly && (
          <button
            onClick={() => setRestaurantId(null)}
            className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-4" /> Nazad na restorane
          </button>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{selected.restaurant.name}</h3>
          {existingOrder && <OrderStatusBadge status={existingOrder.status} />}
        </div>

        {existingOrder?.status === "rejected" && existingOrder.rejection_reason && (
          <p className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Razlog odbijanja: {existingOrder.rejection_reason}
          </p>
        )}

        <div className="grid gap-3">
          {selected.menu.map((row) => {
            const qty = cart[row.menu_item_id]?.quantity ?? 0;
            const price = row.is_deal_of_day && row.deal_price != null ? row.deal_price : row.menu_item.price;
            return (
              <Card key={row.id}>
                <CardContent className="flex items-center gap-4 py-4">
                  {row.menu_item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={row.menu_item.image_url}
                      alt={row.menu_item.name}
                      className="size-16 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                      <Store className="size-6" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{row.menu_item.name}</span>
                      {row.is_deal_of_day && <Badge>{row.deal_label || "Ponuda dana"}</Badge>}
                    </div>
                    {row.menu_item.description && (
                      <p className="truncate text-xs text-muted-foreground">{row.menu_item.description}</p>
                    )}
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      {row.menu_item.calories != null && <span>{row.menu_item.calories} kcal</span>}
                      <span className="font-medium text-foreground">{formatMoney(price)}</span>
                    </div>
                  </div>
                  {!readOnly && (
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        onClick={() => updateQty(row.menu_item_id, -1)}
                        disabled={qty === 0}
                      >
                        <Minus className="size-3.5" />
                      </Button>
                      <span className="w-5 text-center text-sm font-medium">{qty}</span>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        onClick={() => updateQty(row.menu_item_id, 1)}
                      >
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                  )}
                  {readOnly && qty > 0 && <span className="shrink-0 text-sm font-medium">×{qty}</span>}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {!readOnly && (
          <div className="mt-4 space-y-1.5">
            <label className="text-sm font-medium">Napomena (npr. bez luka, dodatni sos)</label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
          </div>
        )}

        <Card className="mt-4">
          <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {itemCount} stavki · Ukupno <span className="font-semibold text-foreground">{formatMoney(subtotal)}</span>
              {split.employeePaid > 0 && (
                <span className="ml-2">
                  (ti plaćaš <span className="font-medium text-foreground">{formatMoney(split.employeePaid)}</span>)
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {existingOrder && !readOnly && (
                <Button type="button" variant="outline" onClick={remove} disabled={pending}>
                  Otkaži narudžbinu
                </Button>
              )}
              {!readOnly && (
                <Button type="button" onClick={submit} disabled={pending || itemCount === 0}>
                  {existingOrder ? "Sačuvaj izmene" : "Pošalji narudžbinu"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
            <CheckCircle2 className="size-4 shrink-0" />
            Narudžbina je sačuvana.
          </div>
        )}
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Nijedan restoran ne radi ovaj dan.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((r) => {
        const deals = r.menu.filter((m) => m.is_deal_of_day);
        return (
          <button
            key={r.restaurant.id}
            disabled={r.full && r.restaurant.id !== existingOrder?.restaurant_id}
            onClick={() => setRestaurantId(r.restaurant.id)}
            className="group rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Store className="size-5" />
              </div>
              {r.full && <Badge variant="destructive">Popunjeno</Badge>}
            </div>
            <h3 className="mt-3 font-medium">{r.restaurant.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {r.menu.length} jela · {r.ordersCount}/{r.schedule.meal_limit} obroka danas
            </p>
            {deals.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {deals.slice(0, 2).map((d) => (
                  <Badge key={d.id}>{d.deal_label || "Ponuda dana"}</Badge>
                ))}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
