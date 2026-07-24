import { requireUser } from "@/lib/auth";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { ApartmentForm } from "@/components/apartments/apartment-form";
import { createApartment } from "@/app/apartments/actions";

export default async function NewApartmentPage() {
  const { user } = await requireUser();
  const fullName = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "tamo";

  return (
    <AppShell active="apartments" user={{ name: fullName, email: user.email ?? "" }}>
      <PageHeader title="Novi apartman" description="Dodaj apartman i počni da praviš iskustvo za goste." />
      <div className="max-w-3xl">
        <ApartmentForm action={createApartment} submitLabel="Napravi apartman" />
      </div>
    </AppShell>
  );
}
