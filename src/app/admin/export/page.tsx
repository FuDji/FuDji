import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { todayKey } from "@/lib/utils";
import { Download, FileSpreadsheet } from "lucide-react";
import type { Order } from "@/types";

type ExportOrderRow = Order & {
  order_items: { quantity: number }[];
  company: { name: string; address: string | null } | null;
  restaurant: { name: string } | null;
};

export default async function ExportPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { supabase } = await requireRole("admin");
  const params = await searchParams;
  const date = params.date || todayKey();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(quantity), company:companies(name, address), restaurant:restaurants(name)")
    .eq("order_date", date)
    .neq("status", "rejected")
    .returns<ExportOrderRow[]>();

  const groups = new Map<string, { restaurant: string; company: string; address: string; meals: number }>();
  for (const o of orders ?? []) {
    const key = `${o.restaurant_id}::${o.company_id}`;
    const mealCount = o.order_items.reduce((s, i) => s + i.quantity, 0);
    const existing = groups.get(key);
    if (existing) existing.meals += mealCount;
    else
      groups.set(key, {
        restaurant: o.restaurant?.name ?? "",
        company: o.company?.name ?? "",
        address: o.company?.address ?? "",
        meals: mealCount,
      });
  }
  const rows = [...groups.values()].filter((r) => r.meals > 0);

  return (
    <div>
      <PageHeader
        title="Excel export"
        description="Podaci za organizaciju ruta kurira nakon zaključenja porudžbina. Restorani sa 0 obroka se ne uključuju."
      />

      <form className="mb-6 flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="date">Datum</Label>
          <Input id="date" name="date" type="date" defaultValue={date} />
        </div>
        <Button type="submit" variant="secondary">
          Prikaži
        </Button>
        <Button asChild>
          <a href={`/admin/export/download?date=${date}`}>
            <Download className="size-4" /> Preuzmi Excel
          </a>
        </Button>
      </form>

      {rows.length === 0 ? (
        <EmptyState icon={FileSpreadsheet} title="Nema obroka za izabrani datum" />
      ) : (
        <div className="space-y-2">
          {rows.map((r, i) => (
            <Card key={i}>
              <CardContent className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{r.restaurant} → {r.company}</div>
                  <div className="text-sm text-muted-foreground">{r.address || "Bez adrese"}</div>
                </div>
                <span className="font-semibold">{r.meals} obroka</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
