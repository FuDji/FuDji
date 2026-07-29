import { Logo } from "@/components/marketing/logo";

const links = [
  { href: "#kako-radi", label: "Kako radi" },
  { href: "#zasto-mi", label: "Zašto mi" },
  { href: "#kalkulator", label: "Cena" },
  { href: "#kontakt", label: "Kontakt" },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <Logo />
        <nav className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Prime Delivery. Sva prava zadržana.
        </p>
      </div>
    </footer>
  );
}
