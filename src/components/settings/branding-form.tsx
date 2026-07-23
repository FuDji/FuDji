"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateApartmentBranding } from "@/app/apartments/actions";
import type { Apartment } from "@/types";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "sr", label: "Serbian" },
];

const FONTS = ["Inter", "Manrope", "Poppins", "Sora", "Work Sans"];

export function BrandingForm({ apartment }: { apartment: Apartment }) {
  const [pending, setPending] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Branding &amp; localization</CardTitle>
        <CardDescription>How your guest-facing pages look and speak.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={async (formData) => {
            setPending(true);
            const result = await updateApartmentBranding(apartment.id, apartment.slug, formData);
            setPending(false);
            if (result?.error) toast.error(result.error);
            else toast.success("Branding updated");
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="space-y-1.5">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input id="logo_url" name="logo_url" defaultValue={apartment.logo_url ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="brand_color">Brand color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="brand_color"
                name="brand_color"
                type="color"
                defaultValue={apartment.brand_color ?? "#4F8CFF"}
                className="h-10 w-14 p-1"
              />
              <span className="text-sm text-muted-foreground">{apartment.brand_color ?? "#4F8CFF"}</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="font">Font</Label>
            <Select name="font" defaultValue={apartment.font ?? "Inter"}>
              <SelectTrigger id="font">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONTS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="language">Language</Label>
            <Select name="language" defaultValue={apartment.language ?? "en"}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="custom_domain">Custom domain</Label>
            <Input id="custom_domain" name="custom_domain" placeholder="stay.yourbrand.com" defaultValue={apartment.custom_domain ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" name="timezone" placeholder="Europe/Belgrade" defaultValue={apartment.timezone ?? "UTC"} />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              Save
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
