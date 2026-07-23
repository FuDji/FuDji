"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteApartment } from "@/app/apartments/actions";

export function DangerZone({ apartmentId, apartmentName }: { apartmentId: string; apartmentName: string }) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-base text-destructive">Danger zone</CardTitle>
        <CardDescription>Deleting an apartment removes all its data permanently.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10" onClick={() => setOpen(true)}>
          <Trash2 className="size-4" /> Delete apartment
        </Button>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {apartmentName}?</DialogTitle>
            <DialogDescription>
              This permanently deletes the apartment, its guest guide, rooms, inventory, maintenance history and QR
              codes. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">
              Type <span className="font-medium text-foreground">{apartmentName}</span> to confirm
            </label>
            <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={confirmText !== apartmentName || pending}
              onClick={() => startTransition(() => deleteApartment(apartmentId))}
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              Delete permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
