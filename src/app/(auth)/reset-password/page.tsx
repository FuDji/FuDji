"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";

import { updatePassword, type FormState } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/auth/submit-button";

export default function ResetPasswordPage() {
  const [state, formAction] = useActionState<FormState, FormData>(
    updatePassword.bind(null, undefined),
    undefined
  );

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold">Postavi novu lozinku</h1>
        <p className="mt-1 text-sm text-muted-foreground">Neka bude jaka i lako pamtljiva</p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password">Nova lozinka</Label>
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

        <SubmitButton>Ažuriraj lozinku</SubmitButton>
      </form>
    </div>
  );
}
