"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";

import { setDailyAvailability } from "@/app/restaurant/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/utils";
import type { DailyMenu, MenuItem } from "@/types";

type Row = { available: boolean; deal: boolean; label: string; price: string };

export function DailyAvailabilityEditor({
  date,
  items,
  dailyRows,
}: {
  date: string;
  items: MenuItem[];
  dailyRows: DailyMenu[];
}) {
  const initial = new Map<string, Row>();
  for (const item of items) {
    const existing = dailyRows.find((d) => d.menu_item_id === item.id);
    initial.set(item.id, {
      available: existing?.is_available ?? true,
      deal: existing?.is_deal_of_day ?? false,
      label: existing?.deal_label ?? "",
      price: existing?.deal_price != null ? String(existing.deal_price) : "",
    });
  }

  const [rows, setRows] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [savedId, setSavedId] = useState<string | null>(null);

  function update(id: string, patch: Partial<Row>) {
    setRows((prev) => {
      const copy = new Map(prev);
      copy.set(id, { ...copy.get(id)!, ...patch });
      return copy;
    });
  }

  function save(itemId: string) {
    const row = rows.get(itemId)!;
    startTransition(async () => {
      await setDailyAvailability(
        itemId,
        date,
        row.available,
        row.deal,
        row.label,
        row.price === "" ? null : Number(row.price)
      );
      setSavedId(itemId);
      setTimeout(() => setSavedId(null), 1200);
    });
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const row = rows.get(item.id)!;
        return (
          <Card key={item.id}>
            <CardContent className="flex flex-wrap items-center gap-3 py-3">
              <div className="min-w-32 flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">{formatMoney(item.price)}</div>
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Switch checked={row.available} onCheckedChange={(v) => update(item.id, { available: v })} />
                Dostupno
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Switch checked={row.deal} onCheckedChange={(v) => update(item.id, { deal: v })} />
                Ponuda dana
              </label>
              {row.deal && (
                <>
                  <Input
                    placeholder="npr. Taco Monday"
                    value={row.label}
                    onChange={(e) => update(item.id, { label: e.target.value })}
                    className="h-8 w-36 text-xs"
                  />
                  <Input
                    type="number"
                    placeholder="Akcijska cena"
                    value={row.price}
                    onChange={(e) => update(item.id, { price: e.target.value })}
                    className="h-8 w-28 text-xs"
                  />
                </>
              )}
              <Button size="icon-sm" variant="outline" onClick={() => save(item.id)} disabled={pending}>
                <Check className={savedId === item.id ? "text-success" : ""} />
              </Button>
              {row.deal && <Badge>Akcija</Badge>}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
