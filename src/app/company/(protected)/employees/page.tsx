import { getCompanyContext } from "@/app/company/data";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InviteEmployeeDialog } from "@/components/company/invite-employee-dialog";
import { BulkUploadDialog } from "@/components/company/bulk-upload-dialog";
import { BudgetCell } from "@/components/company/budget-cell";
import { ActiveToggle } from "@/components/company/employee-row-actions";
import { RevokeInviteButton } from "@/components/company/revoke-invite-button";
import { DeleteEmployeeButton } from "@/components/company/delete-employee-button";
import { formatMoney } from "@/lib/utils";
import { UsersRound } from "lucide-react";

export default async function EmployeesPage() {
  const { supabase, company } = await getCompanyContext();

  const [{ data: employees }, { data: invitations }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("company_id", company.id)
      .eq("role", "employee")
      .order("full_name"),
    supabase
      .from("invitations")
      .select("*")
      .eq("company_id", company.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <PageHeader
        title="Zaposleni"
        description="Dodaj zaposlene pojedinačno ili masovno iz Excel fajla."
        actions={
          <div className="flex gap-2">
            <BulkUploadDialog />
            <InviteEmployeeDialog />
          </div>
        }
      />

      {invitations && invitations.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Pozivnice na čekanju</h2>
          <div className="space-y-2">
            {invitations.map((inv) => (
              <Card key={inv.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-medium">{inv.full_name}</span>
                    <span className="ml-2 text-sm text-muted-foreground">{inv.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">Na čekanju</Badge>
                    <RevokeInviteButton invitationId={inv.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-3 text-lg font-semibold">Aktivni nalozi</h2>
      {!employees || employees.length === 0 ? (
        <EmptyState icon={UsersRound} title="Još nema zaposlenih" description="Pozovi prvog zaposlenog da počne da naručuje." />
      ) : (
        <div className="space-y-2">
          {employees.map((e) => (
            <Card key={e.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <div className="font-medium">{e.full_name}</div>
                  <div className="text-sm text-muted-foreground">{e.email}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-xs text-muted-foreground">
                    <div>Poeni: {e.loyalty_points}</div>
                  </div>
                  <BudgetCell employeeId={e.id} value={e.daily_budget_override} placeholder={company.daily_budget} />
                  <ActiveToggle employeeId={e.id} active={e.active} />
                  <DeleteEmployeeButton employeeId={e.id} name={e.full_name ?? e.email ?? "zaposleni"} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Podrazumevani dnevni budžet firme: {formatMoney(company.daily_budget)}. Budžet po zaposlenom
        se koristi umesto podrazumevanog kada je postavljen.
      </p>
    </div>
  );
}
