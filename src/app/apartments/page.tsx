import { Building2, Plus } from "lucide-react";
import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { listApartments } from "@/lib/data/apartments";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { ApartmentCard } from "@/components/apartments/apartment-card";
import { Button } from "@/components/ui/button";

export default async function ApartmentsPage() {
  const { supabase, user } = await requireUser();
  const apartments = await listApartments(supabase, user.id);
  const fullName = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "tamo";

  return (
    <AppShell active="apartments" user={{ name: fullName, email: user.email ?? "" }}>
      <PageHeader
        title="Apartmani"
        description="Upravljaj iskustvom gostiju za svaki apartman koji poseduješ."
        actions={
          <Button asChild>
            <Link href="/apartments/new">
              <Plus className="size-4" /> Novi apartman
            </Link>
          </Button>
        }
      />

      {apartments.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Još nema apartmana"
          description="Dodaj svoj prvi apartman i počni da praviš vodič za goste, uputstva po sobama i QR kodove."
          action={
            <Button asChild>
              <Link href="/apartments/new">
                <Plus className="size-4" /> Novi apartman
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {apartments.map((apartment) => (
            <ApartmentCard key={apartment.id} apartment={apartment} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
