import { requireProfile } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function AdminProfilePage() {
  const { profile } = await requireProfile("admin");

  return (
    <div>
      <PageHeader title="Profil" description="Tvoji lični podaci i lozinka." />
      <ProfileForm profile={profile} scope="admin" />
    </div>
  );
}
