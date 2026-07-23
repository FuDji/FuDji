import { Reveal } from "./reveal";

const steps = [
  {
    step: "01",
    title: "Set up your apartment",
    description: "Add photos, WiFi, check-in details and rooms. Takes about ten minutes.",
  },
  {
    step: "02",
    title: "Generate QR codes",
    description: "Stick them by the door, on the TV remote, above the coffee machine.",
  },
  {
    step: "03",
    title: "Guests scan, not call",
    description: "They get instant, beautiful answers — no app to download, ever.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-secondary/20 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Live in one afternoon</h2>
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
