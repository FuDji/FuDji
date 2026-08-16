"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";

import { acceptInvite, type FormState } from "@/app/(auth)/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/auth/submit-button";

export function AcceptInviteForm({ token }: { token: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(acceptInvite, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div className="space-y-1.5">
        <Label htmlFor="password">Lozinka</Label>
        <Input id="password" name="password" type="password" placeholder="••••••••" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Potvrdi lozinku</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required />
      </div>

      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {state.error}
        </div>
      )}

      <SubmitButton>Aktiviraj nalog</SubmitButton>
    </form>
  );
}
