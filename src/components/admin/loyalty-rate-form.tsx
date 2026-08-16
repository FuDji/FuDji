"use client";

import { useState, useTransition } from "react";

import { updateLoyaltySettings } from "@/app/admin/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LoyaltyRateForm({ rsdPerPoint }: { rsdPerPoint: number }) {
  const [value, setValue] = useState(String(rsdPerPoint));
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  return (
    <Card>
      <CardContent className="flex flex-wrap items-end gap-3 py-4">
        <div className="space-y-1.5">
          <Label htmlFor="rsd-per-point">Dinara za 1 poen</Label>
          <Input
            id="rsd-per-point"
            type="number"
            min={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-40"
          />
        </div>
        <Button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await updateLoyaltySettings(Number(value));
              if (result?.error) {
                setMessage({ type: "error", text: result.error });
                return;
              }
              setMessage({ type: "success", text: "Sačuvano." });
            })
          }
        >
          Sačuvaj
        </Button>
        <p className="w-full text-xs text-muted-foreground">
          Zaposleni dobija 1 poen za svakih {value || rsdPerPoint} RSD potrošenih na hranu, kad se
          narudžbina označi kao dostavljena.
        </p>
        {message && (
          <p className={`text-sm ${message.type === "error" ? "text-destructive" : "text-success"}`}>
            {message.text}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
