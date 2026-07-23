import { requireUser } from "@/lib/auth";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { ApartmentForm } from "@/components/apartments/apartment-form";
import { createApartment } from "@/app/apartments/actions";

export default async function NewApartmentPage() {
  const { user } = await requireUser();
  const fullName = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "there";

  return (
    <AppShell active="apartments" user={{ name: fullName, email: user.email ?? "" }}>
      <PageHeader title="New apartment" description="Add a property to start building its guest experience." />
      <div className="max-w-3xl">
        <ApartmentForm action={createApartment} submitLabel="Create apartment" />
      </div>
    </AppShell>
  );
}
