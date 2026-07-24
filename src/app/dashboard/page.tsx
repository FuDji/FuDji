import { Building2, QrCode, Wrench, Package, BookOpenText } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getDashboardStats } from "@/lib/data/dashboard";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

export default async function DashboardPage() {
  const { supabase, user } = await requireUser();
  const stats = await getDashboardStats(supabase, user.id);

  const fullName = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "tamo";

  return (
    <AppShell
      active="dashboard"
      user={{ name: fullName, email: user.email ?? "", avatarUrl: user.user_metadata?.avatar_url }}
    >
      <PageHeader
        title={`Dobrodošao/la nazad, ${fullName.split(" ")[0]}`}
        description="Evo šta se dešava na tvojim apartmanima."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Ukupno apartmana" value={stats.totalApartments} icon={Building2} tone="primary" />
        <StatCard
          label="Otvoreno održavanje"
          value={stats.openMaintenance}
          icon={Wrench}
          tone={stats.openMaintenance > 0 ? "warning" : "success"}
        />
        <StatCard
          label="Upozorenja inventara"
          value={stats.inventoryAlerts}
          icon={Package}
          tone={stats.inventoryAlerts > 0 ? "destructive" : "success"}
        />
        <StatCard label="QR kodovi" value={stats.totalQrCodes} icon={QrCode} tone="primary" />
        <StatCard
          label="Pregledi vodiča (7d)"
          value={stats.guideViews7d}
          icon={BookOpenText}
          tone="success"
          className="col-span-2 lg:col-span-1"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityChart data={stats.scanTrend} />
        </div>
        <QuickActions />
      </div>

      <div className="mt-6">
        <ActivityFeed items={stats.recentActivity} />
      </div>
    </AppShell>
  );
}
