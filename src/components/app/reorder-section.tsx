"use client";

import { useState, useTransition } from "react";
import { RotateCcw } from "lucide-react";

import { reorderPastOrder } from "@/app/app/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";
import type { RecentOrder } from "@/app/app/data";

export function ReorderSection({ orders, disabled }: { orders: RecentOrder[]; disabled: boolean }) {
  if (orders.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="mb-3 text-lg font-semibold">Poruči ponovo</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {orders.map((o) => (
          <ReorderCard key={o.id} order={o} disabled={disabled} />
        ))}
      </div>
    </div>
  );
}

function ReorderCard({ order, disabled }: { order: RecentOrder; disabled: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const itemsSummary = order.order_items.map((i) => `${i.quantity}× ${i.name_snapshot}`).join(", ");

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardContent className="flex flex-1 flex-col justify-between gap-3 pt-6">
        <div>
          <div className="font-medium">{order.restaurant?.name}</div>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{itemsSummary}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">{formatMoney(order.subtotal)}</span>
          <Button
            size="sm"
            variant="secondary"
            disabled={disabled || pending}
            onClick={() =>
              startTransition(async () => {
                setError(null);
                const result = await reorderPastOrder(order.id);
                if (result?.error) setError(result.error);
              })
            }
          >
            <RotateCcw className="size-3.5" /> Naruči ponovo
          </Button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
