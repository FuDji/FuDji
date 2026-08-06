import { getCompanyContext } from "./data";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/orders/status-badge";
import { PAYMENT_TYPE_LABELS } from "@/lib/constants";
import { formatMoney, todayKey } from "@/lib/utils";
import { UsersRound, Wallet, ReceiptText, CalendarClock } from "lucide-react";
import type { Order } from "@/types";

type OrderRow = Order & {
  employee: { full_name: string | null } | null;
  restaurant: { name: string } | null;
};

export default async function CompanyOverviewPage() {
  const { supabase, company } = await getCompanyContext();
  const today = todayKey();

  const [{ count: employeeCount }, { data: todayOrders }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("company_id", company.id)
      .eq("role", "employee")
      .eq("active", true),
    supabase
      .from("orders")
      .select("*, employee:profiles(full_name), restaurant:restaurants(name)")
      .eq("company_id", company.id)
      .eq("order_date", today)
      .order("created_at", { ascending: false })
      .returns<OrderRow[]>(),
  ]);

  const spendToday = (todayOrders ?? []).reduce((sum, o) => sum + o.company_covered, 0);

  return (
    <div>
      <PageHeader title="Pregled" description={company.name} />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Aktivni zaposleni" value={employeeCount ?? 0} icon={UsersRound} />
        <StatCard label="Narudžbine danas" value={todayOrders?.length ?? 0} icon={ReceiptText} />
        <StatCard label="Trošak firme danas" value={formatMoney(spendToday)} icon={Wallet} tone="success" />
        <StatCard
          label="Rok za naručivanje"
          value={company.cutoff_time.slice(0, 5)}
          icon={CalendarClock}
        />
      </div>

      <Card className="mb-8">
        <CardContent className="grid gap-4 py-6 sm:grid-cols-3">
          <div>
            <div className="text-xs text-muted-foreground">Način plaćanja</div>
            <div className="mt-1 font-medium">{PAYMENT_TYPE_LABELS[company.payment_type]}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Dnevni budžet po zaposlenom</div>
            <div className="mt-1 font-medium">{formatMoney(company.daily_budget)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Termin dostave</div>
            <div className="mt-1 font-medium">
              {company.delivery_time.slice(0, 5)} (±{company.delivery_tolerance_minutes} min)
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="mb-3 text-lg font-semibold">Narudžbine danas</h2>
      {!todayOrders || todayOrders.length === 0 ? (
        <p className="text-sm text-muted-foreground">Još nema narudžbina za danas.</p>
      ) : (
        <div className="space-y-2">
          {todayOrders.map((o) => (
            <Card key={o.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div>
                  <span className="font-medium">{o.employee?.full_name}</span>
                  <span className="ml-2 text-sm text-muted-foreground">{o.restaurant?.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{formatMoney(o.subtotal)}</span>
                  <OrderStatusBadge status={o.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
