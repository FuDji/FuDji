import {
  Target,
  Receipt,
  Zap,
  Radar,
  Banknote,
  Headset,
  MapPinned,
  ShieldCheck,
} from "lucide-react";

import { Reveal } from "./reveal";

const features = [
  {
    icon: Target,
    title: "98.4% uručenosti",
    description:
      "Najviša stopa uspešnih isporuka na tržištu — svaka pošiljka je potvrđena i evidentirana.",
  },
  {
    icon: Receipt,
    title: "Transparentne cene",
    description:
      "Cena po pošiljci je poznata unapred. Bez paušala, bez skrivenih troškova, bez sitnih slova.",
  },
  {
    icon: Zap,
    title: "Isporuka isti dan",
    description:
      "Pošiljka poslata ujutru stiže do primaoca isti dan, u svim većim gradovima Srbije.",
  },
  {
    icon: Radar,
    title: "Praćenje uživo",
    description:
      "Pratite tačnu lokaciju svoje pošiljke od preuzimanja do uručenja, u realnom vremenu.",
  },
  {
    icon: Banknote,
    title: "Naplata pouzeća",
    description: "Novac od pouzeća stiže na vaš račun u roku od 24 sata od uručenja.",
  },
  {
    icon: MapPinned,
    title: "Pokrivenost cele Srbije",
    description: "Dostavljamo u svim većim gradovima i opštinama, svakog radnog dana.",
  },
  {
    icon: Headset,
    title: "Podrška kad zatreba",
    description: "Naš tim je dostupan telefonom i chatom — brzi odgovori, bez čekanja u redu.",
  },
  {
    icon: ShieldCheck,
    title: "Sigurnost pošiljke",
    description: "Svaka pošiljka je osigurana i tretirana sa istom pažnjom, bez obzira na veličinu.",
  },
];

export function Features() {
  return (
    <section id="zasto-mi" className="mx-auto max-w-6xl px-6 py-24 scroll-mt-16">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Zašto biraju Prime Delivery
        </h2>
        <p className="mt-4 text-muted-foreground">
          Ne obećavamo brzinu — merimo je. Evo zašto nam preduzeća i prodavnice
          poveravaju svoje pošiljke.
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
