import { getRestaurantContext } from "../data";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { EmptyState } from "@/components/layout/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateSr } from "@/lib/utils";
import { MessageSquareText, Star } from "lucide-react";

type ReviewRow = {
  id: string;
  delivery_rating: number | null;
  food_rating: number | null;
  system_rating: number | null;
  comment: string | null;
  order: {
    order_date: string;
    company: { name: string } | null;
  } | null;
};

function Stars({ value }: { value: number | null }) {
  if (value == null) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={n <= value ? "size-3.5 fill-warning text-warning" : "size-3.5 text-muted-foreground"} />
      ))}
    </span>
  );
}

export default async function RestaurantReviewsPage() {
  const { supabase } = await getRestaurantContext();

  const { data: reviews } = await supabase
    .from("ratings")
    .select("id, delivery_rating, food_rating, system_rating, comment, order:orders(order_date, company:companies(name))")
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<ReviewRow[]>();

  const rows = reviews ?? [];
  const foodValues = rows.map((r) => r.food_rating).filter((v): v is number => v != null);
  const avgFood = foodValues.length ? (foodValues.reduce((s, v) => s + v, 0) / foodValues.length).toFixed(1) : "—";

  return (
    <div>
      <PageHeader title="Recenzije" description="Ocene tvog restorana od strane firmi koje naručuju." />

      <div className="mb-8">
        <StatCard label="Prosečna ocena hrane" value={avgFood} icon={Star} className="max-w-xs" />
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={MessageSquareText} title="Još nema recenzija" />
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <Card key={r.id}>
              <CardContent className="space-y-2 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium">{r.order?.company?.name ?? "Firma"}</span>
                  <span className="text-xs text-muted-foreground">
                    {r.order ? formatDateSr(r.order.order_date) : ""}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs">
                  <span>Dostava: <Stars value={r.delivery_rating} /></span>
                  <span>Hrana: <Stars value={r.food_rating} /></span>
                  <span>Sistem: <Stars value={r.system_rating} /></span>
                </div>
                {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
