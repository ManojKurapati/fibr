import type { ReactNode } from "react";
import { PRIMARY_CTA } from "@/data/content";

/** Wayfind control: square, 2px rule, Chivo Mono 800. One filled primary per screen. */
export function Button({
  href = "#book",
  children = PRIMARY_CTA,
  primary = false,
  className = "",
}: {
  href?: string;
  children?: ReactNode;
  primary?: boolean;
  className?: string;
}) {
  return (
    <a href={href} className={`btn ${primary ? "btn--primary" : ""} ${className}`}>
      {children}
    </a>
  );
}
