"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";

import type { Apartment } from "@/types";
import type { FormState } from "@/app/apartments/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/auth/submit-button";

export function ApartmentForm({
  action,
  defaultValues,
  submitLabel = "Napravi apartman",
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  defaultValues?: Partial<Apartment>;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Osnovno</CardTitle>
          <CardDescription>Ono što gosti i tvoj tim prvo vide.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="name">Naziv apartmana</Label>
            <Input id="name" name="name" placeholder="Sunčani Studio" defaultValue={defaultValues?.name} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="logo_url">URL logotipa</Label>
            <Input id="logo_url" name="logo_url" placeholder="https://…" defaultValue={defaultValues?.logo_url ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hero_image_url">URL naslovne slike</Label>
            <Input
              id="hero_image_url"
              name="hero_image_url"
              placeholder="https://…"
              defaultValue={defaultValues?.hero_image_url ?? ""}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="description">Opis</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Sunčani stan u srcu starog grada…"
              defaultValue={defaultValues?.description ?? ""}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lokacija</CardTitle>
          <CardDescription>Koristi se u vodiču za goste i na mapama.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="address">Adresa</Label>
            <Input id="address" name="address" defaultValue={defaultValues?.address ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city">Grad</Label>
            <Input id="city" name="city" defaultValue={defaultValues?.city ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="country">Država</Label>
            <Input id="country" name="country" defaultValue={defaultValues?.country ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lat">Geografska širina</Label>
            <Input id="lat" name="lat" type="number" step="any" defaultValue={defaultValues?.lat ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lng">Geografska dužina</Label>
            <Input id="lng" name="lng" type="number" step="any" defaultValue={defaultValues?.lng ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kontakt i pristup</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" name="phone" defaultValue={defaultValues?.phone ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={defaultValues?.email ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="check_in_time">Vreme prijave</Label>
            <Input id="check_in_time" name="check_in_time" type="time" defaultValue={defaultValues?.check_in_time ?? "15:00"} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="check_out_time">Vreme odjave</Label>
            <Input id="check_out_time" name="check_out_time" type="time" defaultValue={defaultValues?.check_out_time ?? "11:00"} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">WiFi i parking</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="wifi_name">Naziv WiFi mreže</Label>
            <Input id="wifi_name" name="wifi_name" defaultValue={defaultValues?.wifi_name ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wifi_password">WiFi lozinka</Label>
            <Input id="wifi_password" name="wifi_password" defaultValue={defaultValues?.wifi_password ?? ""} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="parking_info">Uputstvo za parking</Label>
            <Textarea id="parking_info" name="parking_info" rows={2} defaultValue={defaultValues?.parking_info ?? ""} />
          </div>
        </CardContent>
      </Card>

      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {state.error}
        </div>
      )}

      <div className="flex justify-end">
        <SubmitButton className="w-auto px-8">{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
