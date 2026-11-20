import { BatteryFull, ChevronDown, Wifi } from "lucide-react";
import { ENTITIES } from "@/data/mockGroup";
import { GROUP_NAME } from "@/data/names";

export function StatusBar() {
  return (
    <div className="flex h-6 shrink-0 items-center justify-between px-5 pt-1 text-[11px] font-semibold text-ink @min-[54rem]:px-6" aria-hidden>
      <span className="num">
        07:42 <span className="ml-1 font-medium text-ink-muted">Fri 20 Nov</span>
      </span>
      <span className="flex items-center gap-1.5">
        <Wifi className="size-3.5" strokeWidth={2.5} />
        <span className="num text-[10px]">100%</span>
        <BatteryFull className="size-[18px]" strokeWidth={2} />
      </span>
    </div>
  );
}

export function GroupSwitcher() {
  return (
    <span className="flex min-w-0 items-center gap-2.5 text-left">
      <span className="grid size-7 shrink-0 place-items-center rounded-[8px] bg-ink font-display text-[17px] leading-none text-canvas shadow-[inset_0_-2px_0_rgba(255,255,255,0.08)]">
        f
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1 text-[13px] font-semibold leading-tight tracking-[-0.01em]">
          <span className="truncate">{GROUP_NAME}</span>
          <ChevronDown className="size-3.5 shrink-0 text-ink-faint" aria-hidden />
        </span>
        <span className="block text-[10.5px] leading-tight text-ink-faint">
          <span className="num">{ENTITIES.length}</span> companies · AED
        </span>
      </span>
    </span>
  );
}

export function Avatar() {
  return (
    <span className="grid size-8 place-items-center rounded-full bg-[#d9d5cb] text-[11px] font-semibold text-ink" role="img" aria-label="Signed in as the group owner">
      OW
    </span>
  );
}
