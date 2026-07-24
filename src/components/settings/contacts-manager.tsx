"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addEmergencyContact, removeEmergencyContact } from "@/app/apartments/actions";
import type { EmergencyContact } from "@/types";

export function ContactsManager({ apartmentId, contacts }: { apartmentId: string; contacts: EmergencyContact[] }) {
  const [label, setLabel] = useState("");
  const [phone, setPhone] = useState("");
  const [pending, startTransition] = useTransition();

  function add() {
    if (!label.trim() || !phone.trim()) return;
    startTransition(async () => {
      await addEmergencyContact(apartmentId, label, phone);
      setLabel("");
      setPhone("");
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Hitni kontakti</CardTitle>
        <CardDescription>Policija, hitna pomoć, vlasnik, upravnik zgrade…</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {contacts.map((contact) => (
          <div key={contact.id} className="flex items-center justify-between rounded-xl border border-border p-3">
            <div>
              <p className="text-sm font-medium">{contact.label}</p>
              <p className="text-xs text-muted-foreground">{contact.phone}</p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={pending}
              onClick={() => startTransition(() => removeEmergencyContact(contact.id))}
            >
              <Trash2 className="size-3.5 text-destructive" />
            </Button>
          </div>
        ))}
        <div className="flex items-end gap-2 pt-2">
          <div className="flex-1 space-y-1.5">
            <Input placeholder="Naziv (npr. Policija)" value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <div className="flex-1 space-y-1.5">
            <Input placeholder="Broj telefona" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Button onClick={add} disabled={pending || !label.trim() || !phone.trim()}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Dodaj
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
