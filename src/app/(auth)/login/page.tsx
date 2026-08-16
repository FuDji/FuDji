import Link from "next/link";
import { Building2, ShieldCheck, Store, UtensilsCrossed } from "lucide-react";

const PORTALS = [
  { href: "/app/login", label: "Zaposleni", description: "Naruči dnevni obrok", icon: UtensilsCrossed },
  { href: "/company/login", label: "Firma", description: "Office menadžer", icon: Building2 },
  { href: "/restaurant/login", label: "Restoran", description: "Upravljaj narudžbinama", icon: Store },
  { href: "/admin/login", label: "Admin", description: "Prime Bite tim", icon: ShieldCheck },
];

export default function LoginPickerPage() {
  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold">Dobrodošli nazad</h1>
        <p className="mt-1 text-sm text-muted-foreground">Izaberi kako se prijavljuješ</p>
      </div>

      <div className="space-y-2">
        {PORTALS.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 transition-colors hover:border-primary/40 hover:bg-secondary/40"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <p.icon className="size-5" />
            </div>
            <div>
              <div className="font-medium">{p.label}</div>
              <div className="text-xs text-muted-foreground">{p.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
