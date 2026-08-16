import Link from "next/link";

import { Logo } from "@/components/brand/logo";

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-10%] size-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] size-[400px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        <Link href="/" className="mb-8 flex justify-center">
          <Logo />
        </Link>
        <div className="glass-strong rounded-2xl p-8 shadow-2xl">{children}</div>
      </div>
    </div>
  );
}
