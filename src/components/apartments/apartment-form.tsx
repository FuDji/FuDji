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
  submitLabel = "Create apartment",
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
          <CardTitle className="text-base">Basics</CardTitle>
          <CardDescription>The essentials guests and your team will see first.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="name">Apartment name</Label>
            <Input id="name" name="name" placeholder="Sunset Loft" defaultValue={defaultValues?.name} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input id="logo_url" name="logo_url" placeholder="https://…" defaultValue={defaultValues?.logo_url ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hero_image_url">Hero image URL</Label>
            <Input
              id="hero_image_url"
              name="hero_image_url"
              placeholder="https://…"
              defaultValue={defaultValues?.hero_image_url ?? ""}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="A sun-drenched loft in the heart of the old town…"
              defaultValue={defaultValues?.description ?? ""}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Location</CardTitle>
          <CardDescription>Used on the guest guide and maps.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="address">Street address</Label>
            <Input id="address" name="address" defaultValue={defaultValues?.address ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" defaultValue={defaultValues?.city ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" defaultValue={defaultValues?.country ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lat">Latitude</Label>
            <Input id="lat" name="lat" type="number" step="any" defaultValue={defaultValues?.lat ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lng">Longitude</Label>
            <Input id="lng" name="lng" type="number" step="any" defaultValue={defaultValues?.lng ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact &amp; access</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={defaultValues?.phone ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={defaultValues?.email ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="check_in_time">Check-in time</Label>
            <Input id="check_in_time" name="check_in_time" type="time" defaultValue={defaultValues?.check_in_time ?? "15:00"} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="check_out_time">Check-out time</Label>
            <Input id="check_out_time" name="check_out_time" type="time" defaultValue={defaultValues?.check_out_time ?? "11:00"} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">WiFi &amp; parking</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="wifi_name">WiFi network name</Label>
            <Input id="wifi_name" name="wifi_name" defaultValue={defaultValues?.wifi_name ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wifi_password">WiFi password</Label>
            <Input id="wifi_password" name="wifi_password" defaultValue={defaultValues?.wifi_password ?? ""} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="parking_info">Parking instructions</Label>
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
