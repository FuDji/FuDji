import { requireProfile } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function CompanyProfilePage() {
  const { profile } = await requireProfile("company");

  return (
    <div>
      <PageHeader title="Profil" description="Tvoji lični podaci i lozinka." />
      <ProfileForm profile={profile} scope="company" />
    </div>
  );
}
