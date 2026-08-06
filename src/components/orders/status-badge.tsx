import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_META } from "@/lib/constants";
import type { OrderStatus } from "@/types";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META[status];
  return (
    <Badge variant={meta.tone as "default" | "warning" | "success" | "destructive"}>
      {meta.label}
    </Badge>
  );
}
