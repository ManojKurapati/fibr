import { LAST_PULLED } from "@/data/mockGroup";
import type { LedgerSource } from "@/lib/types";

/** "Last pulled: Today, 07:00 GST" — present on every view inside the app. */
export function SourceBadge({ sources, className = "" }: { sources?: readonly LedgerSource[]; className?: string }) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border border-hairline bg-white px-2.5 py-1 text-[10.5px] font-medium leading-none text-ink-muted ${className}`}
    >
      <span className="relative flex size-1.5 shrink-0">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald opacity-40 motion-reduce:hidden" />
        <span className="relative inline-flex size-1.5 rounded-full bg-emerald" />
      </span>
      <span className="truncate">
        {sources && sources.length ? <>{sources.join(" + ")} · </> : null}
        Last pulled: <span className="num text-ink">{LAST_PULLED}</span>
      </span>
    </span>
  );
}
