import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { EmptyState } from "@/components/layout/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { LoyaltyRateForm } from "@/components/admin/loyalty-rate-form";
import { Award, Flame, UsersRound } from "lucide-react";

type EmployeeRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  loyalty_points: number;
  company: { name: string } | null;
};

export default async function AdminLoyaltyPage() {
  const { supabase } = await requireRole("admin");

  const [{ data: settings }, { data: employees }] = await Promise.all([
    supabase.from("platform_settings").select("loyalty_rsd_per_point").eq("id", true).single(),
    supabase
      .from("profiles")
      .select("id, full_name, email, loyalty_points, company:companies(name)")
      .eq("role", "employee")
      .eq("active", true)
      .order("loyalty_points", { ascending: false })
      .returns<EmployeeRow[]>(),
  ]);

  const rsdPerPoint = settings?.loyalty_rsd_per_point ?? 100;
  const rows = employees ?? [];
  const totalPoints = rows.reduce((s, e) => s + e.loyalty_points, 0);

  return (
    <div>
      <PageHeader
        title="Loyalty poeni"
        description="Koliko poena ima svaki zaposleni i po kom kursu se poeni zarađuju."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatCard label="Ukupno poena u opticaju" value={totalPoints} icon={Flame} tone="warning" />
        <StatCard label="Zaposleni sa poenima" value={rows.length} icon={UsersRound} />
      </div>

      <div className="mb-8">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Award className="size-4" /> Kurs zarade
        </h2>
        <LoyaltyRateForm rsdPerPoint={rsdPerPoint} />
      </div>

      <h2 className="mb-3 text-lg font-semibold">Poeni po zaposlenom</h2>
      {rows.length === 0 ? (
        <EmptyState icon={Flame} title="Još niko nema loyalty poene" />
      ) : (
        <div className="space-y-2">
          {rows.map((e) => (
            <Card key={e.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{e.full_name ?? e.email}</div>
                  <div className="text-xs text-muted-foreground">{e.company?.name ?? "Bez firme"}</div>
                </div>
                <span className="font-semibold text-primary">{e.loyalty_points} poena</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
