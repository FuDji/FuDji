import Link from "next/link";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
        <MailCheck className="size-6" />
      </div>
      <h1 className="text-xl font-semibold">Potvrdi svoj email</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Poslali smo link za potvrdu na tvoj email. Klikni na njega da aktiviraš nalog i počneš da
        upravljaš svojim nekretninama.
      </p>
      <Link href="/login" className="mt-6 inline-block text-sm text-primary hover:underline">
        Nazad na prijavu
      </Link>
    </div>
  );
}
