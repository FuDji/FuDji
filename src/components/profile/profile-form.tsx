"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { updateOwnProfile, type ProfileActionState } from "@/lib/actions/profile";
import { updatePassword, type FormState } from "@/app/(auth)/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/auth/submit-button";
import { ROLE_LABELS } from "@/lib/constants";
import type { Profile } from "@/types";
import type { PortalScope } from "@/lib/supabase/server";

export function ProfileForm({ profile, scope }: { profile: Profile; scope: PortalScope }) {
  const [infoState, infoAction] = useActionState<ProfileActionState, FormData>(
    updateOwnProfile.bind(null, scope),
    undefined
  );
  const [passState, passAction] = useActionState<FormState, FormData>(
    updatePassword.bind(null, scope),
    undefined
  );

  return (
    <div className="max-w-xl space-y-10">
      <section>
        <h2 className="mb-4 text-lg font-semibold">Lični podaci</h2>
        <form action={infoAction} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name_readonly">Ime i prezime</Label>
              <Input id="name_readonly" value={profile.full_name ?? ""} disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email_readonly">Email</Label>
              <Input id="email_readonly" value={profile.email ?? ""} disabled />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {ROLE_LABELS[profile.role]} · ime, email i ulogu menja samo administrator.
          </p>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Broj telefona</Label>
            <Input id="phone" name="phone" defaultValue={profile.phone ?? ""} placeholder="06x xxx xxxx" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="avatar_url">Slika profila (URL)</Label>
            <Input
              id="avatar_url"
              name="avatar_url"
              defaultValue={profile.avatar_url ?? ""}
              placeholder="https://..."
            />
          </div>

          {infoState?.error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {infoState.error}
            </div>
          )}
          {infoState?.success && (
            <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
              <CheckCircle2 className="size-4 shrink-0" />
              Sačuvano.
            </div>
          )}

          <SubmitButton className="w-fit">Sačuvaj</SubmitButton>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Promena lozinke</h2>
        <form action={passAction} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="password">Nova lozinka</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Potvrdi lozinku</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required />
          </div>

          {passState?.error && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {passState.error}
            </div>
          )}

          <SubmitButton className="w-fit">Promeni lozinku</SubmitButton>
        </form>
      </section>
    </div>
  );
}
