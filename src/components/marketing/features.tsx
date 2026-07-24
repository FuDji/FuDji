import {
  BookOpenText,
  DoorOpen,
  QrCode,
  Package,
  Wrench,
  BarChart3,
  Printer,
  Sparkles,
} from "lucide-react";

import { Reveal } from "./reveal";

const features = [
  {
    icon: BookOpenText,
    title: "Digitalni vodiči za goste",
    description:
      "WiFi, kućna pravila, restorani, hitni brojevi — lepo organizovano i uvek ažurno.",
  },
  {
    icon: DoorOpen,
    title: "Uputstva po sobama",
    description:
      "Svaki uređaj dobija svoj mini-vodič. Gosti vas više neće zvati u ponoć zbog klime.",
  },
  {
    icon: QrCode,
    title: "Brendirani QR kodovi",
    description:
      "Generiši kodove za skeniranje za svaku sobu i uređaj. Odštampaj nalepnice, postere ili A4 listove u jednom kliku.",
  },
  {
    icon: Package,
    title: "Praćenje inventara",
    description:
      "Znaj tačno šta se nalazi u svakom apartmanu. Čistačice odmah prijavljuju nedostajuće ili pokvarene stvari.",
  },
  {
    icon: Wrench,
    title: "Održavanje bez glavobolje",
    description:
      "Prijavi probleme sa fotografijama, dodeli ih nekome i prati vreme rešavanja — sve sa telefona.",
  },
  {
    icon: BarChart3,
    title: "Prava analitika korišćenja",
    description:
      "Vidi koje vodiče gosti zaista čitaju, koji QR kodovi se skeniraju i gde se problemi ponavljaju.",
  },
  {
    icon: Printer,
    title: "Šabloni spremni za štampu",
    description:
      "Knjige dobrodošlice, WiFi kartice, oznake soba i posteri — izvezi uređene PDF-ove za par sekundi.",
  },
  {
    icon: Sparkles,
    title: "AI concierge",
    description:
      "Gosti postavljaju pitanja na svom jeziku; Boravak odgovara koristeći bazu znanja tvog apartmana.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Sve se dešava posle check-in-a
        </h2>
        <p className="mt-4 text-muted-foreground">
          Boravak nije sistem za rezervacije. To je operativni sistem za sam boravak —
          napravljen za domaćine kojima je stalo do iskustva gostiju.
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
