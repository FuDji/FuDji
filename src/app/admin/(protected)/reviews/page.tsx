import { requireRole } from "@/lib/auth";
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
  created_at: string;
  employee: { full_name: string | null } | null;
  order: {
    order_date: string;
    restaurant: { name: string } | null;
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

export default async function AdminReviewsPage() {
  const { supabase } = await requireRole("admin");

  const { data: reviews } = await supabase
    .from("ratings")
    .select(
      "*, employee:profiles(full_name), order:orders(order_date, restaurant:restaurants(name), company:companies(name))"
    )
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<ReviewRow[]>();

  const rows = reviews ?? [];
  const avg = (key: "delivery_rating" | "food_rating" | "system_rating") => {
    const values = rows.map((r) => r[key]).filter((v): v is number => v != null);
    if (values.length === 0) return "—";
    return (values.reduce((s, v) => s + v, 0) / values.length).toFixed(1);
  };

  return (
    <div>
      <PageHeader title="Recenzije" description="Sve ocene i komentari zaposlenih, po restoranu i firmi." />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Prosek — dostava" value={avg("delivery_rating")} icon={Star} />
        <StatCard label="Prosek — hrana" value={avg("food_rating")} icon={Star} />
        <StatCard label="Prosek — sistem" value={avg("system_rating")} icon={Star} />
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={MessageSquareText} title="Još nema recenzija" />
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <Card key={r.id}>
              <CardContent className="space-y-2 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm">
                    <span className="font-medium">{r.order?.restaurant?.name}</span>
                    <span className="text-muted-foreground"> · {r.order?.company?.name}</span>
                    <span className="text-muted-foreground"> · {r.employee?.full_name}</span>
                  </div>
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
