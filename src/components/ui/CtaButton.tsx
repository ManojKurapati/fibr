import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export const PRIMARY_CTA = "Book a 45-Minute iPad Walkthrough";

type Variant = "primary" | "ghost" | "inverse" | "ghost-inverse";

const styles: Record<Variant, string> = {
  primary: "bg-ink text-canvas hover:bg-[#1a2336] shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_8px_24px_-12px_rgba(11,18,33,0.55)]",
  ghost: "text-ink ring-1 ring-inset ring-hairline-strong hover:ring-ink bg-transparent",
  inverse: "bg-ink-inverse text-ink hover:bg-white",
  "ghost-inverse": "text-ink-inverse ring-1 ring-inset ring-white/20 hover:ring-white/50",
};

export function CtaButton({
  href = "#book",
  children = PRIMARY_CTA,
  variant = "primary",
  arrow = true,
  className = "",
  size = "md",
}: {
  href?: string;
  children?: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "min-h-10 px-4 py-2 text-[0.875rem]" : "min-h-12 px-6 py-3 text-[0.9375rem]";
  return (
    <a
      href={href}
      className={`group inline-flex max-w-full shrink-0 items-center text-center leading-snug sm:whitespace-nowrap justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] transition-[background-color,box-shadow,transform] duration-200 active:translate-y-px ${pad} ${styles[variant]} ${className}`}
    >
      <span>{children}</span>
      {arrow ? (
        <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      ) : null}
    </a>
  );
}
