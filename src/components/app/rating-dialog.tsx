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

export function RatingDialog({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [delivery, setDelivery] = useState(5);
  const [food, setFood] = useState(5);
  const [system, setSystem] = useState(5);
  const [comment, setComment] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      await submitRating(orderId, delivery, food, system, comment);
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Oceni
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Oceni narudžbinu</DialogTitle>
          <DialogDescription>Pomozi nam da poboljšamo dostavu, hranu i sistem.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <StarPicker label="Dostava" value={delivery} onChange={setDelivery} />
          <StarPicker label="Hrana" value={food} onChange={setFood} />
          <StarPicker label="Sistem" value={system} onChange={setSystem} />
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Komentar (opciono)</label>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={pending}>
            Pošalji ocenu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
