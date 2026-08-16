"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";

import { updateManagedUser } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function EditManagedUserDialog({
  profileId,
  fullName,
}: {
  profileId: string;
  fullName: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(fullName ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <Button type="button" size="icon-sm" variant="outline" onClick={() => setOpen(true)}>
        <Pencil className="size-3.5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Izmeni nalog</DialogTitle>
            <DialogDescription>
              Promeni ime ili postavi novu lozinku, bez potrebe za prethodnom.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor={`edit-name-${profileId}`}>Ime i prezime</Label>
              <Input id={`edit-name-${profileId}`} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`edit-password-${profileId}`}>Nova lozinka</Label>
              <Input
                id={`edit-password-${profileId}`}
                type="password"
                placeholder="Ostavi prazno da ne menjaš"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const result = await updateManagedUser(profileId, name, password);
                  if (result?.error) {
                    setError(result.error);
                    return;
                  }
                  setError(null);
                  setPassword("");
                  setOpen(false);
                })
              }
            >
              Sačuvaj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
