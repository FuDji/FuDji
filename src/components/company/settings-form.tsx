"use client";

import { useActionState, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { updateCompanySettings, type ActionState } from "@/app/company/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubmitButton } from "@/components/auth/submit-button";
import { PAYMENT_TYPE_LABELS } from "@/lib/constants";
import type { Company } from "@/types";

export function CompanySettingsForm({ company }: { company: Company }) {
  const [state, formAction] = useActionState<ActionState, FormData>(updateCompanySettings, undefined);
  const [paymentType, setPaymentType] = useState(company.payment_type);

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <input type="hidden" name="payment_type" value={paymentType} />

      <div className="space-y-1.5">
        <Label htmlFor="name">Naziv firme</Label>
        <Input id="name" name="name" defaultValue={company.name} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="address">Adresa</Label>
          <Input id="address" name="address" defaultValue={company.address ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact_phone">Telefon</Label>
          <Input id="contact_phone" name="contact_phone" defaultValue={company.contact_phone ?? ""} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact_email">Kontakt email</Label>
        <Input id="contact_email" name="contact_email" type="email" defaultValue={company.contact_email ?? ""} />
      </div>

      <div className="space-y-1.5">
        <Label>Način plaćanja</Label>
        <Select value={paymentType} onValueChange={(v) => setPaymentType(v as typeof paymentType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PAYMENT_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="daily_budget">Dnevni budžet po zaposlenom (RSD)</Label>
          <Input id="daily_budget" name="daily_budget" type="number" defaultValue={company.daily_budget} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="monthly_budget">Mesečni budžet (opciono)</Label>
          <Input id="monthly_budget" name="monthly_budget" type="number" defaultValue={company.monthly_budget ?? ""} />
        </div>
      </div>

      {paymentType === "mixed" && (
        <div className="space-y-1.5">
          <Label htmlFor="mixed_cap">Firma pokriva do (RSD po obroku)</Label>
          <Input id="mixed_cap" name="mixed_cap" type="number" defaultValue={company.mixed_cap ?? ""} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="cutoff_time_readonly">Rok za naručivanje</Label>
          <Input id="cutoff_time_readonly" value={company.cutoff_time.slice(0, 5)} disabled />
          <p className="text-xs text-muted-foreground">Menja samo administrator.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="delivery_time">Termin dostave</Label>
          <Input id="delivery_time" name="delivery_time" type="time" defaultValue={company.delivery_time.slice(0, 5)} required />
          <p className="text-xs text-muted-foreground">Mora biti bar 1h posle roka za naručivanje.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="delivery_tolerance_minutes">Tolerancija (min)</Label>
          <Input
            id="delivery_tolerance_minutes"
            name="delivery_tolerance_minutes"
            type="number"
            defaultValue={company.delivery_tolerance_minutes}
            required
          />
        </div>
      </div>

      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
          <CheckCircle2 className="size-4 shrink-0" />
          Sačuvano.
        </div>
      )}

      <SubmitButton className="w-fit">Sačuvaj podešavanja</SubmitButton>
    </form>
  );
}
