import { Clock } from "lucide-react";
import { LAST_PULLED } from "@/data/mockGroup";
import type { LedgerSource } from "@/lib/types";

/** "Last pulled: Today, 07:00 GST" — present on every view inside the app. */
export function SourceBadge({ sources, className = "" }: { sources?: readonly LedgerSource[]; className?: string }) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 clay-sm px-2.5 py-1 text-[11px] font-medium leading-none text-ink-muted ${className}`}
    >
      <Clock className="size-3 shrink-0" aria-hidden />
      <span className="truncate">
        {sources && sources.length ? <>{sources.join(" + ")}, </> : null}
        Last pulled: <span className="num text-ink">{LAST_PULLED}</span>
      </span>
    </span>
  );
}
