import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";

export function Cta() {
  return (
    <section className="px-6 py-24">
      <Reveal>
        <div className="glass-strong relative mx-auto max-w-4xl overflow-hidden rounded-3xl p-12 text-center">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Give every guest a five-star stay
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Set up your first apartment for free — no credit card required.
          </p>
          <Button asChild size="lg" className="mt-8 group">
            <Link href="/register">
              Get started
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
