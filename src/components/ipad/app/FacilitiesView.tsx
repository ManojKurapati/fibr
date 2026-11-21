"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { FACILITIES } from "@/data/mockGroup";
import type { EntityId } from "@/data/names";
import { FACILITY_TYPES, getEntity, groupTotals, ladder } from "@/lib/aggregate";
import { compact, dateShort, pct } from "@/lib/format";
import { MaturityLadder, TYPE_COLORS } from "./charts";
import { ViewHeader } from "./GroupView";

const weeks = ladder();
const totals = groupTotals();
const lowest = weeks.reduce((a, w) => (w.projectedCash < a.projectedCash ? w : a));
const totalMaturing = weeks.reduce((a, w) => a + w.maturities, 0);
const firstFlagged = weeks.find((w) => w.flagged)?.week ?? 1;

export function FacilitiesView({ onOpenEntity }: { onOpenEntity: (id: EntityId) => void }) {
  const [selected, setSelected] = useState<number>(firstFlagged);
  const week = weeks.find((w) => w.week === selected) ?? weeks[0];
  const dueThisWeek = FACILITIES.flatMap((f) => f.maturities.filter((m) => m.week === selected).map((m) => ({ f, amount: m.amount }))).sort(
    (a, b) => b.amount - a.amount,
  );

  const kpis = [
    { label: "Facility limits", value: compact(totals.facilityLimit, 1), sub: `${FACILITIES.length} facilities, 5 banks` },
    { label: "Utilised", value: compact(totals.facilityUtilised, 1), sub: `${pct(totals.facilityUtilised / totals.facilityLimit, 0)} of limits` },
    { label: "Maturing in 13 weeks", value: compact(totalMaturing, 1), sub: `${weeks.filter((w) => w.flagged).length} weeks flagged` },
    { label: "Lowest projected cash", value: compact(lowest.projectedCash, 1), sub: `Week of ${lowest.label}` },
  ];

  return (
    <div className="h-full overflow-y-auto overscroll-contain px-4 pb-5 pt-1 @min-[54rem]:px-5">
      <ViewHeader title="Bank facilities" subtitle="13-week maturity ladder, all banks, all companies" />

      <div className="grid grid-cols-2 gap-2 @min-[54rem]:grid-cols-4 @min-[54rem]:gap-2.5">
        {kpis.map((k) => (
          <div key={k.label} className="clay-sm px-3 py-2.5 @min-[54rem]:px-3.5">
            <p className="text-[11px] font-medium text-ink-muted">{k.label}</p>
            <p className="mt-1 flex items-baseline gap-1">
              <span className="num text-[11px] text-ink-faint">AED</span>
              <span className="num text-[19px] font-extrabold leading-none tracking-[-0.03em] @min-[54rem]:text-[21px]">{k.value}</span>
            </p>
            <p className="num mt-1 text-[11px] text-ink-faint">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-2.5 grid grid-cols-1 gap-2.5 @min-[54rem]:grid-cols-[minmax(0,1fr)_272px]">
        <div className="min-w-0 clay-sm p-3">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="text-[12px] font-extrabold">Maturities by week. Tap a week</p>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-ink-muted">
              {FACILITY_TYPES.map((t) => (
                <span key={t} className="flex items-center gap-1">
                  <span className="size-2 rounded-xl" style={{ background: TYPE_COLORS[t] }} />
                  {t}
                </span>
              ))}
              <span className="flex items-center gap-1">
                <span className="h-0.5 w-3 rounded bg-emerald" />
                Projected cash
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-xl bg-peach/25" />
                Flagged
              </span>
            </div>
          </div>
          <div className="mt-2">
            <MaturityLadder weeks={weeks} selected={selected} onSelect={setSelected} height={200} />
          </div>
        </div>

        {week ? (
          <div className="clay-sm p-3">
            <p className="text-[11px] font-medium text-ink-muted">
              Week of <span className="num">{dateShort(week.weekStart, true)}</span>
            </p>
            <p className="mt-0.5 flex items-baseline gap-1">
              <span className="num text-[11px] text-ink-faint">AED</span>
              <span className="num text-[21px] font-extrabold leading-none tracking-[-0.03em]">{compact(week.maturities, 2)}</span>
              <span className="text-[11px] text-ink-muted">maturing</span>
            </p>
            {week.flagged ? (
              <p className="mt-2 flex gap-1.5 rounded-xl bg-peach p-2 text-[11px] leading-snug text-ink">
                <AlertTriangle className="mt-px size-3 shrink-0 text-amber-ink" aria-hidden />
                <span>
                  Exceeds forecast operating cash of <span className="num font-extrabold">AED {compact(week.netOperating, 1)}</span>. Plan rollover or fund from balances.
                </span>
              </p>
            ) : (
              <p className="mt-2 text-[11px] text-ink-muted">
                Covered by forecast operating cash of <span className="num text-ink">AED {compact(week.netOperating, 1)}</span>.
              </p>
            )}
            <ul className="mt-2">
              {dueThisWeek.length ? (
                dueThisWeek.map(({ f, amount }) => (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => onOpenEntity(f.entityId)}
                      className="flex w-full items-baseline justify-between gap-2 border-t border-hairline py-1.5 text-left text-[12px] hover:text-ink"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{getEntity(f.entityId).name}</span>
                        <span className="block truncate text-[11px] text-ink-faint">
                          {f.bank}, {f.type}
                        </span>
                      </span>
                      <span className="num shrink-0 font-extrabold">{compact(amount, 2)}</span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="border-t border-hairline py-1.5 text-[12px] text-ink-faint">No maturities this week.</li>
              )}
            </ul>
            <p className="num mt-1 border-t border-hairline pt-1.5 text-[11px] text-ink-faint">Cash after week: AED {compact(week.projectedCash, 1)}</p>
          </div>
        ) : null}
      </div>

      {/* Facility register */}
      <div className="mt-2.5 overflow-hidden clay-sm">
        <div className="hidden grid-cols-[1.3fr_0.7fr_1fr_0.7fr_1.2fr_0.8fr] gap-3 border-b border-hairline bg-paper px-3 py-2 text-[11px] font-extrabold text-ink-faint @min-[54rem]:grid">
          <span>Company</span>
          <span>Bank</span>
          <span>Type</span>
          <span className="text-right">Limit</span>
          <span>Utilised</span>
          <span className="text-right">Next due</span>
        </div>
        <ul>
          {FACILITIES.map((f) => {
            const u = f.utilised / f.limit;
            const next = f.maturities[0];
            return (
              <li key={f.id} className="border-b border-hairline last:border-b-0">
                <button
                  type="button"
                  onClick={() => onOpenEntity(f.entityId)}
                  className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-0.5 px-3 py-2 text-left text-[12px] hover:bg-paper @min-[54rem]:grid-cols-[1.3fr_0.7fr_1fr_0.7fr_1.2fr_0.8fr]"
                >
                  <span className="truncate font-medium">{getEntity(f.entityId).name}</span>
                  <span className="text-ink-muted @max-[54rem]:hidden">{f.bank}</span>
                  <span className="truncate text-ink-muted @max-[54rem]:hidden">{f.type}</span>
                  <span className="num text-right @max-[54rem]:hidden">{compact(f.limit, 1)}</span>
                  <span className="flex items-center gap-2 @max-[54rem]:col-span-2 @max-[54rem]:row-start-2">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-2 shadow-clay-pressed">
                      <span className={`block h-full rounded-full ${u >= 0.85 ? "bg-amber" : "bg-accent"}`} style={{ width: `${u * 100}%` }} />
                    </span>
                    <span className={`num w-8 text-right text-[11px] ${u >= 0.85 ? "font-extrabold text-amber-ink" : "text-ink-muted"}`}>{pct(u, 0)}</span>
                  </span>
                  <span className="num text-right text-ink-muted @max-[54rem]:col-start-2 @max-[54rem]:row-start-1">
                    {next ? `${dateShort(weeks[next.week - 1]?.weekStart ?? "")}, ${compact(next.amount, 1)}` : "On demand"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
