"use client";

import { AlertTriangle, ChevronRight, Lock } from "lucide-react";
import type { EntityId } from "@/data/names";
import { exceptions, groupTotals, summaries } from "@/lib/aggregate";
import { aed, amount, compact, pct } from "@/lib/format";
import { captureBySource, groupCapture } from "@/lib/movements";
import { SourceBadge } from "../SourceBadge";
import { Sparkline } from "../Sparkline";

const totals = groupTotals();
const tiles = summaries();
const allExceptions = exceptions();
const capture = groupCapture();
const sources = captureBySource().length;

export function GroupView({ onOpenEntity }: { onOpenEntity: (id: EntityId) => void }) {
  const kpis = [
    { label: "Group cash today", value: compact(totals.cashToday, 2), sub: `Oct close ${compact(totals.cashOct, 1)}`, tone: "emerald" as const },
    { label: "Revenue YTD", value: compact(totals.revenue, 1), sub: `EBITDA ${pct(totals.ebitda / totals.revenue)}`, tone: "ink" as const },
    { label: "Receivables > 90 days", value: compact(totals.over90, 2), sub: `${pct(totals.over90 / totals.receivables)} of ${compact(totals.receivables, 1)} owed`, tone: "amber" as const },
    { label: "Undrawn bank lines", value: compact(totals.undrawn, 1), sub: `of ${compact(totals.facilityLimit, 1)} limits`, tone: "emerald" as const },
  ];

  return (
    <div className="h-full overflow-y-auto overscroll-contain px-4 pb-5 pt-1 @min-[54rem]:px-5">
      <ViewHeader title="Group overview" subtitle={`All ${tiles.length} companies, AED`} />

      <div className="mb-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 clay-sm px-3 py-2 text-[11px] text-ink-muted">
        <span className="font-extrabold text-ink">Pipeline</span>
        <span>
          <span className="num text-ink">{sources}</span> sources, <span className="num text-ink">{tiles.length}</span> companies
        </span>
        <span>
          <span className="num text-ink">{amount(capture.total)}</span> movements captured YTD
        </span>
        <span className="hidden @min-[54rem]:inline">
          <span className="num text-ink">{amount(capture.salesInvoices)}</span> invoices, <span className="num text-ink">{amount(capture.receipts)}</span> receipts
        </span>
        <span className="ml-auto flex items-center gap-1 text-emerald-ink">
          <Lock className="size-3" aria-hidden /> All sources read-only
        </span>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-2 @min-[54rem]:grid-cols-4 @min-[54rem]:gap-2.5">
        {kpis.map((k) => (
          <div key={k.label} className="clay-sm px-3 py-2.5 @min-[54rem]:px-3.5 @min-[54rem]:py-3">
            <p className="flex items-center gap-1.5 text-[11px] font-medium text-ink-muted">
              {k.label}
            </p>
            <p className="mt-1 flex items-baseline gap-1">
              <span className="num text-[11px] font-medium text-ink-faint">AED</span>
              <span className="num text-[19px] font-extrabold leading-none tracking-[-0.03em] @min-[54rem]:text-[22px]">{k.value}</span>
            </p>
            <p className="num mt-1 truncate text-[11px] text-ink-faint">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Entity tiles */}
      <div className="mb-2 mt-4 flex items-baseline justify-between">
        <h3 className="text-[12px] font-extrabold tracking-[-0.01em]">Companies</h3>
        <p className="hidden text-[11px] text-ink-faint @min-[40rem]:block">Tap a company for P&amp;L, cash and movements</p>
      </div>
      <ul className="grid grid-cols-2 gap-2 @min-[54rem]:grid-cols-5 @min-[54rem]:gap-2.5">
        {tiles.map((t) => (
          <li key={t.entity.id}>
            <button
              type="button"
              onClick={() => onOpenEntity(t.entity.id)}
              className="group relative flex w-full flex-col clay-sm p-3 pr-4 text-left transition-[box-shadow,transform,border-color] duration-200 hover:border-hairline-strong active:scale-[0.985]"
              aria-label={`${t.entity.name}: cash ${aed(t.cashToday, { compact: true, dp: 2 })}. Open details`}
            >
              <span className="flex h-4 items-center justify-between gap-1">
                <span className="text-[11px] font-extrabold text-ink-faint">{t.entity.sector}</span>
                {t.exceptionCount ? (
                  <span className="num inline-flex items-center gap-0.5 rounded-full bg-amber-soft px-1.5 py-px text-[11px] font-extrabold text-amber-ink">
                    <AlertTriangle className="size-2.5" aria-hidden />
                    {t.exceptionCount}
                  </span>
                ) : null}
              </span>
              <span className="mt-1.5 truncate text-[12px] font-extrabold leading-tight">{t.entity.name}</span>
              <span className="truncate text-[11px] leading-tight text-ink-faint">{t.entity.jurisdiction}</span>

              <span className="mt-2.5 flex items-baseline gap-1">
                <span className="num text-[11px] text-ink-faint">AED</span>
                <span className="num text-[17px] font-extrabold leading-none tracking-[-0.03em]">{compact(t.cashToday, 2)}</span>
              </span>
              <span className="text-[11px] text-ink-faint">cash today</span>

              <Sparkline values={t.monthlyRevenue} className="mt-2 h-6 w-full text-ink/70" />

              <span className="mt-1.5 flex items-center justify-between border-t border-hairline pt-1.5 text-[11px]">
                <span className="text-ink-muted">
                  Rev <span className="num text-ink">{compact(t.revenue, 1)}</span>
                </span>
                <span className={`num font-medium ${t.netMargin < 0 ? "text-amber-ink" : "text-ink"}`}>NP {pct(t.netMargin)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Exceptions feed */}
      <div className="mb-2 mt-4 flex items-baseline justify-between">
        <h3 className="flex items-center gap-1.5 text-[12px] font-extrabold tracking-[-0.01em]">
          Flagged for you
          <span className="num rounded-full bg-amber-soft px-1.5 text-[11px] font-extrabold text-amber-ink">{allExceptions.length}</span>
        </h3>
        <p className="hidden text-[11px] text-ink-faint @min-[40rem]:block">Raised automatically from the ledgers</p>
      </div>
      <ul className="grid grid-cols-1 gap-2 @min-[54rem]:grid-cols-3 @min-[54rem]:gap-2.5">
        {allExceptions.slice(0, 3).map((x) => (
          <li key={x.id}>
            <button
              type="button"
              disabled={!x.entityId}
              onClick={() => x.entityId && onOpenEntity(x.entityId)}
              className="flex w-full items-start gap-2.5 clay-sm p-3 text-left transition-colors enabled:hover:border-hairline-strong"
            >
              <span className="mt-0.5 grid grid-cols-1 size-6 shrink-0 place-items-center rounded-full bg-amber-soft text-amber-ink" aria-hidden>
                <AlertTriangle className="size-3" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-extrabold leading-snug">{x.title}</span>
                <span className="mt-0.5 line-clamp-2 block text-[12px] leading-snug text-ink-muted">{x.detail}</span>
              </span>
              {x.entityId ? <ChevronRight className="mt-1 size-3.5 shrink-0 text-ink-faint" aria-hidden /> : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ViewHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-1.5 @min-[54rem]:mb-3.5">
      <div>
        <h2 className="font-display text-[24px] leading-none tracking-[-0.02em] @min-[54rem]:text-[28px]">{title}</h2>
        <p className="mt-1 text-[12px] text-ink-muted">{subtitle}</p>
      </div>
      <SourceBadge />
    </div>
  );
}
