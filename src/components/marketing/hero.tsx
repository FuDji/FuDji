"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, UtensilsCrossed, Wallet, Truck, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] size-[800px] -translate-x-1/2 rounded-full bg-primary/25 blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-6">
            Naručivanje obroka za firme, restorane i zaposlene
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-balance text-4xl font-semibold tracking-tight text-gradient sm:text-5xl md:text-6xl"
        >
          Ručak za celu firmu,
          <br className="hidden sm:block" /> naručen za par klikova
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-6 max-w-xl text-balance text-lg text-muted-foreground"
        >
          Prime Bite povezuje firme, zaposlene i restorane u jednu platformu. Nedeljni meniji,
          budžeti po zaposlenom, potvrde restorana i praćenje dostave — sve na jednom mestu.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="group">
            <Link href="/login">
              Prijavi se
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="glass">
            <Link href="#product">Pogledaj kako radi</Link>
          </Button>
        </motion.div>
      </div>

      <motion.div
        id="product"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto mt-20 max-w-5xl scroll-mt-24"
      >
        <div className="glass-strong overflow-hidden rounded-2xl shadow-2xl">
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
            <span className="size-2.5 rounded-full bg-destructive/70" />
            <span className="size-2.5 rounded-full bg-warning/70" />
            <span className="size-2.5 rounded-full bg-success/70" />
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-4">
            {[
              { label: "Narudžbine danas", value: "128", icon: UtensilsCrossed, tone: "primary" },
              { label: "Ušteđeno kroz budžet", value: "42.500 RSD", icon: Wallet, tone: "success" },
              { label: "Dostave na vreme", value: "96%", icon: Truck, tone: "primary" },
              { label: "Prosečna ocena", value: "4.8", icon: Star, tone: "warning" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="rounded-xl border border-border bg-card/60 p-4 text-left"
              >
                <stat.icon className="mb-3 size-4 text-primary" />
                <div className="text-2xl font-semibold">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          <div className="grid gap-4 px-6 pb-6 md:grid-cols-3">
            {["Taco Monday — Burrito Bar", "Sushi Day — Wasabi", "Dnevni meni — Trpeza"].map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="rounded-xl border border-border bg-gradient-to-br from-card to-secondary/40 p-4"
              >
                <div className="mb-3 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-transparent" />
                <div className="text-sm font-medium">{name}</div>
                <div className="mt-1 text-xs text-muted-foreground">Ponuda dana · -20%</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
