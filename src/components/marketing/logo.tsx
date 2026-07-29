import { cn } from "@/lib/utils";

export function Logo({ className, mark = true }: { className?: string; mark?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {mark && (
        <svg
          viewBox="0 0 64 64"
          className="size-8 shrink-0"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="prime-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fde08a" />
              <stop offset="100%" stopColor="#f5ca48" />
            </linearGradient>
          </defs>
          <polygon points="2,14 24,14 13,26" fill="#ffffff" opacity="0.18" />
          <polygon points="2,38 24,38 13,26" fill="#ffffff" opacity="0.32" />
          <polygon points="24,14 24,38 13,26" fill="#ffffff" opacity="0.5" />
          <polygon points="20,20 44,20 32,32" fill="url(#prime-gold)" />
          <polygon points="20,44 44,44 32,32" fill="#d9a521" />
          <polygon points="44,20 44,44 62,32" fill="url(#prime-gold)" />
          <polygon points="20,20 20,44 32,32" fill="#f5ca48" opacity="0.85" />
        </svg>
      )}
      <span className="flex flex-col leading-none">
        <span className="text-[13px] font-semibold tracking-[0.2em] text-white/70">
          PRIME
        </span>
        <span className="text-[15px] font-extrabold tracking-[0.12em] text-primary">
          DELIVERY
        </span>
      </span>
    </div>
  );
}
