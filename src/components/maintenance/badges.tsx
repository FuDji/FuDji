import { Badge } from "@/components/ui/badge";
import { MAINTENANCE_PRIORITIES, MAINTENANCE_STATUSES } from "@/lib/constants";
import type { MaintenancePriority, MaintenanceStatus } from "@/types";

export function PriorityBadge({ priority }: { priority: MaintenancePriority }) {
  const meta = MAINTENANCE_PRIORITIES.find((p) => p.value === priority)!;
  return <Badge variant={meta.color as "secondary" | "warning" | "destructive"}>{meta.label}</Badge>;
}

export function StatusBadge({ status }: { status: MaintenanceStatus }) {
  const meta = MAINTENANCE_STATUSES.find((s) => s.value === status)!;
  const variant = meta.color === "default" ? "default" : (meta.color as "success" | "secondary" | "warning");
  return <Badge variant={variant}>{meta.label}</Badge>;
}
