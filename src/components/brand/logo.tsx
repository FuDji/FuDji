import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-semibold tracking-tight", className)}>
      <div className="relative flex size-8 items-center justify-center rounded-lg accent-gradient glow-primary">
        <span className="text-sm font-bold text-white">P</span>
      </div>
      <span className="text-[15px] text-foreground">Prime Bite</span>
    </div>
  );
}
