import { Badge } from "@/components/ui/badge";
import type { InventoryStatus } from "@/types";

const META: Record<InventoryStatus, { label: string; variant: "success" | "warning" | "destructive" }> = {
  ok: { label: "Na stanju", variant: "success" },
  low: { label: "Nisko stanje", variant: "warning" },
  missing: { label: "Nedostaje", variant: "destructive" },
  broken: { label: "Pokvareno", variant: "destructive" },
  needs_replacement: { label: "Potrebna zamena", variant: "warning" },
};

export function InventoryStatusBadge({ status }: { status: InventoryStatus }) {
  const meta = META[status];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
