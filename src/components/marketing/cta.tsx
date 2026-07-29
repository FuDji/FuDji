"use client";

import * as React from "react";
import { toast } from "sonner";
import { ArrowRight, Phone, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Reveal } from "./reveal";

export function Cta() {
  const [submitting, setSubmitting] = React.useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      toast.success("Zahtev je poslat!", {
        description: "Kontaktiraćemo vas u najkraćem roku da zakažemo sastanak.",
      });
      e.currentTarget.reset();
    }, 700);
  }

  return (
    <section id="kontakt" className="px-6 py-24 scroll-mt-16">
      <Reveal>
        <div className="glass-strong relative mx-auto max-w-4xl overflow-hidden rounded-3xl p-8 sm:p-12">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />

          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Spremni da ubrzate dostavu?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Zakažite besplatan sastanak sa našim timom i saznajte kako Prime Delivery
              može da smanji vaše troškove dostave.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mx-auto mt-9 grid max-w-xl gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5 text-left">
                <Label htmlFor="name">Ime i prezime</Label>
                <Input id="name" name="name" placeholder="Marko Marković" required />
              </div>
              <div className="grid gap-1.5 text-left">
                <Label htmlFor="company">Naziv firme</Label>
                <Input id="company" name="company" placeholder="Vaša radnja d.o.o." />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5 text-left">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" name="phone" type="tel" placeholder="06x xxx xxxx" required />
              </div>
              <div className="grid gap-1.5 text-left">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="ime@firma.rs" required />
              </div>
            </div>
            <div className="grid gap-1.5 text-left">
              <Label htmlFor="volume">Broj pošiljki dnevno (okvirno)</Label>
              <Input id="volume" name="volume" type="number" min={0} placeholder="npr. 150" />
            </div>

            <Button type="submit" size="lg" disabled={submitting} className="group mt-2">
              {submitting ? "Slanje…" : "Zakažite sastanak"}
              {!submitting && (
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              )}
            </Button>
          </form>

          <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
            <a href="tel:+381600000000" className="flex items-center gap-2 hover:text-foreground">
              <Phone className="size-4 text-primary" />
              060 000 0000
            </a>
            <a
              href="mailto:kontakt@primedelivery.rs"
              className="flex items-center gap-2 hover:text-foreground"
            >
              <Mail className="size-4 text-primary" />
              kontakt@primedelivery.rs
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
