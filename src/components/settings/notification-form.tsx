"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { updateNotificationPreferences } from "@/app/apartments/actions";
import type { Database } from "@/types/database";

type Prefs = Database["public"]["Tables"]["notification_preferences"]["Row"];

const OPTIONS: { key: keyof Omit<Prefs, "apartment_id">; label: string; description: string }[] = [
  { key: "email_maintenance", label: "Ažuriranja o održavanju", description: "Novi kvarovi i promene statusa" },
  { key: "email_inventory", label: "Upozorenja o inventaru", description: "Nisko stanje, nedostajuće ili pokvarene stavke" },
  { key: "email_guest_activity", label: "Aktivnost gostiju", description: "Skeniranja QR koda i pregledi vodiča" },
  { key: "email_weekly_report", label: "Nedeljni izveštaj", description: "Rezime svakog ponedeljka" },
];

export function NotificationForm({ apartmentId, slug, prefs }: { apartmentId: string; slug: string; prefs: Prefs }) {
  const [values, setValues] = useState(prefs);
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    const formData = new FormData();
    for (const opt of OPTIONS) {
      if (values[opt.key]) formData.set(opt.key, "on");
    }
    await updateNotificationPreferences(apartmentId, slug, formData);
    setPending(false);
    toast.success("Podešavanja obaveštenja sačuvana");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Podešavanja obaveštenja</CardTitle>
        <CardDescription>Izaberi o čemu želiš da dobijaš email obaveštenja.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {OPTIONS.map((opt) => (
          <div key={opt.key} className="flex items-center justify-between rounded-xl border border-border p-3.5">
            <div>
              <p className="text-sm font-medium">{opt.label}</p>
              <p className="text-xs text-muted-foreground">{opt.description}</p>
            </div>
            <Switch
              checked={Boolean(values[opt.key])}
              onCheckedChange={(checked) => setValues((v) => ({ ...v, [opt.key]: checked }))}
            />
          </div>
        ))}
        <div className="flex justify-end">
          <Button onClick={save} disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            Sačuvaj
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
