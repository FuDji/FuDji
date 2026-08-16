"use client";

import { useState, useTransition } from "react";
import { AlertCircle, Check, Clock, X } from "lucide-react";

import { acceptOrder, rejectOrder, setOrderStatus } from "@/app/restaurant/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderStatusBadge } from "@/components/orders/status-badge";
import { cn, formatMoney } from "@/lib/utils";
import type { OrderItem, OrderStatus } from "@/types";

const PREP_TIME_OPTIONS = [15, 20, 30, 45, 60];

type Order = {
  id: string;
  status: OrderStatus;
  note: string | null;
  subtotal: number;
  prep_time_minutes: number | null;
  rejection_reason: string | null;
  employee_name_snapshot: string | null;
  order_items: OrderItem[];
  company?: { name: string } | null;
};

export function OrderCard({ order }: { order: Order }) {
  const [pending, startTransition] = useTransition();
  const [prepTime, setPrepTime] = useState<number | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  function accept(minutes: number) {
    setError(null);
    startTransition(async () => {
      const result = await acceptOrder(order.id, minutes);
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

  function advance(status: "preparing" | "ready" | "picked_up") {
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
              <span className="font-medium">{order.employee_name_snapshot}</span>
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
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">Za koliko minuta može biti spremno?</p>
            <div className="flex flex-wrap items-center gap-2">
              {PREP_TIME_OPTIONS.map((minutes) => (
                <Button
                  key={minutes}
                  size="lg"
                  variant={prepTime === minutes ? "default" : "outline"}
                  className="min-w-16"
                  onClick={() => {
                    setPrepTime(minutes);
                    accept(minutes);
                  }}
                  disabled={pending}
                >
                  {minutes === 60 ? "60+" : minutes}
                </Button>
              ))}
              <Button
                size="lg"
                variant="outline"
                className={cn("px-4", pending && "opacity-50")}
                onClick={() => setShowReject(true)}
                disabled={pending}
              >
                <X className="size-4" /> Odbij
              </Button>
            </div>
          </div>
        )}

        {order.status === "pending" && showReject && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Input
              placeholder="Razlog odbijanja (npr. nema na stanju)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-10 flex-1"
              autoFocus
            />
            <Button size="lg" variant="destructive" onClick={reject} disabled={pending}>
              Potvrdi odbijanje
            </Button>
            <Button size="lg" variant="ghost" onClick={() => setShowReject(false)}>
              Otkaži
            </Button>
          </div>
        )}

        {order.status === "accepted" && (
          <div className="mt-4 flex items-center gap-3">
            {order.prep_time_minutes && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="size-4" /> {order.prep_time_minutes} min
              </span>
            )}
            <Button size="lg" onClick={() => advance("preparing")} disabled={pending}>
              Počni pripremu
            </Button>
          </div>
        )}

        {order.status === "preparing" && (
          <div className="mt-4">
            <Button size="lg" onClick={() => advance("ready")} disabled={pending}>
              <Check className="size-4" /> Označi kao spremno
            </Button>
          </div>
        )}

        {order.status === "ready" && (
          <div className="mt-4">
            <Button size="lg" onClick={() => advance("picked_up")} disabled={pending}>
              <Check className="size-4" /> Označi kao preuzeto
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
