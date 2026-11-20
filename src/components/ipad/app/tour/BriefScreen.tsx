import { ArrowUpRight, Fingerprint } from "lucide-react";
import { LAST_PULLED } from "@/data/mockGroup";
import { exceptions, groupTotals, ladder } from "@/lib/aggregate";
import { compact, dateShort } from "@/lib/format";

const t = groupTotals();
const w = ladder();
const thisWeek = w[0];
const flagged = w.find((x) => x.flagged);

export function BriefScreen() {
  return (
    <div className="relative h-full overflow-y-auto bg-[radial-gradient(120%_90%_at_10%_0%,#ffffff_0%,#efede7_60%,#e6e3db_100%)] px-5 pb-6 pt-3 @min-[54rem]:px-10 @min-[54rem]:pt-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">Morning brief · Fri 20 Nov</p>
      <h2 className="mt-2 max-w-[30ch] font-display text-[30px] leading-[1.02] tracking-[-0.02em] @min-[54rem]:text-[44px]">
        Good morning. Here is the group before your first call.
      </h2>
      <div className="mt-5 grid gap-2.5 @min-[54rem]:mt-7 @min-[54rem]:grid-cols-3 @min-[54rem]:gap-3">
        <div className="rounded-[18px] bg-ink p-4 text-canvas">
          <p className="text-[11px] text-ink-inverse-muted">Cash across all companies</p>
          <p className="num mt-2 text-[34px] font-semibold leading-none tracking-[-0.04em] @min-[54rem]:text-[40px]">{compact(t.cashToday, 2)}</p>
          <p className="num mt-2 text-[11px] text-[#7ee2b8]">
            AED · {t.cashToday >= t.cashOct ? "+" : "−"}
            {compact(Math.abs(t.cashToday - t.cashOct), 0)} since 31 Oct close
          </p>
        </div>
        <div className="rounded-[18px] border border-hairline bg-white/80 p-4">
          <p className="text-[11px] text-ink-muted">Maturing this week</p>
          <p className="num mt-2 text-[34px] font-semibold leading-none tracking-[-0.04em] @min-[54rem]:text-[40px]">{compact(thisWeek?.maturities ?? 0, 1)}</p>
          <p className="mt-2 text-[11px] text-ink-muted">
            Next pinch: <span className="num text-amber-ink">week of {flagged ? dateShort(flagged.weekStart) : "–"}</span>
          </p>
        </div>
        <div className="rounded-[18px] border border-hairline bg-white/80 p-4">
          <p className="text-[11px] text-ink-muted">Needs you</p>
          <p className="num mt-2 text-[34px] font-semibold leading-none tracking-[-0.04em] @min-[54rem]:text-[40px]">{exceptions().length}</p>
          <p className="mt-2 flex items-center gap-1 text-[11px] text-ink-muted">
            Flagged items <ArrowUpRight className="size-3" aria-hidden />
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-ink-muted @min-[54rem]:mt-6">
        <span className="flex items-center gap-1.5">
          <Fingerprint className="size-3.5 text-ink" aria-hidden />
          Signed in with Microsoft · MFA
        </span>
        <span>
          Last pulled: <span className="num text-ink">{LAST_PULLED}</span>
        </span>
        <span>Read-only · 5 ledger types</span>
      </div>
    </div>
  );
}
