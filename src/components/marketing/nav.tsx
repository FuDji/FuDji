"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#product", label: "Proizvod" },
  { href: "#features", label: "Funkcije" },
  { href: "#pricing", label: "Cene" },
];

export function MarketingNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Prijava</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Započni</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
