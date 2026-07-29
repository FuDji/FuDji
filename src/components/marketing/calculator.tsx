"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, PackageSearch, TrendingDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";

const MIN = 1;
const MAX = 3000;
const DEFAULT_VALUE = 50;
const STANDARD_PRICE = 360;
const DISCOUNT_PRICE = 330;
const DISCOUNT_THRESHOLD = 2000;

function formatRSD(value: number) {
  return `${Math.round(value).toLocaleString("sr-RS")} din`;
}

export function Calculator() {
  const [value, setValue] = React.useState(DEFAULT_VALUE);

  const pricePerShipment = value > DISCOUNT_THRESHOLD ? DISCOUNT_PRICE : STANDARD_PRICE;
  const monthlyEstimate = pricePerShipment * value;
  const progress = ((value - MIN) / (MAX - MIN)) * 100;

  return (
    <section id="kalkulator" className="mx-auto max-w-5xl px-6 py-24 scroll-mt-16">
      <Reveal className="mx-auto max-w-xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Platite koliko šaljete
        </h2>
        <p className="mt-4 text-muted-foreground">
          Bez paušala i skrivenih troškova — cena zavisi isključivo od broja pošiljki.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="glass-strong relative mt-14 overflow-hidden rounded-3xl p-6 sm:p-10">
          <div className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-primary/15 blur-[120px]" />

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <PackageSearch className="size-4 text-primary" />
                Broj pošiljki dnevno
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={value}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="text-4xl font-semibold tabular-nums sm:text-5xl"
                  >
                    {value.toLocaleString("sr-RS")}
                  </motion.span>
                </AnimatePresence>
                <span className="text-muted-foreground">pošiljki / dan</span>
              </div>

              <input
                type="range"
                min={MIN}
                max={MAX}
                step={1}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="prime-slider mt-7 w-full"
                style={{ "--slider-progress": `${progress}%` } as React.CSSProperties}
                aria-label="Broj pošiljki dnevno"
              />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>3.000+</span>
              </div>

              <AnimatePresence>
                {value > DISCOUNT_THRESHOLD && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-5 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2.5 text-sm text-primary"
                  >
                    <TrendingDown className="size-4 shrink-0" />
                    Ostvarili ste popust za veliki obim — 330 din po pošiljci.
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="mt-5 text-xs text-muted-foreground">
                Za više od {DISCOUNT_THRESHOLD.toLocaleString("sr-RS")} pošiljki dnevno,
                cena po pošiljci automatski pada na {formatRSD(DISCOUNT_PRICE)}.
              </p>
            </div>

            <div className="flex flex-col justify-between gap-6 rounded-2xl border border-border bg-card/60 p-6 sm:p-7">
              <div>
                <div className="text-sm text-muted-foreground">Cena po pošiljci</div>
                <div className="mt-1 text-2xl font-semibold text-primary">
                  {formatRSD(pricePerShipment)}
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <div className="text-sm text-muted-foreground">Procena mesečnog troška</div>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={monthlyEstimate}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="mt-1 text-3xl font-semibold tabular-nums"
                  >
                    {formatRSD(monthlyEstimate)}
                  </motion.div>
                </AnimatePresence>
              </div>

              <Button asChild size="lg" className="group w-full">
                <a href="#kontakt">
                  Zakažite sastanak
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
