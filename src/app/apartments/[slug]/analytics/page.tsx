import { notFound } from "next/navigation";
import { ScanLine, Eye, Timer, AlertTriangle, QrCode, BookOpenText, PackageX } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getOwnedApartment } from "@/lib/data/apartments";
import { getApartmentAnalytics } from "@/lib/data/analytics";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { EmptyState } from "@/components/layout/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaintenanceChart } from "@/components/analytics/maintenance-chart";
import { ScanHeatmap } from "@/components/analytics/scan-heatmap";
import { MAINTENANCE_CATEGORIES } from "@/lib/constants";
import { DynamicIcon } from "@/lib/icon-map";
import { InventoryStatusBadge } from "@/components/inventory/status-badge";

export default async function AnalyticsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, user } = await requireUser();
  const apartment = await getOwnedApartment(supabase, slug, user.id);
  if (!apartment) notFound();

  const data = await getApartmentAnalytics(supabase, apartment.id);

  return (
    <div>
      <PageHeader title="Analytics" description="How guests actually use your apartment — no booking data here." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total QR scans" value={data.totalScans} icon={ScanLine} />
        <StatCard label="Guide views" value={data.totalViews} icon={Eye} tone="success" />
        <StatCard
          label="Avg. repair time"
          value={data.avgRepairHours > 0 ? `${data.avgRepairHours}h` : "—"}
          icon={Timer}
          tone="warning"
        />
        <StatCard
          label="Most problematic room"
          value={data.mostProblematicRoom?.name ?? "—"}
          icon={AlertTriangle}
          tone={data.mostProblematicRoom ? "destructive" : "success"}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <MaintenanceChart data={data.monthlyMaintenance} />
        <ScanHeatmap data={data.heatmap} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most scanned QR codes</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            {data.topQrCodes.length === 0 ? (
              <EmptyState icon={QrCode} title="No scans yet" className="border-none py-6" />
            ) : (
              <ul className="space-y-1">
                {data.topQrCodes.map((qr) => (
                  <li key={qr.id} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm">
                    <span className="truncate">{qr.label}</span>
                    <span className="text-muted-foreground">{qr.scan_count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most viewed guides</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            {data.topGuides.length === 0 ? (
              <EmptyState icon={BookOpenText} title="No views yet" className="border-none py-6" />
            ) : (
              <ul className="space-y-1">
                {data.topGuides.map((section) => (
                  <li key={section.id} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm">
                    <span className="truncate">{section.title}</span>
                    <span className="text-muted-foreground">{section.view_count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inventory losses</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            {data.inventoryAlerts.length === 0 ? (
              <EmptyState icon={PackageX} title="Nothing missing or broken" className="border-none py-6" />
            ) : (
              <ul className="space-y-1">
                {data.inventoryAlerts.slice(0, 6).map((item) => (
                  <li key={item.id} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm">
                    <span className="truncate">{item.name}</span>
                    <InventoryStatusBadge status={item.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Maintenance by category</CardTitle>
          <p className="text-sm text-muted-foreground">Last 90 days</p>
        </CardHeader>
        <CardContent className="pb-6">
          {data.categoryBreakdown.length === 0 ? (
            <EmptyState icon={AlertTriangle} title="No maintenance data yet" className="border-none py-6" />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {data.categoryBreakdown.map(({ category, count }) => {
                const meta = MAINTENANCE_CATEGORIES.find((c) => c.value === category);
                return (
                  <div key={category} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-warning/10 text-warning">
                      <DynamicIcon name={meta?.icon} className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{meta?.label ?? category}</p>
                      <p className="text-xs text-muted-foreground">{count} issue{count === 1 ? "" : "s"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
