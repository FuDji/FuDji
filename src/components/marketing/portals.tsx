import { Building2, ShieldCheck, UtensilsCrossed, UsersRound } from "lucide-react";

import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

const portals = [
  {
    icon: UsersRound,
    name: "Portal za zaposlene",
    description: "Ponuda dana, nedeljni meni, status narudžbine i loyalty nagrade.",
    features: ["Naručivanje unapred", "Praćenje statusa", "Akcije i popusti", "Reward store"],
    highlighted: true,
  },
  {
    icon: Building2,
    name: "Office menadžer",
    description: "Upravljanje zaposlenima, budžetima i troškovima firme.",
    features: ["Bulk pozivnice (Excel)", "Dnevni/mesečni budžet", "Pregled troškova", "Istorija narudžbina"],
    highlighted: false,
  },
  {
    icon: UtensilsCrossed,
    name: "Portal za restorane",
    description: "Dolazne narudžbine, meni i kapacitet po danu.",
    features: ["Prihvati / odbij narudžbinu", "Procena vremena pripreme", "Meni po danima", "Dnevni limit obroka"],
    highlighted: false,
  },
  {
    icon: ShieldCheck,
    name: "Admin portal",
    description: "Potpuna kontrola nad firmama, restoranima i dostavom.",
    features: ["Nedeljno planiranje", "Kampanje i akcije", "Praćenje dostave", "Excel export"],
    highlighted: false,
  },
];

export function Portals() {
  return (
    <section id="portals" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="mx-auto max-w-xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Četiri portala, jedan sistem</h2>
        <p className="mt-4 text-muted-foreground">
          Svako u lancu — zaposleni, firma, restoran i admin — dobija panel podešen za svoju ulogu.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-4">
        {portals.map((portal, i) => (
          <Reveal key={portal.name} delay={i * 0.08}>
            <div
              className={cn(
                "flex h-full flex-col rounded-2xl border p-7",
                portal.highlighted
                  ? "glow-primary border-primary/50 bg-gradient-to-b from-primary/10 to-card"
                  : "border-border bg-card"
              )}
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <portal.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-medium">{portal.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{portal.description}</p>

              <ul className="mt-6 flex-1 space-y-2.5">
                {portal.features.map((f) => (
                  <li key={f} className="text-sm text-foreground/80">
                    · {f}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
