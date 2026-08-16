import { Reveal } from "./reveal";

const steps = [
  {
    step: "01",
    title: "Zaposleni bira šta jede",
    description: "Za bilo koji dan unapred, iz liste restorana koje je definisao admin za taj dan.",
  },
  {
    step: "02",
    title: "Restoran prihvata ili odbija",
    description: "Sve narudžbine se grupišu po firmi i danu, restoran ih potvrđuje pre roka za pripremu.",
  },
  {
    step: "03",
    title: "Dostava se prati do kraja",
    description: "Admin prati termin i kašnjenje, a zaposleni ocenjuje dostavu, hranu i sistem.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-secondary/20 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Kako funkcioniše</h2>
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
