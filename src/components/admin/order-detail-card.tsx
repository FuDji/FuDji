"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge } from "@/components/orders/status-badge";
import { computeOrderProfit } from "@/lib/orders";
import { formatDateSr, formatMoney } from "@/lib/utils";
import type { OrderWithProfit } from "@/types";

export function OrderDetailCard({ order }: { order: OrderWithProfit }) {
  const [open, setOpen] = useState(false);
  const profit = computeOrderProfit(order.subtotal, order.restaurant?.commission_percent ?? 0);

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className="cursor-pointer transition-colors hover:border-primary/40"
      >
        <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{formatDateSr(order.order_date)}</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="mt-1 text-sm">
              <span className="font-medium">{order.employee_name_snapshot}</span>
              <span className="text-muted-foreground">
                {" "}
                · {order.company?.name} → {order.restaurant?.name}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold">{formatMoney(order.subtotal)}</span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{order.employee_name_snapshot}</DialogTitle>
            <DialogDescription>
              {formatDateSr(order.order_date)} · {order.company?.name} → {order.restaurant?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between">
            <OrderStatusBadge status={order.status} />
            {order.prep_time_minutes && (
              <span className="text-xs text-muted-foreground">Priprema: {order.prep_time_minutes} min</span>
            )}
          </div>

          {order.status === "rejected" && order.rejection_reason && (
            <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Razlog odbijanja: {order.rejection_reason}
            </p>
          )}

          <div>
            <h4 className="mb-2 text-sm font-medium">Stavke</h4>
            <ul className="space-y-1 text-sm">
              {order.order_items.map((item) => (
                <li key={item.id} className="flex items-center justify-between text-muted-foreground">
                  <span>
                    {item.quantity}× {item.name_snapshot}
                    {item.note ? ` — ${item.note}` : ""}
                  </span>
                  <span className="text-foreground">{formatMoney(item.price_snapshot * item.quantity)}</span>
                </li>
              ))}
            </ul>
            {order.note && <p className="mt-2 text-xs text-muted-foreground">Napomena: {order.note}</p>}
          </div>

          <Separator />

          <div className="space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Ukupno (hrana)</span>
              <span className="font-medium">{formatMoney(order.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Plaća firma</span>
              <span>{formatMoney(order.company_covered)}</span>
            </div>
            {order.employee_paid > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Doplaćuje zaposleni</span>
                <span>{formatMoney(order.employee_paid)}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Provizija restorana ({order.restaurant?.commission_percent ?? 0}%)
              </span>
              <span>{formatMoney(profit.restaurantCommission)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Taksa platforme (po obroku)</span>
              <span>{formatMoney(profit.platformFee)}</span>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span>Profit Prime Bite</span>
              <span className="text-primary">{formatMoney(profit.totalProfit)}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
