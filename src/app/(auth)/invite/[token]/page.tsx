import Link from "next/link";
import { XCircle } from "lucide-react";

import { createAdminClient } from "@/lib/supabase/admin";
import { AcceptInviteForm } from "@/components/auth/accept-invite-form";
import { ROLE_LABELS } from "@/lib/constants";
import type { Invitation } from "@/types";

type InviteWithOrg = Invitation & {
  company: { name: string } | null;
  restaurant: { name: string } | null;
};

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: invite } = await admin
    .from("invitations")
    .select("*, company:companies(name), restaurant:restaurants(name)")
    .eq("token", token)
    .maybeSingle()
    .returns<InviteWithOrg>();

  if (!invite || invite.status !== "pending") {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <XCircle className="size-6" />
        </div>
        <h1 className="text-xl font-semibold">Pozivnica nije važeća</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ovaj link za pozivnicu je istekao ili je već iskorišćen. Zatraži novu pozivnicu.
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm text-primary hover:underline">
          Nazad na prijavu
        </Link>
      </div>
    );
  }

  const org = invite.company?.name ?? invite.restaurant?.name;

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold">Dobrodošao/la, {invite.full_name}!</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pozvan/a si kao <strong>{ROLE_LABELS[invite.role]}</strong>
          {org ? (
            <>
              {" "}
              za <strong>{org}</strong>
            </>
          ) : null}
          . Postavi lozinku da aktiviraš nalog ({invite.email}).
        </p>
      </div>
      <AcceptInviteForm token={invite.token} />
    </div>
  );
}
