import Link from "next/link";

import { getEmployeeContext, getOrderForDate, getRestaurantsForDate } from "@/app/app/data";
import { PageHeader } from "@/components/layout/page-header";
import { DayOrderBuilder } from "@/components/app/day-order-builder";
import { cn, formatDateSr, isPastCutoff, toDateKey, addDays, todayKey } from "@/lib/utils";

export default async function WeeklyMenuPage({
  searchParams,
}: {
  searchParams: Promise<{ day?: string }>;
}) {
  const { supabase, user, profile, company } = await getEmployeeContext();
  const params = await searchParams;

  const { data: settings } = await supabase
    .from("platform_settings")
    .select("order_window_days")
    .eq("id", true)
    .single();

  const today = new Date();
  const windowDays = settings?.order_window_days ?? 7;
  const days = Array.from({ length: windowDays }, (_, i) => toDateKey(addDays(today, i)));
  const selectedDay = params.day && days.includes(params.day) ? params.day : todayKey();

  const [restaurants, order] = await Promise.all([
    getRestaurantsForDate(supabase, selectedDay),
    getOrderForDate(supabase, user.id, selectedDay),
  ]);

  const cutoffPassed = company ? isPastCutoff(selectedDay, company.cutoff_time) : true;
  const budget = profile.daily_budget_override ?? company?.daily_budget ?? 0;

  return (
    <div>
      <PageHeader
        title="Nedeljni meni"
        description="Naruči za bilo koji dan unapred — izmene su moguće do roka za taj dan."
      />

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {days.map((day) => (
          <Link
            key={day}
            href={`/app/menu?day=${day}`}
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

      <DayOrderBuilder
        date={selectedDay}
        restaurants={restaurants}
        existingOrder={order}
        cutoffPassed={cutoffPassed}
        cutoffTime={company?.cutoff_time ?? "10:30"}
        budget={budget}
        paymentType={company?.payment_type ?? "company_pays"}
        mixedCap={company?.mixed_cap ?? null}
      />
    </div>
  );
}
