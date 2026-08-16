"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";

import { submitRating } from "@/app/app/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function StarPicker({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-medium">{label}</div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => onChange(n)}>
            <Star className={cn("size-6", n <= value ? "fill-warning text-warning" : "text-muted-foreground")} />
          </button>
        ))}
      </div>
    </div>
  );
}

export function RatingDialog({
  orderId,
  mandatory = false,
  restaurantName,
}: {
  orderId: string;
  mandatory?: boolean;
  restaurantName?: string;
}) {
  const [open, setOpen] = useState(mandatory);
  const [delivery, setDelivery] = useState(5);
  const [food, setFood] = useState(5);
  const [system, setSystem] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!comment.trim()) {
      setError("Ostavi kratak komentar uz ocenu.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await submitRating(orderId, delivery, food, system, comment);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (mandatory && !next ? null : setOpen(next))}>
      {!mandatory && (
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm">
            Oceni
          </Button>
        </DialogTrigger>
      )}
      <DialogContent
        showCloseButton={!mandatory}
        onInteractOutside={mandatory ? (e) => e.preventDefault() : undefined}
        onEscapeKeyDown={mandatory ? (e) => e.preventDefault() : undefined}
      >
        <DialogHeader>
          <DialogTitle>Oceni narudžbinu{restaurantName ? ` — ${restaurantName}` : ""}</DialogTitle>
          <DialogDescription>
            {mandatory
              ? "Tvoja narudžbina je dostavljena. Oceni je pre nego što nastaviš dalje."
              : "Pomozi nam da poboljšamo dostavu, hranu i sistem."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <StarPicker label="Dostava" value={delivery} onChange={setDelivery} />
          <StarPicker label="Hrana" value={food} onChange={setFood} />
          <StarPicker label="Sistem" value={system} onChange={setSystem} />
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Komentar</label>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button onClick={submit} disabled={pending}>
            Pošalji ocenu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
