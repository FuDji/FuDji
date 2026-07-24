import Link from "next/link";
import { Compass } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[140px]" />
      </div>
      <div className="relative">
        <Link href="/" className="mb-8 flex justify-center">
          <Logo />
        </Link>
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
          <Compass className="size-6" />
        </div>
        <h1 className="text-2xl font-semibold">Stranica nije pronađena</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Stranica koju tražiš ne postoji ili je možda premeštena.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Nazad na početnu</Link>
        </Button>
      </div>
    </div>
  );
}
