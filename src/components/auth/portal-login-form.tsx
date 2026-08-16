"use client";

import Link from "next/link";
import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { signInPortal, type FormState } from "@/app/(auth)/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/auth/submit-button";
import type { PortalScope } from "@/lib/supabase/server";

function DeactivatedNotice() {
  const params = useSearchParams();
  if (params.get("error") !== "account_deactivated") return null;

  return (
    <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      <AlertCircle className="size-4 shrink-0" />
      Ovaj nalog je deaktiviran. Obrati se administratoru.
    </div>
  );
}

export function PortalLoginForm({
  scope,
  title,
  description,
}: {
  scope: PortalScope;
  title: string;
  description: string;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(
    signInPortal.bind(null, scope),
    undefined
  );

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <Suspense fallback={null}>
        <DeactivatedNotice />
      </Suspense>

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
