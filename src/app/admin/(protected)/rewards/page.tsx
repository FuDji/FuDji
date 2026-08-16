import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { RewardDialog } from "@/components/admin/reward-dialog";
import { StatusToggle } from "@/components/admin/status-toggle";
import { toggleRewardActive } from "@/app/admin/actions";
import { REWARD_TYPE_LABELS } from "@/lib/constants";
import { Gift } from "lucide-react";

export default async function AdminRewardsPage() {
  const { supabase } = await requireRole("admin");

  const { data: rewards } = await supabase.from("loyalty_rewards").select("*").order("points_cost");

  return (
    <div>
      <PageHeader title="Nagrade" description="Reward store — isto za sve korisnike." actions={<RewardDialog />} />

      {!rewards || rewards.length === 0 ? (
        <EmptyState icon={Gift} title="Nema dodatih nagrada" />
      ) : (
        <div className="space-y-2">
          {rewards.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {REWARD_TYPE_LABELS[r.reward_type]} · {r.points_cost} poena
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusToggle active={r.active} onToggle={toggleRewardActive.bind(null, r.id)} />
                  <RewardDialog reward={r} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
