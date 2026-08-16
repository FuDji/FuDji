import { requireProfile } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function RestaurantProfilePage() {
  const { profile } = await requireProfile("restaurant");

  return (
    <div>
      <PageHeader title="Profil" description="Tvoji lični podaci i lozinka." />
      <ProfileForm profile={profile} scope="restaurant" />
    </div>
  );
}
