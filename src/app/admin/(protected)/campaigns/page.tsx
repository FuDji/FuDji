import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CampaignDialog } from "@/components/admin/campaign-dialog";
import { StatusToggle } from "@/components/admin/status-toggle";
import { toggleCampaignActive } from "@/app/admin/actions";
import { CAMPAIGN_TYPE_LABELS } from "@/lib/constants";
import { formatDateSr } from "@/lib/utils";
import { Megaphone } from "lucide-react";
import type { CampaignWithRestaurant } from "@/types";

export default async function AdminCampaignsPage() {
  const { supabase } = await requireRole("admin");

  const [{ data: campaigns }, { data: restaurants }] = await Promise.all([
    supabase
      .from("campaigns")
      .select("*, restaurant:restaurants(name)")
      .order("created_at", { ascending: false })
      .returns<CampaignWithRestaurant[]>(),
    supabase.from("restaurants").select("id, name").eq("status", "active").order("name"),
  ]);

  return (
    <div>
      <PageHeader
        title="Kampanje"
        description="Taco Tuesday, popusti, gratis proizvodi — vidljivo korisnicima u sekciji Akcije."
        actions={<CampaignDialog restaurants={restaurants ?? []} />}
      />

      {!campaigns || campaigns.length === 0 ? (
        <EmptyState icon={Megaphone} title="Nema kreiranih kampanja" />
      ) : (
        <div className="space-y-2">
          {campaigns.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{c.title}</span>
                    <Badge>{CAMPAIGN_TYPE_LABELS[c.campaign_type]}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {c.restaurant?.name ?? "Svi restorani"} · od {formatDateSr(c.starts_at)}
                    {c.ends_at ? ` do ${formatDateSr(c.ends_at)}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusToggle active={c.active} onToggle={toggleCampaignActive.bind(null, c.id)} />
                  <CampaignDialog campaign={c} restaurants={restaurants ?? []} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
