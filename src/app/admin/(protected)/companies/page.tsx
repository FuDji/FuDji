import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompanyDialog } from "@/components/admin/company-dialog";
import { InviteOfficeManagerDialog } from "@/components/admin/invite-office-manager-dialog";
import { StatusToggle } from "@/components/admin/status-toggle";
import { ManagerSection } from "@/components/admin/manager-section";
import { toggleCompanyStatus } from "@/app/admin/actions";
import { PAYMENT_TYPE_LABELS } from "@/lib/constants";
import { formatMoney } from "@/lib/utils";
import { Store } from "lucide-react";

export default async function AdminCompaniesPage() {
  const { supabase } = await requireRole("admin");

  const [{ data: companies }, { data: managers }, { data: invitations }] = await Promise.all([
    supabase.from("companies").select("*").order("name"),
    supabase
      .from("profiles")
      .select("id, full_name, email, company_id")
      .eq("role", "office_manager")
      .eq("active", true),
    supabase
      .from("invitations")
      .select("id, email, full_name, token, company_id")
      .eq("role", "office_manager")
      .eq("status", "pending"),
  ]);

  const managerRows = managers ?? [];
  const managersByCompany = new Map<string, typeof managerRows>();
  for (const m of managerRows) {
    if (!m.company_id) continue;
    const list = managersByCompany.get(m.company_id) ?? [];
    list.push(m);
    managersByCompany.set(m.company_id, list);
  }

  const invitationRows = invitations ?? [];
  const invitesByCompany = new Map<string, typeof invitationRows>();
  for (const inv of invitationRows) {
    if (!inv.company_id) continue;
    const list = invitesByCompany.get(inv.company_id) ?? [];
    list.push(inv);
    invitesByCompany.set(inv.company_id, list);
  }

  return (
    <div>
      <PageHeader title="Firme" description="Upravljaj firmama, budžetima i tipom plaćanja." actions={<CompanyDialog />} />

      {!companies || companies.length === 0 ? (
        <EmptyState icon={Store} title="Nema dodatih firmi" />
      ) : (
        <div className="space-y-2">
          {companies.map((c) => (
            <Card key={c.id}>
              <CardContent className="py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{c.name}</span>
                      <Badge variant={c.status === "active" ? "success" : "secondary"}>
                        {c.status === "active" ? "Aktivna" : "Neaktivna"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {PAYMENT_TYPE_LABELS[c.payment_type]} · {formatMoney(c.daily_budget)}/dan · rok{" "}
                      {c.cutoff_time.slice(0, 5)} · dostava {c.delivery_time.slice(0, 5)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusToggle active={c.status === "active"} onToggle={toggleCompanyStatus.bind(null, c.id)} />
                    <InviteOfficeManagerDialog companyId={c.id} />
                    <CompanyDialog company={c} />
                  </div>
                </div>
                <ManagerSection
                  managers={managersByCompany.get(c.id) ?? []}
                  invites={invitesByCompany.get(c.id) ?? []}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
