import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

export function SectionHeading({
  eyebrow,
  title,
  lede,
  tone = "light",
  align = "left",
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "split";
  className?: string;
}) {
  const dark = tone === "dark";
  if (align === "split") {
    return (
      <div className={`grid gap-6 lg:grid-cols-12 lg:items-end ${className}`}>
        <div className="lg:col-span-7">
          <Eyebrow tone={dark ? "inverse" : "muted"} className="mb-5">{eyebrow}</Eyebrow>
          <h2 className={`display text-[clamp(2.5rem,5.2vw,4.5rem)] ${dark ? "text-ink-inverse" : "text-ink"}`}>{title}</h2>
        </div>
        {lede ? (
          <p className={`max-w-[34rem] text-[1.0625rem] leading-relaxed lg:col-span-5 lg:pb-2 ${dark ? "text-ink-inverse-muted" : "text-ink-muted"}`}>
            {lede}
          </p>
        ) : null}
      </div>
    );
  }
  return (
    <div className={`max-w-[46rem] ${className}`}>
      <Eyebrow tone={dark ? "inverse" : "muted"} className="mb-5">{eyebrow}</Eyebrow>
      <h2 className={`display text-[clamp(2.5rem,5.2vw,4.5rem)] ${dark ? "text-ink-inverse" : "text-ink"}`}>{title}</h2>
      {lede ? (
        <p className={`mt-6 max-w-[38rem] text-[1.0625rem] leading-relaxed ${dark ? "text-ink-inverse-muted" : "text-ink-muted"}`}>{lede}</p>
      ) : null}
    </div>
  );
}
