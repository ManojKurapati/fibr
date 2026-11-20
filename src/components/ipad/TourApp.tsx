"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { TourMomentId } from "@/data/content";
import type { EntityId } from "@/data/names";
import { Avatar, GroupSwitcher, StatusBar } from "./AppChrome";
import { AskFibr } from "./app/AskFibr";
import { EntityDrawer } from "./app/EntityDrawer";
import { GroupView } from "./app/GroupView";
import { BriefScreen } from "./app/tour/BriefScreen";
import { ExceptionsScreen } from "./app/tour/ExceptionsScreen";
import { StatementsScreen } from "./app/tour/StatementsScreen";
import { SummaryScreen } from "./app/tour/SummaryScreen";

const ease = [0.22, 1, 0.36, 1] as const;

/** The fibr app as shown in the product-tour theater: one screen per moment. */
export function TourApp({ moment, label }: { moment: TourMomentId; label: string }) {
  const [entityId, setEntityId] = useState<EntityId | null>(null);
  return (
    <div role="region" aria-label={label} className="relative flex h-[640px] flex-col overflow-hidden bg-app text-ink @min-[54rem]:aspect-[1194/834] @min-[54rem]:h-auto">
      {moment !== "ipad" ? (
        <>
          <StatusBar />
          <div className="flex h-12 shrink-0 items-center justify-between px-4 @min-[54rem]:h-[52px] @min-[54rem]:px-5">
            <GroupSwitcher />
            <Avatar />
          </div>
        </>
      ) : (
        <StatusBar />
      )}
      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={moment}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.24, ease }}
            className="absolute inset-0"
          >
            {moment === "dashboard" ? <GroupView onOpenEntity={setEntityId} /> : null}
            {moment === "summary" ? <SummaryScreen /> : null}
            {moment === "statements" ? <StatementsScreen /> : null}
            {moment === "exceptions" ? <ExceptionsScreen /> : null}
            {moment === "ask" ? <AskFibr /> : null}
            {moment === "ipad" ? <BriefScreen /> : null}
          </motion.div>
        </AnimatePresence>
        <EntityDrawer entityId={entityId} onClose={() => setEntityId(null)} />
      </div>
    </div>
  );
}
