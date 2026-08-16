import { notFound } from "next/navigation";

import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminMenuItemToggle } from "@/components/admin/menu-item-toggle";
import { MENU_CATEGORIES } from "@/lib/constants";
import { formatMoney } from "@/lib/utils";
import { UtensilsCrossed } from "lucide-react";

export default async function AdminRestaurantMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { supabase } = await requireRole("admin");
  const { id } = await params;

  const [{ data: restaurant }, { data: items }] = await Promise.all([
    supabase.from("restaurants").select("id, name").eq("id", id).single(),
    supabase.from("menu_items").select("*").eq("restaurant_id", id).order("name"),
  ]);

  if (!restaurant) notFound();

  const categoryLabel = (value: string | null) =>
    MENU_CATEGORIES.find((c) => c.value === value)?.label ?? value;

  return (
    <div>
      <PageHeader
        title={`Meni — ${restaurant.name}`}
        description="Uključi ili isključi jela ako restoran to sam ne uradi na vreme."
      />

      {!items || items.length === 0 ? (
        <EmptyState icon={UtensilsCrossed} title="Restoran još nema dodatih jela" />
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.name}</span>
                    <Badge variant="secondary">{categoryLabel(item.category)}</Badge>
                    {!item.active && <Badge variant="destructive">Isključeno</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatMoney(item.price)}
                    {item.calories != null && ` · ${item.calories} kcal`}
                  </div>
                </div>
                <AdminMenuItemToggle itemId={item.id} active={item.active} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
