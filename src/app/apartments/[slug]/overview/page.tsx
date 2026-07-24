import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DoorOpen,
  BookOpenText,
  Package,
  Wrench,
  QrCode,
  Eye,
  MapPin,
  ImageOff,
  ArrowUpRight,
} from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getOwnedApartment } from "@/lib/data/apartments";
import { getApartmentOverview } from "@/lib/data/overview";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { EmptyState } from "@/components/layout/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge, StatusBadge } from "@/components/maintenance/badges";
import { formatRelativeTime } from "@/lib/utils";

export default async function ApartmentOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { supabase, user } = await requireUser();
  const apartment = await getOwnedApartment(supabase, slug, user.id);
  if (!apartment) notFound();

  const overview = await getApartmentOverview(supabase, apartment.id);

  return (
    <div>
      <PageHeader title="Pregled" description="Brz uvid u to kako posluje ovaj apartman." />

      <Card className="mb-6 overflow-hidden py-0">
        <div className="relative h-48 w-full bg-secondary sm:h-64">
          {apartment.hero_image_url ? (
            <Image src={apartment.hero_image_url} alt={apartment.name} fill className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ImageOff className="size-8" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">{apartment.name}</h2>
              {(apartment.city || apartment.country) && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                  <MapPin className="size-3.5" />
                  {[apartment.address, apartment.city, apartment.country].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
            <Badge variant={apartment.status === "active" ? "success" : "secondary"}>
              {apartment.status === "active" ? "aktivan" : apartment.status === "draft" ? "nacrt" : "arhiviran"}
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Sobe" value={overview.roomCount} icon={DoorOpen} />
        <StatCard label="Sekcije vodiča" value={overview.guideSectionCount} icon={BookOpenText} tone="success" />
        <StatCard
          label="Upozorenja inventara"
          value={overview.inventoryAlertCount}
          icon={Package}
          tone={overview.inventoryAlertCount > 0 ? "destructive" : "success"}
        />
        <StatCard
          label="Otvoreno održavanje"
          value={overview.openMaintenanceCount}
          icon={Wrench}
          tone={overview.openMaintenanceCount > 0 ? "warning" : "success"}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Poslednje održavanje</CardTitle>
            <Link
              href={`/apartments/${slug}/maintenance`}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Pogledaj sve <ArrowUpRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {overview.latestMaintenance.length === 0 ? (
              <EmptyState icon={Wrench} title="Nema prijavljenih problema" className="border-none py-8" />
            ) : (
              <ul className="space-y-1">
                {overview.latestMaintenance.map((issue) => (
                  <li
                    key={issue.id}
                    className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 hover:bg-secondary/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm">{issue.title}</p>
                      <p className="text-xs text-muted-foreground">{formatRelativeTime(issue.created_at)}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <PriorityBadge priority={issue.priority} />
                      <StatusBadge status={issue.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Najskeniraniji QR kodovi</CardTitle>
            <Link
              href={`/apartments/${slug}/qr-codes`}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Pogledaj sve <ArrowUpRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {overview.topQrCodes.length === 0 ? (
              <EmptyState icon={QrCode} title="Još nema QR kodova" className="border-none py-8" />
            ) : (
              <ul className="space-y-1">
                {overview.topQrCodes.map((qr) => (
                  <li
                    key={qr.id}
                    className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 hover:bg-secondary/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <QrCode className="size-4" />
                      </div>
                      <span className="text-sm">{qr.label}</span>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{qr.scan_count} skeniranja</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Najgledanije stranice za goste</CardTitle>
            <Link
              href={`/apartments/${slug}/guide`}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Uredi vodič <ArrowUpRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {overview.topGuides.length === 0 ? (
              <EmptyState icon={Eye} title="Još nema pregleda vodiča" className="border-none py-8" />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {overview.topGuides.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5"
                  >
                    <span className="text-sm">{section.title}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="size-3.5" /> {section.view_count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
