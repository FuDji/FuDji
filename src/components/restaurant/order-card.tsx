"use client";

import { useState, useTransition } from "react";
import { AlertCircle, Check, Clock, X } from "lucide-react";

import { acceptOrder, rejectOrder, setOrderStatus } from "@/app/restaurant/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderStatusBadge } from "@/components/orders/status-badge";
import { formatMoney } from "@/lib/utils";
import type { OrderItem, OrderStatus } from "@/types";

type Order = {
  id: string;
  status: OrderStatus;
  note: string | null;
  subtotal: number;
  prep_time_minutes: number | null;
  rejection_reason: string | null;
  order_items: OrderItem[];
  employee?: { full_name: string | null } | null;
  company?: { name: string } | null;
};

export function OrderCard({ order }: { order: Order }) {
  const [pending, startTransition] = useTransition();
  const [prepTime, setPrepTime] = useState(15);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  function accept() {
    setError(null);
    startTransition(async () => {
      const result = await acceptOrder(order.id, prepTime);
      if (result?.error) setError(result.error);
    });
  }

  function reject() {
    setError(null);
    startTransition(async () => {
      const result = await rejectOrder(order.id, reason);
      if (result?.error) setError(result.error);
      else setShowReject(false);
    });
  }

  function advance(status: "preparing" | "ready" | "delivered") {
    setError(null);
    startTransition(async () => {
      const result = await setOrderStatus(order.id, status);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{order.employee?.full_name}</span>
              <span className="text-sm text-muted-foreground">· {order.company?.name}</span>
            </div>
            <ul className="mt-1 space-y-0.5 text-sm text-muted-foreground">
              {order.order_items.map((item) => (
                <li key={item.id}>
                  {item.quantity}× {item.name_snapshot}
                  {item.note ? ` — ${item.note}` : ""}
                </li>
              ))}
            </ul>
            {order.note && <p className="mt-1 text-xs text-muted-foreground">Napomena: {order.note}</p>}
          </div>
          <div className="text-right">
            <div className="font-semibold">{formatMoney(order.subtotal)}</div>
            <div className="mt-1">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
        </div>

        {order.status === "pending" && !showReject && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(Number(e.target.value))}
              className="h-8 w-20 text-xs"
              min={1}
            />
            <span className="text-xs text-muted-foreground">min pripreme</span>
            <Button size="sm" onClick={accept} disabled={pending}>
              <Check className="size-3.5" /> Prihvati
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowReject(true)} disabled={pending}>
              <X className="size-3.5" /> Odbij
            </Button>
          </div>
        )}

        {order.status === "pending" && showReject && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Input
              placeholder="Razlog odbijanja (npr. nema na stanju)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-8 flex-1 text-xs"
            />
            <Button size="sm" variant="destructive" onClick={reject} disabled={pending}>
              Potvrdi odbijanje
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowReject(false)}>
              Otkaži
            </Button>
          </div>
        )}

        {order.status === "accepted" && (
          <div className="mt-3 flex items-center gap-2">
            {order.prep_time_minutes && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3.5" /> {order.prep_time_minutes} min
              </span>
            )}
            <Button size="sm" onClick={() => advance("preparing")} disabled={pending}>
              Počni pripremu
            </Button>
          </div>
        )}

        {order.status === "preparing" && (
          <div className="mt-3">
            <Button size="sm" onClick={() => advance("ready")} disabled={pending}>
              Označi kao spremno
            </Button>
          </div>
        )}

        {order.status === "ready" && (
          <div className="mt-3">
            <Button size="sm" onClick={() => advance("delivered")} disabled={pending}>
              Označi kao dostavljeno
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
