"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { updateNotificationPreferences } from "@/app/apartments/actions";
import type { Database } from "@/types/database";

type Prefs = Database["public"]["Tables"]["notification_preferences"]["Row"];

const OPTIONS: { key: keyof Omit<Prefs, "apartment_id">; label: string; description: string }[] = [
  { key: "email_maintenance", label: "Maintenance updates", description: "New issues and status changes" },
  { key: "email_inventory", label: "Inventory alerts", description: "Low stock, missing or broken items" },
  { key: "email_guest_activity", label: "Guest activity", description: "QR scans and guide views" },
  { key: "email_weekly_report", label: "Weekly report", description: "A summary every Monday" },
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
    toast.success("Notification preferences saved");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Notification preferences</CardTitle>
        <CardDescription>Choose what you want to be emailed about.</CardDescription>
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
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
