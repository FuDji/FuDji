"use client";

import { useState, useTransition } from "react";

import { redeemReward } from "@/app/app/actions";
import { Button } from "@/components/ui/button";

export function RedeemButton({ rewardId, disabled }: { rewardId: string; disabled: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function redeem() {
    setError(null);
    startTransition(async () => {
      const result = await redeemReward(rewardId);
      if (result?.error) setError(result.error);
      else setDone(true);
    });
  }

  if (done) return <span className="text-sm text-success">Preuzeto!</span>;

  return (
    <div className="text-right">
      <Button size="sm" onClick={redeem} disabled={disabled || pending}>
        Iskoristi
      </Button>
      {error && <p className="mt-1 max-w-40 text-xs text-destructive">{error}</p>}
    </div>
  );
}
