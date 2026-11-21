import { ChevronDown } from "lucide-react";
import { ENTITIES } from "@/data/mockGroup";
import { GROUP_NAME } from "@/data/names";

export function GroupSwitcher() {
  return (
    <span className="flex min-w-0 items-center gap-2.5 text-left">
      <span className="grid grid-cols-1 size-7 shrink-0 place-items-center rounded-xl bg-accent font-display text-[17px] leading-none text-accent-ink">
        f
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1 text-[13px] font-extrabold leading-tight tracking-[-0.01em]">
          <span className="truncate">{GROUP_NAME}</span>
          <ChevronDown className="size-3.5 shrink-0 text-ink-faint" aria-hidden />
        </span>
        <span className="block text-[11px] leading-tight text-ink-faint">
          <span className="num">{ENTITIES.length}</span> companies, AED
        </span>
      </span>
    </span>
  );
}

export function Avatar() {
  return (
    <span className="grid grid-cols-1 size-8 place-items-center rounded-full bg-paper-2 text-[12px] font-extrabold text-ink" role="img" aria-label="Signed in as the group owner">
      OW
    </span>
  );
}
