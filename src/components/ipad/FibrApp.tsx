"use client";

import { AnimatePresence, motion } from "motion/react";
import { Landmark, LayoutGrid, Search, Sparkles } from "lucide-react";
import { useId, useState } from "react";
import type { EntityId } from "@/data/names";
import { Avatar, GroupSwitcher, StatusBar } from "./AppChrome";
import { AskFibr } from "./app/AskFibr";
import { EntityDrawer } from "./app/EntityDrawer";
import { FacilitiesView } from "./app/FacilitiesView";
import { GroupView } from "./app/GroupView";

export type AppTab = "group" | "ask" | "facilities";

const TABS: { id: AppTab; label: string; Icon: typeof LayoutGrid }[] = [
  { id: "group", label: "Group", Icon: LayoutGrid },
  { id: "ask", label: "Ask fibr", Icon: Sparkles },
  { id: "facilities", label: "Facilities", Icon: Landmark },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function FibrApp({ initialTab = "group", label = "fibr app demo" }: { initialTab?: AppTab; label?: string }) {
  const [tab, setTab] = useState<AppTab>(initialTab);
  const [entityId, setEntityId] = useState<EntityId | null>(null);
  const uid = useId();

  return (
    <div
      role="application"
      aria-label={label}
      className="relative flex h-[700px] flex-col overflow-hidden bg-app text-ink @min-[54rem]:aspect-[1194/834] @min-[54rem]:h-auto"
    >
      <StatusBar />

      {/* Top bar */}
      <div className="relative z-20 flex h-12 shrink-0 items-center justify-between gap-3 px-4 @min-[54rem]:h-[52px] @min-[54rem]:px-5">
        <GroupSwitcher />

        {/* iPadOS floating tab bar (full layout) */}
        <TabBar uid={uid} tab={tab} onChange={setTab} className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 @min-[54rem]:flex" />

        <div className="flex items-center gap-2">
          <span className="hidden size-8 place-items-center rounded-full text-ink-muted @min-[54rem]:grid" aria-hidden>
            <Search className="size-4" />
          </span>
          <Avatar />
        </div>
      </div>

      {/* View */}
      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease }}
            className="absolute inset-0"
          >
            {tab === "group" ? <GroupView onOpenEntity={setEntityId} /> : null}
            {tab === "ask" ? <AskFibr /> : null}
            {tab === "facilities" ? <FacilitiesView onOpenEntity={setEntityId} /> : null}
          </motion.div>
        </AnimatePresence>

        <EntityDrawer entityId={entityId} onClose={() => setEntityId(null)} />
      </div>

      {/* Compact tab bar */}
      <div className="relative z-20 shrink-0 border-t border-hairline bg-app/95 px-3 pb-3 pt-2 backdrop-blur @min-[54rem]:hidden">
        <TabBar uid={`${uid}c`} tab={tab} onChange={setTab} className="flex w-full" stretch />
      </div>
    </div>
  );
}

function TabBar({
  uid,
  tab,
  onChange,
  className = "",
  stretch = false,
}: {
  uid: string;
  tab: AppTab;
  onChange: (t: AppTab) => void;
  className?: string;
  stretch?: boolean;
}) {
  return (
    <div
      role="tablist"
      aria-label="fibr sections"
      className={`items-center gap-0.5 rounded-full bg-white/80 p-1 shadow-[0_1px_2px_rgba(11,18,33,0.06),0_0_0_1px_rgba(11,18,33,0.06)] backdrop-blur-xl ${className}`}
      onKeyDown={(e) => {
        const i = TABS.findIndex((t) => t.id === tab);
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const next = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length];
          if (next) onChange(next.id);
        }
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const active = id === tab;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(id)}
            className={`relative flex h-8 items-center justify-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-semibold tracking-[-0.01em] transition-colors duration-200 ${
              stretch ? "flex-1" : ""
            } ${active ? "text-canvas" : "text-ink-muted hover:text-ink"}`}
          >
            {active ? (
              <motion.span
                layoutId={`pill-${uid}`}
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ duration: 0.24, ease }}
              />
            ) : null}
            <Icon className="relative size-3.5" aria-hidden />
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
