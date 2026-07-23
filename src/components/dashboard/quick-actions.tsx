import Link from "next/link";
import { QrCode, BookOpenText, Wrench, Package } from "lucide-react";

import { Card } from "@/components/ui/card";

const actions = [
  { href: "/apartments/new", label: "New Apartment", icon: Package, tone: "primary" },
  { href: "/apartments", label: "Generate QR", icon: QrCode, tone: "success" },
  { href: "/apartments", label: "Create Guest Guide", icon: BookOpenText, tone: "warning" },
  { href: "/apartments", label: "Add Maintenance", icon: Wrench, tone: "destructive" },
] as const;

const toneClasses = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

export function QuickActions() {
  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">Quick actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="group flex flex-col gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-secondary/40"
          >
            <div className={`flex size-9 items-center justify-center rounded-lg ${toneClasses[action.tone]}`}>
              <action.icon className="size-4" />
            </div>
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
