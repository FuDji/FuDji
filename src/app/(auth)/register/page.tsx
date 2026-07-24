"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertCircle } from "lucide-react";

import { signUp, type FormState } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/auth/submit-button";

export default function RegisterPage() {
  const [state, formAction] = useActionState<FormState, FormData>(signUp, undefined);

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold">Napravi nalog</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Počni da upravljaš svojim smeštajima za par minuta
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Ime i prezime</Label>
          <Input id="fullName" name="fullName" placeholder="Jovana Jovanović" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="ti@primer.com" required />
        </div>
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

        <SubmitButton>Napravi nalog</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Već imaš nalog?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Prijavi se
        </Link>
      </p>
    </div>
  );
}
