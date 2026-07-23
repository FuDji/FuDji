"use client";

import { useState } from "react";
import { Check, Copy, Wifi } from "lucide-react";

export function WifiCard({ name, password }: { name: string; password: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={copy}
      className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors active:bg-secondary/60"
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Wifi className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{name}</p>
        <p className="truncate text-base font-medium">{password}</p>
      </div>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
        {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
      </div>
    </button>
  );
}
