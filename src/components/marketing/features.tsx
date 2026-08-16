import {
  CalendarDays,
  Wallet,
  Bell,
  Truck,
  Gift,
  BarChart3,
  ClipboardCheck,
  Megaphone,
} from "lucide-react";

import { Reveal } from "./reveal";

const features = [
  {
    icon: CalendarDays,
    title: "Nedeljni meni unapred",
    description:
      "Zaposleni već u subotu vide ponudu za celu narednu nedelju i naručuju za bilo koji dan.",
  },
  {
    icon: Wallet,
    title: "Fleksibilni budžeti",
    description:
      "Firma plaća sve, zaposleni plaća sam, ili kombinovano — do definisanog iznosa po obroku.",
  },
  {
    icon: ClipboardCheck,
    title: "Potvrda restorana",
    description:
      "Restoran prihvata ili odbija narudžbinu uz razlog, i ažurira status do trenutka isporuke.",
  },
  {
    icon: Bell,
    title: "Rok za naručivanje",
    description:
      "Svaka firma ima cut-off vreme — posle njega narudžbina se zaključava i šalje restoranu.",
  },
  {
    icon: Truck,
    title: "Praćenje dostave",
    description:
      "Termin dostave po firmi, tolerancija kašnjenja i automatska upozorenja u admin panelu.",
  },
  {
    icon: Megaphone,
    title: "Akcije i kampanje",
    description:
      "Taco Tuesday, Free Dessert Wednesday — admin kreira kampanju, korisnici je odmah vide.",
  },
  {
    icon: Gift,
    title: "Loyalty program",
    description:
      "Poeni po narudžbini koje zaposleni menjaju za besplatan obrok, dezert ili piće.",
  },
  {
    icon: BarChart3,
    title: "Izveštaji i export",
    description:
      "Pregled troškova po zaposlenom i periodu, plus Excel izvoz za organizaciju dostave.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Sve što ti treba za organizovan ručak
        </h2>
        <p className="mt-4 text-muted-foreground">
          Prime Bite povezuje četiri portala u jedan tok: zaposleni naručuje, restoran potvrđuje,
          firma kontroliše troškove, admin drži sve pod kontrolom.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, i) => (
          <Reveal key={feature.title} delay={(i % 4) * 0.06}>
            <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="size-5" />
              </div>
              <h3 className="font-medium">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
