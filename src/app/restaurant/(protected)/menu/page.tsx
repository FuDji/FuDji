import Link from "next/link";

import { getRestaurantContext } from "@/app/restaurant/data";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MenuItemDialog } from "@/components/restaurant/menu-item-dialog";
import { MenuItemToggle } from "@/components/restaurant/menu-item-toggle";
import { DailyAvailabilityEditor } from "@/components/restaurant/daily-availability-editor";
import { MENU_CATEGORIES } from "@/lib/constants";
import { cn, formatDateSr, formatMoney, toDateKey, addDays, todayKey } from "@/lib/utils";
import { UtensilsCrossed } from "lucide-react";

export default async function RestaurantMenuPage({
  searchParams,
}: {
  searchParams: Promise<{ day?: string }>;
}) {
  const { supabase, restaurant } = await getRestaurantContext();
  const params = await searchParams;

  const days = Array.from({ length: 14 }, (_, i) => toDateKey(addDays(new Date(), i)));
  const selectedDay = params.day && days.includes(params.day) ? params.day : todayKey();

  const [{ data: items }, { data: dailyRows }] = await Promise.all([
    supabase.from("menu_items").select("*").eq("restaurant_id", restaurant.id).order("name"),
    supabase.from("daily_menu").select("*").eq("restaurant_id", restaurant.id).eq("date", selectedDay),
  ]);

  const categoryLabel = (value: string | null) =>
    MENU_CATEGORIES.find((c) => c.value === value)?.label ?? value;

  return (
    <div>
      <PageHeader title="Meni" description="Jela, cene i dostupnost po danima." actions={<MenuItemDialog />} />

      <h2 className="mb-3 text-lg font-semibold">Sva jela</h2>
      {!items || items.length === 0 ? (
        <EmptyState icon={UtensilsCrossed} title="Još nema dodatih jela" />
      ) : (
        <div className="mb-10 space-y-2">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.name}</span>
                    <Badge variant="secondary">{categoryLabel(item.category)}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatMoney(item.price)}
                    {item.calories != null && ` · ${item.calories} kcal`}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MenuItemToggle itemId={item.id} active={item.active} />
                  <MenuItemDialog item={item} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <h2 className="mb-3 text-lg font-semibold">Dostupnost po danu</h2>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {days.map((day) => (
          <Link
            key={day}
            href={`/restaurant/menu?day=${day}`}
            className={cn(
              "flex min-w-20 shrink-0 flex-col items-center rounded-xl border px-3 py-2 text-center transition-colors",
              day === selectedDay
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-secondary/60"
            )}
          >
            <span className="text-xs capitalize">{formatDateSr(day)}</span>
          </Link>
        ))}
      </div>

      {!items || items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Dodaj jela da bi podesio/la dostupnost po danu.</p>
      ) : (
        <DailyAvailabilityEditor
          date={selectedDay}
          items={items.filter((i) => i.active)}
          dailyRows={dailyRows ?? []}
        />
      )}
    </div>
  );
}
