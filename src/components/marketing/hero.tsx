"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Navigation, Package, Truck, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const floaters = [
  { Icon: Package, top: "18%", left: "8%", delay: 0, size: "size-8" },
  { Icon: Truck, top: "68%", left: "6%", delay: 0.6, size: "size-10" },
  { Icon: Package, top: "12%", left: "88%", delay: 0.3, size: "size-7" },
  { Icon: Navigation, top: "72%", left: "90%", delay: 0.9, size: "size-8" },
];

const stats = [
  { label: "uspešnih isporuka", value: "98.4%" },
  { label: "isporuka do", value: "24h" },
  { label: "po pošiljci od", value: "330 din" },
  { label: "pokrivenost", value: "cela Srbija" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-25%] size-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[180px]" />
        <div className="absolute right-[-10%] bottom-[-15%] size-[500px] rounded-full bg-primary/10 blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <svg
          className="absolute inset-0 hidden h-full w-full md:block"
          viewBox="0 0 1200 500"
          preserveAspectRatio="none"
        >
          <path
            id="route"
            d="M 60 380 C 300 380, 340 120, 600 120 S 900 380, 1140 380"
            fill="none"
            stroke="url(#route-grad)"
            strokeWidth="2"
            strokeDasharray="2 14"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="route-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f5ca48" stopOpacity="0" />
              <stop offset="50%" stopColor="#f5ca48" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f5ca48" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle r="6" fill="#f5ca48">
            <animateMotion
              dur="6s"
              repeatCount="indefinite"
              path="M 60 380 C 300 380, 340 120, 600 120 S 900 380, 1140 380"
            />
          </circle>
        </svg>

        {floaters.map(({ Icon, top, left, delay, size }, i) => (
          <motion.div
            key={i}
            className={`absolute ${size} hidden items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary backdrop-blur-sm md:flex`}
            style={{ top, left }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: [0, -14, 0] }}
            transition={{
              opacity: { duration: 0.6, delay },
              y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay },
            }}
          >
            <Icon className="size-1/2" />
          </motion.div>
        ))}
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-6">
            <Zap className="size-3" />
            Kurirska dostava novog doba
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
        >
          Pošaljite ujutru.
          <br className="hidden sm:block" />{" "}
          <span className="text-gradient">Stigne isti dan.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-6 max-w-xl text-balance text-lg text-muted-foreground"
        >
          Prime Delivery je kurirska služba za brzu i pouzdanu dostavu širom Srbije.
          Preuzimamo pošiljku sa vaše adrese i uručujemo je isti dan — uz transparentnu
          cenu i praćenje uživo, bez iznenađenja na računu.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="group">
            <a href="#kontakt">
              Zakažite sastanak
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Button>
          <Button asChild size="lg" variant="glass">
            <a href="#kalkulator">Izračunajte cenu</a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-semibold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        id="pregled"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto mt-20 max-w-5xl scroll-mt-24"
      >
        <div className="glass-strong overflow-hidden rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" />
              Praćenje pošiljke &middot; uživo
            </div>
            <span className="flex items-center gap-1.5 text-xs text-success">
              <span className="size-1.5 animate-pulse rounded-full bg-success" />
              U tranzitu
            </span>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-4">
            {[
              { label: "Isporučeno danas", value: "2.481" },
              { label: "Na putu", value: "163" },
              { label: "Prosečno vreme", value: "3h 40m" },
              { label: "Uspešnost", value: "98.4%" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="rounded-xl border border-border bg-card/60 p-4 text-left"
              >
                <div className="text-2xl font-semibold">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="px-6 pb-6">
            <div className="rounded-xl border border-border bg-gradient-to-br from-card to-secondary/40 p-5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Beograd &middot; Preuzeto 08:14</span>
                <span>Novi Sad &middot; Uručenje do 16:00</span>
              </div>
              <div className="relative mt-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full prime-gradient"
                  initial={{ width: "0%" }}
                  animate={{ width: "64%" }}
                  transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.div
                  className="absolute top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full border-2 border-background bg-primary text-background"
                  initial={{ left: "0%" }}
                  animate={{ left: "64%" }}
                  transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Truck className="size-3" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
