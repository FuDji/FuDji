"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";

import { setRestaurantSchedule } from "@/app/admin/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDateSr } from "@/lib/utils";
import type { RestaurantSchedule } from "@/types";

export function ScheduleEditor({
  restaurantId,
  days,
  schedule,
}: {
  restaurantId: string;
  days: string[];
  schedule: RestaurantSchedule[];
}) {
  const [rows, setRows] = useState(() => {
    const map = new Map<string, { isOpen: boolean; limit: string }>();
    for (const day of days) {
      const existing = schedule.find((s) => s.date === day);
      map.set(day, { isOpen: existing?.is_open ?? true, limit: String(existing?.meal_limit ?? 50) });
    }
    return map;
  });
  const [pending, startTransition] = useTransition();
  const [savedDay, setSavedDay] = useState<string | null>(null);

  function update(day: string, patch: Partial<{ isOpen: boolean; limit: string }>) {
    setRows((prev) => {
      const copy = new Map(prev);
      copy.set(day, { ...copy.get(day)!, ...patch });
      return copy;
    });
  }

  function save(day: string) {
    const row = rows.get(day)!;
    startTransition(async () => {
      await setRestaurantSchedule(restaurantId, day, row.isOpen, Number(row.limit));
      setSavedDay(day);
      setTimeout(() => setSavedDay(null), 1200);
    });
  }

  return (
    <div className="space-y-2">
      {days.map((day) => {
        const row = rows.get(day)!;
        return (
          <Card key={day}>
            <CardContent className="flex flex-wrap items-center gap-4 py-3">
              <div className="min-w-28 font-medium capitalize">{formatDateSr(day)}</div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Switch checked={row.isOpen} onCheckedChange={(v) => update(day, { isOpen: v })} />
                Radi ovaj dan
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={row.limit}
                  onChange={(e) => update(day, { limit: e.target.value })}
                  className="h-8 w-24 text-xs"
                />
                <span className="text-xs text-muted-foreground">limit obroka</span>
              </div>
              <Button size="icon-sm" variant="outline" onClick={() => save(day)} disabled={pending}>
                <Check className={savedDay === day ? "text-success" : ""} />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
