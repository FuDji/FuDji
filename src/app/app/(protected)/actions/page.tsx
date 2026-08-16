import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CAMPAIGN_TYPE_LABELS } from "@/lib/constants";
import { formatDateSr, todayKey } from "@/lib/utils";
import { Megaphone } from "lucide-react";
import type { CampaignWithRestaurant } from "@/types";

export default async function ActionsPage() {
  const { supabase } = await requireRole("employee");
  const today = todayKey();

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*, restaurant:restaurants(name)")
    .eq("active", true)
    .lte("starts_at", today)
    .or(`ends_at.is.null,ends_at.gte.${today}`)
    .order("starts_at", { ascending: false })
    .returns<CampaignWithRestaurant[]>();

  return (
    <div>
      <PageHeader title="Akcije" description="Aktivne kampanje i popusti u toku." />

      {!campaigns || campaigns.length === 0 ? (
        <EmptyState icon={Megaphone} title="Trenutno nema aktivnih akcija" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <Card key={c.id} className="overflow-hidden">
              {c.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image_url} alt={c.title} className="h-32 w-full object-cover" />
              )}
              <CardContent className="pt-6">
                <div className="mb-2 flex items-center justify-between">
                  <Badge>{CAMPAIGN_TYPE_LABELS[c.campaign_type]}</Badge>
                  {c.discount_percent != null && (
                    <span className="text-sm font-semibold text-primary">-{c.discount_percent}%</span>
                  )}
                </div>
                <h3 className="font-medium">{c.title}</h3>
                {c.description && <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>}
                <div className="mt-3 text-xs text-muted-foreground">
                  {c.restaurant?.name ?? "Svi restorani"} · od {formatDateSr(c.starts_at)}
                  {c.ends_at ? ` do ${formatDateSr(c.ends_at)}` : ""}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
