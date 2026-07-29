import { CalendarClock, PackageCheck, Truck, ReceiptText } from "lucide-react";

import { Reveal } from "./reveal";

const steps = [
  {
    step: "01",
    icon: CalendarClock,
    title: "Zakažite preuzimanje",
    description:
      "Pošaljite zahtev online, kroz aplikaciju ili telefonom — mi dolazimo na vašu adresu u dogovorenom terminu.",
  },
  {
    step: "02",
    icon: PackageCheck,
    title: "Preuzimamo pošiljku",
    description:
      "Naš kurir preuzima pošiljku, skenira je i odmah dobijate potvrdu i broj za praćenje.",
  },
  {
    step: "03",
    icon: Truck,
    title: "Isporuka isti dan",
    description:
      "Pošiljka je na putu do primaoca istog dana, uz praćenje uživo na svakom koraku.",
  },
  {
    step: "04",
    icon: ReceiptText,
    title: "Potvrda i naplata",
    description:
      "Uručenje se potvrđuje odmah, a naplata pouzeća stiže na vaš račun u roku od 24h.",
  },
];

export function HowItWorks() {
  return (
    <section id="kako-radi" className="border-y border-border bg-secondary/20 px-6 py-24 scroll-mt-16">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Kako funkcioniše Prime
          </h2>
          <p className="mt-4 text-muted-foreground">
            Od poziva do uručenja — četiri koraka, bez komplikacija.
          </p>
        </Reveal>

        <div className="relative mt-16 grid gap-8 md:grid-cols-4">
          <div className="absolute top-9 left-0 hidden h-px w-full bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          {steps.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.1}>
              <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
                <div className="relative z-10 mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                  <s.icon className="size-6" />
                </div>
                <span className="font-mono text-xs text-primary">{s.step}</span>
                <h3 className="mt-2 font-medium">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
