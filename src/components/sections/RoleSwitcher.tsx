"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { useId, useState } from "react";
import { ROLES, type RoleId } from "@/data/content";
import { consolidated, exceptions, groupTotals, ladder, summaries } from "@/lib/aggregate";
import { compact, pct } from "@/lib/format";
import { SourceBadge } from "../ipad/SourceBadge";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;
const S = summaries();
const T = groupTotals();
const L = ladder();
const C = consolidated();

function MiniScreen({ role }: { role: RoleId }) {
  if (role === "owner") {
    const top = S.slice().sort((a, b) => b.cashToday - a.cashToday).slice(0, 5);
    const max = top[0]?.cashToday ?? 1;
    return (
      <div>
        <p className="text-[0.75rem] text-ink-muted">Group cash · today</p>
        <p className="num mt-1 text-[2.5rem] font-semibold leading-none tracking-[-0.045em]">
          <span className="mr-1 text-[0.875rem] font-medium text-ink-faint">AED</span>
          {compact(T.cashToday, 2)}
        </p>
        <ul className="mt-5 space-y-2.5">
          {top.map((s) => (
            <li key={s.entity.id} className="grid grid-cols-[7.5rem_1fr_3.5rem] items-center gap-3 text-[0.75rem]">
              <span className="truncate text-ink-muted">{s.entity.name}</span>
              <span className="h-1.5 rounded-full bg-[#ecebe6]">
                <span className="block h-full rounded-full bg-emerald" style={{ width: `${(s.cashToday / max) * 100}%` }} />
              </span>
              <span className="num text-right">{compact(s.cashToday, 1)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (role === "cfo") {
    const max = Math.max(...L.map((w) => w.maturities));
    return (
      <div>
        <p className="text-[0.75rem] text-ink-muted">Maturities · next 13 weeks</p>
        <p className="num mt-1 text-[2.5rem] font-semibold leading-none tracking-[-0.045em]">
          <span className="mr-1 text-[0.875rem] font-medium text-ink-faint">AED</span>
          {compact(L.reduce((a, w) => a + w.maturities, 0), 1)}
        </p>
        <div className="mt-5 flex h-28 items-end gap-1.5" role="img" aria-label="Weekly maturities, two weeks flagged">
          {L.map((w) => (
            <span key={w.week} className={`flex-1 rounded-t-[3px] ${w.flagged ? "bg-amber" : "bg-ink"}`} style={{ height: `${Math.max(6, (w.maturities / max) * 100)}%` }} />
          ))}
        </div>
        <div className="num mt-2 flex justify-between text-[0.6875rem] text-ink-faint">
          <span>{L[0]?.label}</span>
          <span>{L[L.length - 1]?.label}</span>
        </div>
      </div>
    );
  }
  if (role === "holding") {
    const rows = S.slice().sort((a, b) => b.netProfit - a.netProfit);
    const max = Math.max(...rows.map((r) => Math.abs(r.netProfit)));
    return (
      <div>
        <p className="text-[0.75rem] text-ink-muted">Group net profit · Jan–Oct</p>
        <p className="num mt-1 text-[2.5rem] font-semibold leading-none tracking-[-0.045em]">
          <span className="mr-1 text-[0.875rem] font-medium text-ink-faint">AED</span>
          {compact(C.group.netProfit, 1)}
        </p>
        <ul className="mt-5 space-y-1.5">
          {rows.slice(0, 6).concat(rows.slice(-1)).map((s) => (
            <li key={s.entity.id} className="grid grid-cols-[7.5rem_1fr_3.5rem] items-center gap-3 text-[0.75rem]">
              <span className="truncate text-ink-muted">{s.entity.name}</span>
              <span className="h-1.5 rounded-full bg-[#ecebe6]">
                <span className={`block h-full rounded-full ${s.netProfit < 0 ? "bg-amber" : "bg-ink"}`} style={{ width: `${(Math.abs(s.netProfit) / max) * 100}%` }} />
              </span>
              <span className={`num text-right ${s.netProfit < 0 ? "text-amber-ink" : ""}`}>{pct(s.netMargin)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  const req = S.filter((s) => s.auditRequired);
  return (
    <div>
      <p className="text-[0.75rem] text-ink-muted">Audited statements required</p>
      <p className="num mt-1 text-[2.5rem] font-semibold leading-none tracking-[-0.045em]">
        {req.length}
        <span className="ml-1.5 text-[0.875rem] font-medium text-ink-faint">of {S.length} companies</span>
      </p>
      <ul className="mt-5 divide-y divide-hairline border-y border-hairline">
        {req.map((s) => (
          <li key={s.entity.id} className="flex items-baseline justify-between gap-3 py-2 text-[0.75rem]">
            <span className="font-medium">{s.entity.name}</span>
            <span className="text-right text-ink-faint">{s.auditReasons.join(" + ")}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[0.75rem] text-ink-muted">
        <span className="num text-amber-ink">{exceptions().length}</span> open exceptions across the group
      </p>
    </div>
  );
}

export function RoleSwitcher() {
  const [role, setRole] = useState<RoleId>("owner");
  const uid = useId();
  const r = ROLES.find((x) => x.id === role) ?? ROLES[0]!;
  return (
    <section id="roles" className="py-24 sm:py-28 lg:py-36">
      <Container>
        <SectionHeading
          align="split"
          eyebrow="Who it's for"
          title={
            <>
              Same numbers.
              <br />
              <em className="italic">Your question first.</em>
            </>
          }
          lede="Everyone reads from the same ledgers and sees the same numbers. What differs is the question they start with."
        />

        <div
          role="tablist"
          aria-label="Roles"
          className="no-scrollbar -mx-4 mt-12 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:inline-flex sm:rounded-full sm:border sm:border-hairline sm:bg-surface sm:p-1 sm:px-1 lg:mt-16"
        >
          {ROLES.map((x) => {
            const on = x.id === role;
            return (
              <button
                key={x.id}
                id={`${uid}-${x.id}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`${uid}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => setRole(x.id)}
                onKeyDown={(e) => {
                  const i = ROLES.findIndex((y) => y.id === role);
                  const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                  if (!d) return;
                  e.preventDefault();
                  const n = ROLES[(i + d + ROLES.length) % ROLES.length];
                  if (n) {
                    setRole(n.id);
                    document.getElementById(`${uid}-${n.id}`)?.focus();
                  }
                }}
                className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-[0.875rem] font-semibold tracking-[-0.01em] transition-colors max-sm:ring-1 max-sm:ring-inset max-sm:ring-hairline-strong ${
                  on ? "text-canvas max-sm:ring-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                {on ? <motion.span layoutId={`${uid}-pill`} className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.28, ease }} /> : null}
                <span className="relative">{x.label}</span>
              </button>
            );
          })}
        </div>

        <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-${role}`} className="mt-8 lg:mt-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease }}
              className="grid gap-6 rounded-[24px] border border-hairline bg-surface p-6 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-12"
            >
              <div className="lg:col-span-7">
                <p className="eyebrow text-ink-faint">The question</p>
                <p className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] tracking-[-0.03em]">“{r.question}”</p>
                <ul className="mt-8 space-y-3.5">
                  {r.shows.map((s) => (
                    <li key={s} className="flex gap-3 text-[1rem] leading-relaxed text-ink">
                      <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-soft text-emerald-ink" aria-hidden>
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-[0.875rem] text-ink-muted">
                  Where they start: <span className="font-semibold text-ink">{r.opensTo}</span>
                </p>
              </div>
              <div className="lg:col-span-5">
                <div className="h-full rounded-[18px] border border-hairline bg-app p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-2">
                    <span className="text-[0.75rem] font-semibold">{r.opensTo}</span>
                    <SourceBadge />
                  </div>
                  <MiniScreen role={role} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
