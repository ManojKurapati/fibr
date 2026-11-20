import type { ReactNode } from "react";

type Tone = "neutral" | "emerald" | "amber" | "ink";

const tones: Record<Tone, string> = {
  neutral: "bg-[#ecebe6] text-ink-muted",
  emerald: "bg-emerald-soft text-emerald-ink",
  amber: "bg-amber-soft text-amber-ink",
  ink: "bg-ink text-canvas",
};

export function Badge({ children, tone = "neutral", className = "" }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold leading-4 ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
