import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconRegistry = Icons as unknown as Record<string, LucideIcon>;

export function getIcon(name?: string | null): LucideIcon {
  if (!name) return Icons.Sparkles;
  return iconRegistry[name] ?? Icons.Sparkles;
}

export function DynamicIcon({ name, className }: { name?: string | null; className?: string }) {
  const Icon = getIcon(name);
  return <Icon className={className} />;
}
