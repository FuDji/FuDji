"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import { deleteEmployee } from "@/app/company/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DeleteEmployeeButton({ employeeId, name }: { employeeId: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <Button size="icon-sm" variant="outline" onClick={() => setOpen(true)}>
        <Trash2 className="size-3.5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Obriši zaposlenog</DialogTitle>
            <DialogDescription>
              Da li si siguran da želiš trajno da obrišeš <strong>{name}</strong>? Nalog za prijavu
              će biti obrisan. Prethodne narudžbine ostaju sačuvane u istoriji.
            </DialogDescription>
          </DialogHeader>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={pending}>
              Otkaži
            </Button>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const result = await deleteEmployee(employeeId);
                  if (result?.error) {
                    setError(result.error);
                    return;
                  }
                  setOpen(false);
                })
              }
            >
              Obriši
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
