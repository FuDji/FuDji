import { Wrench } from "lucide-react";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/layout/empty-state";
import { formatRelativeTime } from "@/lib/utils";
import type { ActivityItem } from "@/lib/data/dashboard";

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">Nedavna aktivnost</h3>
      {items.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="Još nema aktivnosti"
          description="Kad dodaš apartmane i gosti počnu da skeniraju QR kodove, aktivnost će se pojaviti ovde."
          className="border-none py-10"
        />
      ) : (
        <ul className="space-y-1">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-secondary/40"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <Wrench className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.apartmentName}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatRelativeTime(item.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
