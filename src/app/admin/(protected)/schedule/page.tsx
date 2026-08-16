import Link from "next/link";

import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { ScheduleEditor } from "@/components/admin/schedule-editor";
import { cn, toDateKey, addDays } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

export default async function AdminSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ restaurant?: string }>;
}) {
  const { supabase } = await requireRole("admin");
  const params = await searchParams;

  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("id, name")
    .eq("status", "active")
    .order("name");

  if (!restaurants || restaurants.length === 0) {
    return (
      <div>
        <PageHeader title="Nedeljni plan" description="Definiši koji restorani rade koji dan." />
        <EmptyState icon={CalendarDays} title="Prvo dodaj bar jedan aktivan restoran" />
      </div>
    );
  }

  const selectedId = params.restaurant && restaurants.some((r) => r.id === params.restaurant)
    ? params.restaurant
    : restaurants[0].id;

  const days = Array.from({ length: 14 }, (_, i) => toDateKey(addDays(new Date(), i)));

  const { data: schedule } = await supabase
    .from("restaurant_schedule")
    .select("*")
    .eq("restaurant_id", selectedId)
    .in("date", days);

  return (
    <div>
      <PageHeader
        title="Nedeljni plan"
        description="Definiši koji restorani rade koji dan — minimum nedelju dana unapred."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {restaurants.map((r) => (
          <Link
            key={r.id}
            href={`/admin/schedule?restaurant=${r.id}`}
            className={cn(
              "rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
              r.id === selectedId
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-secondary/60"
            )}
          >
            {r.name}
          </Link>
        ))}
      </div>

      <ScheduleEditor restaurantId={selectedId} days={days} schedule={schedule ?? []} />
    </div>
  );
}
