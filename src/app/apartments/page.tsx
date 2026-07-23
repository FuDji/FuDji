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
  const fullName = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "there";

  return (
    <AppShell active="apartments" user={{ name: fullName, email: user.email ?? "" }}>
      <PageHeader
        title="Apartments"
        description="Manage the guest experience for every property you own."
        actions={
          <Button asChild>
            <Link href="/apartments/new">
              <Plus className="size-4" /> New Apartment
            </Link>
          </Button>
        }
      />

      {apartments.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No apartments yet"
          description="Add your first property to start building its guest guide, room instructions and QR codes."
          action={
            <Button asChild>
              <Link href="/apartments/new">
                <Plus className="size-4" /> New Apartment
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
