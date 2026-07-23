import { Badge } from "@/components/ui/badge";
import type { InventoryStatus } from "@/types";

const META: Record<InventoryStatus, { label: string; variant: "success" | "warning" | "destructive" }> = {
  ok: { label: "In stock", variant: "success" },
  low: { label: "Low stock", variant: "warning" },
  missing: { label: "Missing", variant: "destructive" },
  broken: { label: "Broken", variant: "destructive" },
  needs_replacement: { label: "Needs replacement", variant: "warning" },
};

export function InventoryStatusBadge({ status }: { status: InventoryStatus }) {
  const meta = META[status];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
