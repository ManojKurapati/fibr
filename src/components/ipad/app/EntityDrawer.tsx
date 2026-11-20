"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Building2, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { FACILITIES, MONTHS, PNL_PERIOD } from "@/data/mockGroup";
import type { EntityId } from "@/data/names";
import { exceptions, getEntity, summarise } from "@/lib/aggregate";
import { amount, compact, dateShort, pct } from "@/lib/format";
import { SourceBadge } from "../SourceBadge";
import { AnswerBars } from "./charts";

const ease = [0.22, 1, 0.36, 1] as const;

export function EntityDrawer({ entityId, onClose }: { entityId: EntityId | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {entityId ? <DrawerPanel key={entityId} entityId={entityId} onClose={onClose} /> : null}
    </AnimatePresence>
  );
}

function DrawerPanel({ entityId, onClose }: { entityId: EntityId; onClose: () => void }) {
  const [tab, setTab] = useState<"pnl" | "cash">("pnl");
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const e = getEntity(entityId);
  const s = summarise(e);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (ev: KeyboardEvent) => ev.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-40">
      <motion.button
        type="button"
        aria-label="Close company details"
        tabIndex={-1}
        className="absolute inset-0 bg-[#0b1221]/20 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.28, ease }}
        className="absolute inset-y-0 right-0 flex w-full flex-col border-l border-hairline bg-[#fbfaf8] shadow-[-24px_0_48px_-24px_rgba(11,18,33,0.35)] @min-[54rem]:w-[420px]"
      >
        <div className="shrink-0 border-b border-hairline px-4 pb-3 pt-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-2.5">
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[10px] bg-ink text-canvas" aria-hidden>
                <Building2 className="size-4" />
              </span>
              <div className="min-w-0">
                <h3 id={titleId} className="truncate text-[15px] font-semibold leading-tight tracking-[-0.01em]">{e.name}</h3>
                <p className="truncate text-[11px] text-ink-muted">{e.activity} · {e.jurisdiction}</p>
              </div>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid size-7 shrink-0 place-items-center rounded-full bg-[#ecebe6] text-ink-muted transition-colors hover:text-ink"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {s.auditReasons.map((r) => (
              <span key={r} className="rounded-full bg-ink px-2 py-0.5 text-[9.5px] font-semibold text-canvas">Audit: {r}</span>
            ))}
            <SourceBadge sources={e.ledgers} />
          </div>
          {/* Segmented control */}
          <div role="tablist" aria-label="Company view" className="mt-3 grid grid-cols-2 rounded-[10px] bg-[#ecebe6] p-0.5">
            {(["pnl", "cash"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className="relative h-7 rounded-[8px] text-[11.5px] font-semibold"
              >
                {tab === t ? (
                  <motion.span layoutId={`seg-${titleId}`} className="absolute inset-0 rounded-[8px] bg-white shadow-[0_1px_2px_rgba(11,18,33,0.12)]" transition={{ duration: 0.22, ease }} />
                ) : null}
                <span className={`relative ${tab === t ? "text-ink" : "text-ink-muted"}`}>{t === "pnl" ? "P&L" : "Cash & working capital"}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3.5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: tab === "pnl" ? -8 : 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease }}
            >
              {tab === "pnl" ? <PnlPanel id={entityId} /> : <CashPanel id={entityId} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.aside>
    </div>
  );
}

function Row({ label, value, strong = false, note, tone }: { label: string; value: number; strong?: boolean; note?: string; tone?: "amber" }) {
  return (
    <div className={`flex items-baseline justify-between gap-3 py-[7px] ${strong ? "border-t border-ink/80 font-semibold" : "border-t border-hairline"}`}>
      <span className={`text-[11.5px] ${strong ? "text-ink" : "text-ink-muted"}`}>{label}</span>
      <span className="flex items-baseline gap-2">
        {note ? <span className={`num text-[10px] ${tone === "amber" ? "text-amber-ink" : "text-ink-faint"}`}>{note}</span> : null}
        <span className={`num text-[12px] ${strong && value < 0 ? "text-amber-ink" : "text-ink"}`}>{amount(value)}</span>
      </span>
    </div>
  );
}

function PnlPanel({ id }: { id: EntityId }) {
  const e = getEntity(id);
  const s = summarise(e);
  const months = s.monthlyRevenue.map((v, i) => ({ name: MONTHS[i] ?? "", value: v, highlight: i === s.monthlyRevenue.length - 1 ? ("emerald" as const) : ("ink" as const) }));
  return (
    <div>
      <p className="text-[10.5px] font-medium text-ink-muted">Income statement · {PNL_PERIOD} · AED</p>
      <div className="mt-2">
        <Row label="Revenue" value={e.pnl.revenue} />
        <Row label="Cost of sales" value={-e.pnl.cogs} />
        <Row label="Gross profit" value={s.grossProfit} strong note={`${pct(s.grossMargin)} margin`} />
        <Row label="Operating expenses" value={-e.pnl.opex} />
        <Row label="EBITDA" value={s.ebitda} strong note={pct(s.ebitda / s.revenue)} />
        <Row label="Depreciation" value={-e.pnl.depreciation} />
        <Row label="Finance cost" value={-e.pnl.financeCost} />
        <Row label="Net profit" value={s.netProfit} strong note={pct(s.netMargin)} tone={s.netMargin < 0 ? "amber" : undefined} />
      </div>
      <div className="mt-4 rounded-[12px] border border-hairline bg-white p-3">
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-semibold">Monthly revenue</p>
          <p className="num text-[10px] text-ink-faint">FY2025 {compact(e.fy2025Revenue, 1)}</p>
        </div>
        <AnswerBars data={months} layout="horizontal" height={130} valueLabels={false} />
      </div>
    </div>
  );
}

function CashPanel({ id }: { id: EntityId }) {
  const e = getEntity(id);
  const s = summarise(e);
  const r = e.receivables;
  const aging = [
    { label: "0–30", value: r.current, color: "bg-ink" },
    { label: "31–60", value: r.d31to60, color: "bg-[#5a6577]" },
    { label: "61–90", value: r.d61to90, color: "bg-[#a6adb8]" },
    { label: "90+", value: s.over90, color: "bg-amber" },
  ];
  const facilities = FACILITIES.filter((f) => f.entityId === id);
  const xs = exceptions().filter((x) => x.entityId === id);
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between rounded-[12px] border border-hairline bg-white p-3">
        <div>
          <p className="text-[10.5px] font-medium text-ink-muted">Cash today</p>
          <p className="mt-0.5 flex items-baseline gap-1">
            <span className="num text-[10px] text-ink-faint">AED</span>
            <span className="num text-[22px] font-semibold leading-none tracking-[-0.03em]">{amount(s.cashToday)}</span>
          </p>
        </div>
        <p className="num text-right text-[10px] text-ink-faint">
          31 Oct close
          <br />
          <span className="text-ink">{amount(s.cashOct)}</span>
        </p>
      </div>

      <div>
        <p className="text-[11px] font-semibold">Bank accounts</p>
        {e.bankAccounts.map((a) => (
          <div key={a.last4} className="flex items-baseline justify-between border-t border-hairline py-[7px] text-[11.5px] first-of-type:mt-1.5">
            <span className="text-ink-muted">
              {a.bank} <span className="num">••{a.last4}</span>
            </span>
            <span className="num">{amount(a.today)}</span>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-semibold">Receivables ageing</p>
          <p className="num text-[10.5px] text-ink-muted">{amount(s.receivablesTotal)}</p>
        </div>
        <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-[#ecebe6]" role="img" aria-label="Receivables ageing">
          {aging.map((a) => (
            <span key={a.label} className={a.color} style={{ width: `${(a.value / s.receivablesTotal) * 100}%` }} />
          ))}
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1">
          {aging.map((a) => (
            <div key={a.label}>
              <p className="flex items-center gap-1 text-[9.5px] text-ink-faint">
                <span className={`size-1.5 rounded-full ${a.color}`} />
                <span className="num">{a.label}</span>
              </p>
              <p className={`num text-[11px] ${a.label === "90+" ? "font-semibold text-amber-ink" : ""}`}>{compact(a.value, 2)}</p>
            </div>
          ))}
        </div>
        {r.over90.map((d) => (
          <div key={d.name} className="mt-1.5 flex items-baseline justify-between gap-2 border-t border-hairline pt-1.5 text-[11px]">
            <span className="truncate text-ink-muted">{d.name}</span>
            <span className="num shrink-0">
              <span className="text-amber-ink">{d.daysOutstanding}d</span> · {compact(d.amount, 2)}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-[12px] border border-hairline bg-white p-2.5">
          <p className="text-[10px] text-ink-muted">Payables</p>
          <p className="num text-[13px] font-semibold">{compact(e.payables, 2)}</p>
        </div>
        <div className="rounded-[12px] border border-hairline bg-white p-2.5">
          <p className="text-[10px] text-ink-muted">VAT {e.vat.period}</p>
          <p className="num text-[13px] font-semibold">
            {s.vatNet >= 0 ? "" : "Refund "}
            {compact(Math.abs(s.vatNet), 2)}
            <span className="ml-1 text-[10px] font-normal text-ink-faint">due {dateShort(e.vat.due)}</span>
          </p>
        </div>
      </div>

      {facilities.length ? (
        <div>
          <p className="text-[11px] font-semibold">Bank facilities</p>
          {facilities.map((f) => {
            const u = f.utilised / f.limit;
            return (
              <div key={f.id} className="border-t border-hairline py-2 first-of-type:mt-1.5">
                <div className="flex items-baseline justify-between text-[11px]">
                  <span className="text-ink-muted">
                    {f.bank} · {f.type}
                  </span>
                  <span className="num">
                    {compact(f.utilised, 1)} / {compact(f.limit, 1)}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#ecebe6]">
                  <span className={`block h-full rounded-full ${u >= 0.85 ? "bg-amber" : "bg-ink"}`} style={{ width: `${u * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {xs.length ? (
        <div className="space-y-1.5">
          {xs.map((x) => (
            <div key={x.id} className="flex gap-2 rounded-[12px] bg-amber-soft p-2.5">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-ink" aria-hidden />
              <div>
                <p className="text-[11px] font-semibold text-ink">{x.title}</p>
                <p className="text-[10.5px] leading-snug text-ink-muted">{x.detail}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
