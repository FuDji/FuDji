import { getCompanyContext } from "../data";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatMoney, toDateKey, addDays } from "@/lib/utils";
import { ReceiptText, TrendingUp, Users, Wallet } from "lucide-react";
import type { Order } from "@/types";

type OrderRow = Order & { employee: { full_name: string | null } | null };

export default async function ExpensesPage({
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
    .select("*, employee:profiles(full_name)")
    .eq("company_id", company.id)
    .gte("order_date", from)
    .lte("order_date", to)
    .neq("status", "rejected")
    .returns<OrderRow[]>();

  const totalSpend = (orders ?? []).reduce((s, o) => s + o.subtotal, 0);
  const companySpend = (orders ?? []).reduce((s, o) => s + o.company_covered, 0);
  const employeeSpend = (orders ?? []).reduce((s, o) => s + o.employee_paid, 0);

  const byEmployee = new Map<string, { name: string; count: number; total: number; companyPaid: number }>();
  for (const o of orders ?? []) {
    const key = o.employee_id;
    const existing = byEmployee.get(key) ?? {
      name: o.employee?.full_name ?? "Nepoznat",
      count: 0,
      total: 0,
      companyPaid: 0,
    };
    existing.count += 1;
    existing.total += o.subtotal;
    existing.companyPaid += o.company_covered;
    byEmployee.set(key, existing);
  }
  const rows = [...byEmployee.values()].sort((a, b) => b.total - a.total);

  return (
    <div>
      <PageHeader title="Troškovi" description="Pregled potrošnje na hranu i dostavu po periodu." />

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
        <StatCard label="Ukupna potrošnja" value={formatMoney(totalSpend)} icon={ReceiptText} />
        <StatCard label="Trošak firme" value={formatMoney(companySpend)} icon={Wallet} tone="success" />
        <StatCard label="Doplata zaposlenih" value={formatMoney(employeeSpend)} icon={TrendingUp} tone="warning" />
      </div>

      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <Users className="size-4" /> Pregled po zaposlenom
      </h2>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nema narudžbina u izabranom periodu.</p>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <Card key={r.name}>
              <CardContent className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.count} narudžbina</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatMoney(r.total)}</div>
                  <div className="text-xs text-muted-foreground">firma: {formatMoney(r.companyPaid)}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
