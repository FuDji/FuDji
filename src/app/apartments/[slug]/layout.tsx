import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getOwnedApartment } from "@/lib/data/apartments";
import { ApartmentShell } from "@/components/layout/apartment-shell";

export default async function ApartmentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { supabase, user } = await requireUser();
  const apartment = await getOwnedApartment(supabase, slug, user.id);

  if (!apartment) notFound();

  const fullName = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "tamo";

  return (
    <ApartmentShell apartment={apartment} user={{ name: fullName, email: user.email ?? "" }}>
      {children}
    </ApartmentShell>
  );
}
