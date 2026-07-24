import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Starter",
    price: "0 €",
    period: "zauvek",
    description: "Za domaćine sa jednim apartmanom",
    features: ["1 apartman", "Vodič za goste i sobe", "5 QR kodova", "Osnovni inventar"],
    cta: "Počni besplatno",
    highlighted: false,
  },
  {
    name: "Domaćin",
    price: "19 €",
    period: "po apartmanu / mesečno",
    description: "Za domaćine u rastu i manje portfolije",
    features: [
      "Neograničeno apartmana",
      "Neograničeno QR kodova",
      "Tok rada za održavanje",
      "Analitika i toplotne mape",
      "Print centar",
      "AI concierge",
    ],
    cta: "Počni besplatnu probu",
    highlighted: true,
  },
  {
    name: "Portfolio",
    price: "Po dogovoru",
    period: "za menadžere nekretnina",
    description: "Za timove koji upravljaju sa više jedinica",
    features: [
      "Sve iz Domaćin plana",
      "Timske uloge i dozvole",
      "Sopstveni domen",
      "Prioritetna podrška",
      "Stranice za goste bez brendiranja",
    ],
    cta: "Kontaktiraj nas",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="mx-auto max-w-xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Jednostavne cene po apartmanu</h2>
        <p className="mt-4 text-muted-foreground">Počni besplatno. Nadogradi samo kad ti zatreba.</p>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {tiers.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 0.08}>
            <div
              className={cn(
                "flex h-full flex-col rounded-2xl border p-7",
                tier.highlighted
                  ? "glow-primary border-primary/50 bg-gradient-to-b from-primary/10 to-card"
                  : "border-border bg-card"
              )}
            >
              <h3 className="font-medium">{tier.name}</h3>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold">{tier.price}</span>
                <span className="text-sm text-muted-foreground">{tier.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>

              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>

              <Button asChild className="mt-7" variant={tier.highlighted ? "default" : "secondary"}>
                <Link href="/register">{tier.cta}</Link>
              </Button>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
