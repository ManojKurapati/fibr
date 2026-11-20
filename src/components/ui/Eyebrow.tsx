import type { ReactNode } from "react";

export function Eyebrow({
  children,
  tone = "muted",
  className = "",
}: {
  children: ReactNode;
  tone?: "muted" | "inverse" | "emerald";
  className?: string;
}) {
  const color =
    tone === "inverse" ? "text-ink-inverse-muted" : tone === "emerald" ? "text-emerald-ink" : "text-ink-muted";
  return <p className={`eyebrow ${color} ${className}`}>{children}</p>;
}
