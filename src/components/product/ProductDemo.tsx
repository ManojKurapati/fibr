"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useState } from "react";
import { MOMENTS, type MomentId } from "@/data/content";
import type { EntityId } from "@/data/names";
import type { OpenDemoDetail } from "@/lib/openDemo";
import { Avatar, GroupSwitcher } from "../ipad/AppChrome";
import { AskFibr } from "../ipad/app/AskFibr";
import { EntityDrawer } from "../ipad/app/EntityDrawer";
import { FacilitiesView } from "../ipad/app/FacilitiesView";
import { GroupView } from "../ipad/app/GroupView";
import { ExceptionsScreen } from "../ipad/app/tour/ExceptionsScreen";
import { StatementsScreen } from "../ipad/app/tour/StatementsScreen";
import { SummaryScreen } from "../ipad/app/tour/SummaryScreen";
import { TraceScreen } from "../ipad/app/tour/TraceScreen";

/**
 * The product, built at full fidelity and unframed: a square 2px ink border, no device chrome.
 * A segmented control of square cells switches the view; the first view renders without script.
 */
export function ProductDemo() {
  const [moment, setMoment] = useState<MomentId>("group");
  const [preset, setPreset] = useState<{ id: string; n: number } | null>(null);
  const [entityId, setEntityId] = useState<EntityId | null>(null);
  const uid = useId();
  const current = MOMENTS.find((m) => m.id === moment) ?? MOMENTS[0]!;

  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<OpenDemoDetail>).detail;
      setEntityId(null);
      setMoment(d.moment);
      if (d.preset) setPreset((p) => ({ id: d.preset ?? "", n: (p?.n ?? 0) + 1 }));
    };
    window.addEventListener("fibr:open", onOpen);
    return () => window.removeEventListener("fibr:open", onOpen);
  }, []);

  const pick = (id: MomentId) => {
    setEntityId(null);
    setPreset(null);
    setMoment(id);
  };

  return (
    <figure className="m-0">
      <div
        role="tablist"
        aria-label="Product views"
        className="no-scrollbar flex overflow-x-auto"
        onKeyDown={(e) => {
          const i = MOMENTS.findIndex((m) => m.id === moment);
          const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          const next = MOMENTS[(i + d + MOMENTS.length) % MOMENTS.length];
          if (next) {
            pick(next.id);
            document.getElementById(`${uid}-${next.id}`)?.focus();
          }
        }}
      >
        {MOMENTS.map((m, i) => {
          const on = m.id === moment;
          return (
            <button
              key={m.id}
              id={`${uid}-${m.id}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`${uid}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => pick(m.id)}
              className={`min-h-12 shrink-0 border-2 border-ink px-[var(--space-md)] text-sm font-medium transition-colors duration-[var(--dur-micro)] ease-[steps(1)] ${
                i ? "-ml-[2px]" : ""
              } ${on ? "bg-ink text-paper-3" : "bg-paper-3 hover:bg-paper-2"}`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-${moment}`}
        className="@container relative mt-[var(--space-sm)] flex h-[720px] flex-col overflow-hidden border-2 border-ink bg-app text-ink max-sm:h-[660px]"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-rule px-[var(--space-md)]">
          <GroupSwitcher />
          <Avatar />
        </div>
        <div className="relative min-h-0 flex-1 pt-[var(--space-sm)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={moment}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="absolute inset-0 pt-[var(--space-sm)]"
            >
              {moment === "group" ? <GroupView onOpenEntity={setEntityId} /> : null}
              {moment === "trace" ? <TraceScreen /> : null}
              {moment === "ask" ? <AskFibr key={preset ? `p${preset.n}` : "ask"} autoPreset={preset?.id} /> : null}
              {moment === "facilities" ? <FacilitiesView onOpenEntity={setEntityId} /> : null}
              {moment === "statements" ? <StatementsScreen /> : null}
              {moment === "exceptions" ? <ExceptionsScreen /> : null}
              {moment === "summary" ? <SummaryScreen /> : null}
            </motion.div>
          </AnimatePresence>
          <EntityDrawer entityId={entityId} onClose={() => setEntityId(null)} />
        </div>
      </div>
      <figcaption className="mt-[var(--space-sm)] text-sm">{current.caption}</figcaption>
    </figure>
  );
}
