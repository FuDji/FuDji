import { getCompanyContext } from "@/app/company/data";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/orders/status-badge";
import { formatDateSr, formatMoney } from "@/lib/utils";
import { ReceiptText } from "lucide-react";
import type { Order, OrderItem } from "@/types";

type OrderRow = Order & {
  order_items: OrderItem[];
  restaurant: { name: string } | null;
};

export default async function HistoryPage() {
  const { supabase, company } = await getCompanyContext();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*), restaurant:restaurants(name)")
    .eq("company_id", company.id)
    .order("order_date", { ascending: false })
    .limit(100)
    .returns<OrderRow[]>();

  return (
    <div>
      <PageHeader title="Istorija narudžbina" description="Ko šta jede — sve narudžbine firme." />

      {!orders || orders.length === 0 ? (
        <EmptyState icon={ReceiptText} title="Nema narudžbina" />
      ) : (
        <div className="space-y-2">
          {orders.map((o) => (
            <Card key={o.id}>
              <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{formatDateSr(o.order_date)}</span>
                    <OrderStatusBadge status={o.status} />
                  </div>
                  <div className="mt-1 font-medium">
                    {o.employee_name_snapshot} <span className="text-muted-foreground">· {o.restaurant?.name}</span>
                  </div>
                  <ul className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                    {o.order_items.map((item) => (
                      <li key={item.id}>
                        {item.quantity}× {item.name_snapshot}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-right text-sm">
                  <div className="font-semibold">{formatMoney(o.subtotal)}</div>
                  <div className="text-xs text-muted-foreground">firma: {formatMoney(o.company_covered)}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
