import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { StatCard } from "@/components/layout/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { RedeemButton } from "@/components/app/redeem-button";
import { REWARD_TYPE_LABELS } from "@/lib/constants";
import { Flame, Gift } from "lucide-react";

export default async function RewardsPage() {
  const { supabase, profile } = await requireRole("employee");

  const { data: rewards } = await supabase
    .from("loyalty_rewards")
    .select("*")
    .eq("active", true)
    .order("points_cost", { ascending: true });

  return (
    <div>
      <PageHeader title="Nagrade" description="Iskoristi loyalty poene za besplatne obroke i pića." />

      <div className="mb-8">
        <StatCard label="Tvoji poeni" value={profile.loyalty_points} icon={Flame} tone="warning" className="max-w-xs" />
      </div>

      {!rewards || rewards.length === 0 ? (
        <EmptyState icon={Gift} title="Trenutno nema dostupnih nagrada" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rewards.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex items-start justify-between gap-3 pt-6">
                <div>
                  <div className="text-xs font-medium text-muted-foreground">{REWARD_TYPE_LABELS[r.reward_type]}</div>
                  <div className="mt-1 font-medium">{r.title}</div>
                  {r.description && <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>}
                  <div className="mt-2 text-sm font-semibold text-primary">{r.points_cost} poena</div>
                </div>
                <RedeemButton rewardId={r.id} disabled={profile.loyalty_points < r.points_cost} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
