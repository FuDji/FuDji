"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertCircle } from "lucide-react";

import { signIn, type FormState } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/auth/submit-button";

export default function LoginPage() {
  const [state, formAction] = useActionState<FormState, FormData>(signIn, undefined);

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold">Dobrodošli nazad</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Prijavi se na svoj Prime Bite nalog
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="ti@primer.com" required />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Lozinka</Label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline">
              Zaboravljena lozinka?
            </Link>
          </div>
          <Input id="password" name="password" type="password" placeholder="••••••••" required />
        </div>

        {state?.error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {state.error}
          </div>
        )}

        <SubmitButton>Prijavi se</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Nalog se dobija pozivnicom od tvoje firme, restorana ili administratora.
      </p>
    </div>
  );
}
