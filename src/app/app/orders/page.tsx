import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/orders/status-badge";
import { RatingDialog } from "@/components/app/rating-dialog";
import { formatDateSr, formatMoney } from "@/lib/utils";
import { ListOrdered } from "lucide-react";
import type { Order, OrderItem } from "@/types";

type OrderRow = Order & {
  order_items: OrderItem[];
  restaurant: { name: string } | null;
  rating: { id: string }[];
};

export default async function MyOrdersPage() {
  const { supabase, user } = await requireRole("employee");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*), restaurant:restaurants(name), rating:ratings(id)")
    .eq("employee_id", user.id)
    .order("order_date", { ascending: false })
    .returns<OrderRow[]>();

  return (
    <div>
      <PageHeader title="Moje narudžbine" description="Istorija i status svih tvojih narudžbina." />

      {!orders || orders.length === 0 ? (
        <EmptyState icon={ListOrdered} title="Nema narudžbina" description="Još uvek nisi naručivao/la." />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{formatDateSr(order.order_date)}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="mt-1 font-medium">{order.restaurant?.name}</div>
                  <ul className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                    {order.order_items.map((item) => (
                      <li key={item.id}>
                        {item.quantity}× {item.name_snapshot}
                      </li>
                    ))}
                  </ul>
                  {order.status === "rejected" && order.rejection_reason && (
                    <p className="mt-1 text-sm text-destructive">Razlog: {order.rejection_reason}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatMoney(order.subtotal)}</div>
                  {order.status === "delivered" && !order.rating?.length && (
                    <div className="mt-2">
                      <RatingDialog orderId={order.id} />
                    </div>
                  )}
                  {order.status === "delivered" && !!order.rating?.length && (
                    <div className="mt-2 text-xs text-muted-foreground">Ocenjeno</div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
