import { requireProfile } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function EmployeeProfilePage() {
  const { profile } = await requireProfile("app");

  return (
    <div>
      <PageHeader title="Profil" description="Tvoji lični podaci i lozinka." />
      <ProfileForm profile={profile} scope="app" />
    </div>
  );
}
