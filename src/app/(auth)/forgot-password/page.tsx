"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertCircle, MailCheck } from "lucide-react";

import { requestPasswordReset, type FormState } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/auth/submit-button";

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState<FormState, FormData>(requestPasswordReset, undefined);

  if (state?.success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
          <MailCheck className="size-6" />
        </div>
        <h1 className="text-xl font-semibold">Proveri svoj email</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Poslali smo link za resetovanje lozinke na tvoj email.
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm text-primary hover:underline">
          Nazad na prijavu
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold">Resetuj lozinku</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Unesi svoj email i poslaćemo ti link za resetovanje
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="ti@primer.com" required />
        </div>

        {state?.error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {state.error}
          </div>
        )}

        <SubmitButton>Pošalji link za resetovanje</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Setio si se lozinke?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Prijavi se
        </Link>
      </p>
    </div>
  );
}
