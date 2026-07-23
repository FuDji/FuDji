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
    title: "Digital guest guides",
    description:
      "WiFi, house rules, restaurants, emergency numbers — beautifully organized and always up to date.",
  },
  {
    icon: DoorOpen,
    title: "Room-by-room instructions",
    description:
      "Every appliance gets its own mini-guide. No more guests texting you at midnight about the AC.",
  },
  {
    icon: QrCode,
    title: "Branded QR codes",
    description:
      "Generate scannable codes for every room and item. Print stickers, posters or A4 sheets in one click.",
  },
  {
    icon: Package,
    title: "Inventory tracking",
    description:
      "Know exactly what's in every apartment. Cleaners flag missing or broken items instantly.",
  },
  {
    icon: Wrench,
    title: "Maintenance workflows",
    description:
      "Log issues with photos, assign them, and track resolution time — all from your phone.",
  },
  {
    icon: BarChart3,
    title: "Real usage analytics",
    description:
      "See which guides guests actually read, which QR codes get scanned, and where problems repeat.",
  },
  {
    icon: Printer,
    title: "Print-ready templates",
    description:
      "Welcome books, WiFi cards, room labels and posters — export polished PDFs in seconds.",
  },
  {
    icon: Sparkles,
    title: "AI concierge",
    description:
      "Guests ask questions in their own language; FuDji answers using your apartment's knowledge base.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything happens after check-in
        </h2>
        <p className="mt-4 text-muted-foreground">
          FuDji isn&apos;t a booking engine. It&apos;s the operating system for the stay itself —
          designed for hosts who care about the guest experience.
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
