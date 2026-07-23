import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "For hosts with a single apartment",
    features: ["1 apartment", "Guest guide & room guides", "5 QR codes", "Basic inventory"],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Host",
    price: "$19",
    period: "per apartment / mo",
    description: "For growing hosts and small portfolios",
    features: [
      "Unlimited apartments",
      "Unlimited QR codes",
      "Maintenance workflows",
      "Analytics & heatmaps",
      "Print center",
      "AI concierge",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Portfolio",
    price: "Custom",
    period: "for property managers",
    description: "For teams managing many units",
    features: [
      "Everything in Host",
      "Team roles & permissions",
      "Custom domain",
      "Priority support",
      "White-label guest pages",
    ],
    cta: "Talk to us",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="mx-auto max-w-xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Simple, apartment-based pricing</h2>
        <p className="mt-4 text-muted-foreground">Start free. Upgrade only when you need more.</p>
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
