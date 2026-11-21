"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { ENTITIES } from "@/data/mockGroup";
import { amount, dateShort } from "@/lib/format";
import { latestMovements } from "@/lib/movements";
import type { Movement } from "@/lib/types";
import { Button } from "../ui/Button";

const SIGN: Record<Movement["kind"], string> = { "Sales invoice": "", Receipt: "", "Web order": "", "Purchase invoice": "−", Payment: "−" };

/** Every company's latest movements, newest first: the pool the board rolls through. */
const POOL: Movement[] = ENTITIES.flatMap((e) => latestMovements(e.id))
  .sort((a, b) => `${b.date} ${b.time ?? ""}`.localeCompare(`${a.date} ${a.time ?? ""}`));
const ROWS = 6;
const companyName = (id: Movement["entityId"]) => ENTITIES.find((e) => e.id === id)?.name ?? "";

/**
 * Poster hero: a departures board of captured movements fills the ink band, the head rests at its base.
 * The markup holds the first six rows, so it reads with scripting off; it rolls only when motion is allowed,
 * and it can be paused.
 */
export function Hero() {
  const [offset, setOffset] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setRunning(!still);
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setOffset((o) => (o + 1) % POOL.length), 3200);
    return () => window.clearInterval(t);
  }, [running]);

  // Newest row on top: shift the window back through the pool as rows "arrive".
  const rows = Array.from({ length: ROWS }, (_, i) => POOL[(POOL.length - offset + i) % POOL.length]!);

  return (
    <section id="top" className="text-ink">
      <div className="container flex min-h-[min(calc(92dvh-4rem),52rem)] flex-col justify-between gap-[var(--space-2xl)] py-[var(--space-lg)] max-sm:gap-[var(--space-xl)]">
        <div className="clay px-[var(--space-lg)] pb-[var(--space-sm)] pt-[var(--space-md)] max-sm:px-[var(--space-md)]">
          <div className="flex items-center justify-between gap-[var(--space-md)] border-b border-rule pb-[var(--space-xs)] text-sm font-extrabold">
            <p className="min-w-0 truncate">Captured movements, demo group</p>
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              aria-pressed={!running}
              className="clay-sm inline-flex min-h-11 shrink-0 items-center gap-[var(--space-xs)] whitespace-nowrap rounded-full px-[var(--space-md)] font-extrabold transition-transform active:translate-y-px"
            >
              {running ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
              <span className="max-sm:hidden">{running ? "Pause updates" : "Resume updates"}</span><span className="sm:hidden">{running ? "Pause" : "Resume"}</span>
            </button>
          </div>
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="visually-hidden">The latest invoices, receipts and payments captured across the group</caption>
            <thead>
              <tr className="text-sm text-muted">
                <th scope="col" className="w-[9rem] py-[var(--space-xs)] font-medium max-md:hidden">
                  Captured
                </th>
                <th scope="col" className="py-[var(--space-xs)] font-medium">
                  Company
                </th>
                <th scope="col" className="py-[var(--space-xs)] font-medium max-lg:hidden">
                  Movement
                </th>
                <th scope="col" className="py-[var(--space-xs)] font-medium max-xl:hidden">
                  Reference
                </th>
                <th scope="col" className="w-[11rem] py-[var(--space-xs)] font-medium max-sm:hidden">
                  Source
                </th>
                <th scope="col" className="w-[9rem] py-[var(--space-xs)] text-right font-medium sm:w-[11rem]">
                  AED
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m, i) => (
                <tr key={`${m.id}-${offset}`} className={`border-t border-rule ${i === 0 && offset > 0 ? "arrive" : ""} ${i >= 3 ? "max-sm:hidden" : ""}`}>
                  <td className="num py-[var(--space-xs)] lg:py-[10px] text-muted max-md:hidden">
                    {dateShort(m.date)} {m.time}
                  </td>
                  <td className="truncate py-[var(--space-xs)] lg:py-[10px] pr-[var(--space-md)] font-medium">{companyName(m.entityId)}</td>
                  <td className="truncate py-[var(--space-xs)] lg:py-[10px] pr-[var(--space-md)] max-lg:hidden">{m.kind}</td>
                  <td className="num truncate py-[var(--space-xs)] lg:py-[10px] pr-[var(--space-md)] text-muted max-xl:hidden">{m.ref}</td>
                  <td className="truncate py-[var(--space-xs)] lg:py-[10px] pr-[var(--space-md)] max-sm:hidden">{m.source}</td>
                  <td className={`num py-[var(--space-xs)] lg:py-[10px] text-right text-lead font-extrabold ${SIGN[m.kind] ? "text-peach-ink" : "text-mint-ink"}`}>
                    {SIGN[m.kind]}
                    {amount(m.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid items-end gap-[var(--space-xl)] lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h1 className="max-w-none">See every dirham move.</h1>
            <p className="lead mt-[var(--space-md)] text-muted">Every transaction, invoice and receipt from every company, in one view.</p>
          </div>
          <div className="flex flex-wrap gap-[var(--space-sm)] lg:col-span-4 lg:justify-end">
            <Button primary />
            <Button href="#product">Open the demo</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
