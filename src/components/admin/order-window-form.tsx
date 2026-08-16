"use client";

import { useState, useTransition } from "react";

import { updateOrderWindow } from "@/app/admin/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function OrderWindowForm({ days }: { days: number }) {
  const [value, setValue] = useState(String(days));
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  return (
    <Card>
      <CardContent className="flex flex-wrap items-end gap-3 py-4">
        <div className="space-y-1.5">
          <Label htmlFor="order-window-days">Dana unapred</Label>
          <Input
            id="order-window-days"
            type="number"
            min={1}
            max={60}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-32"
          />
        </div>
        <Button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await updateOrderWindow(Number(value));
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
          Zaposleni mogu da naruče najviše {value || days} dana unapred (uključujući danas).
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
