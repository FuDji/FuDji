import { getCompanyContext } from "@/app/company/data";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PLATFORM_FEE_PER_MEAL } from "@/lib/constants";
import { formatMoney, formatDateSr, toDateKey, addDays } from "@/lib/utils";
import { FileText, ReceiptText, UtensilsCrossed, Wallet } from "lucide-react";
import type { Order } from "@/types";

type InvoiceOrderRow = Order & { restaurant: { name: string } | null };

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { supabase, company } = await getCompanyContext();
  const params = await searchParams;

  const to = params.to || toDateKey(new Date());
  const from = params.from || toDateKey(addDays(new Date(), -30));

  const { data: orders } = await supabase
    .from("orders")
    .select("*, restaurant:restaurants(name)")
    .eq("company_id", company.id)
    .gte("order_date", from)
    .lte("order_date", to)
    .in("status", ["delivered", "picked_up", "ready", "preparing", "accepted"])
    .order("order_date", { ascending: false })
    .returns<InvoiceOrderRow[]>();

  const rows = orders ?? [];
  const foodCost = rows.reduce((s, o) => s + o.company_covered, 0);
  const platformFees = rows.length * PLATFORM_FEE_PER_MEAL;
  const total = foodCost + platformFees;

  const byDate = new Map<string, { count: number; foodCost: number }>();
  for (const o of rows) {
    const existing = byDate.get(o.order_date) ?? { count: 0, foodCost: 0 };
    existing.count += 1;
    existing.foodCost += o.company_covered;
    byDate.set(o.order_date, existing);
  }
  const dailyRows = [...byDate.entries()].sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div>
      <PageHeader
        title="Fakture"
        description="Šta firma duguje Prime Bite-u za izabrani period: hrana + taksa platforme."
      />

      <form className="mb-6 flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="from">Od</Label>
          <Input id="from" name="from" type="date" defaultValue={from} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="to">Do</Label>
          <Input id="to" name="to" type="date" defaultValue={to} />
        </div>
        <Button type="submit" variant="secondary">
          Filtriraj
        </Button>
      </form>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Trošak hrane" value={formatMoney(foodCost)} icon={UtensilsCrossed} />
        <StatCard
          label={`Taksa platforme (${rows.length} × ${PLATFORM_FEE_PER_MEAL} RSD)`}
          value={formatMoney(platformFees)}
          icon={ReceiptText}
        />
        <StatCard label="Ukupno za uplatu" value={formatMoney(total)} icon={Wallet} tone="success" />
      </div>

      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <FileText className="size-4" /> Pregled po danu
      </h2>
      {dailyRows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nema narudžbina u izabranom periodu.</p>
      ) : (
        <div className="space-y-2">
          {dailyRows.map(([date, r]) => (
            <Card key={date}>
              <CardContent className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{formatDateSr(date)}</div>
                  <div className="text-xs text-muted-foreground">{r.count} obroka</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatMoney(r.foodCost + r.count * PLATFORM_FEE_PER_MEAL)}</div>
                  <div className="text-xs text-muted-foreground">
                    hrana: {formatMoney(r.foodCost)} · taksa: {formatMoney(r.count * PLATFORM_FEE_PER_MEAL)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
