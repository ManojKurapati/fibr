import type { ReactNode } from "react";

/** Every financial number, date and timestamp renders through this: JetBrains Mono + tabular-nums. */
export function Num({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`num ${className}`}>{children}</span>;
}
