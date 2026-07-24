import { Reveal } from "./reveal";

const steps = [
  {
    step: "01",
    title: "Podesi svoj apartman",
    description: "Dodaj fotografije, WiFi, detalje o dolasku i sobe. Traje desetak minuta.",
  },
  {
    step: "02",
    title: "Generiši QR kodove",
    description: "Nalepi ih pored vrata, na daljinski za TV, iznad aparata za kafu.",
  },
  {
    step: "03",
    title: "Gosti skeniraju, ne zovu",
    description: "Dobijaju trenutne, lepo prikazane odgovore — bez ikakve aplikacije.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-secondary/20 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Spremno za jedno popodne</h2>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.1}>
              <div className="relative rounded-2xl border border-border bg-card p-6">
                <span className="text-sm font-mono text-primary">{s.step}</span>
                <h3 className="mt-3 font-medium">{s.title}</h3>
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
