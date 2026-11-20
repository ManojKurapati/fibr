"use client";

import { motion } from "motion/react";
import { useId, useState } from "react";
import { TOUR_MOMENTS, type TourMomentId } from "@/data/content";
import { IpadFrame } from "../ipad/IpadFrame";
import { TourApp } from "../ipad/TourApp";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProductTour() {
  const [active, setActive] = useState<TourMomentId>("dashboard");
  const uid = useId();
  const current = TOUR_MOMENTS.find((m) => m.id === active) ?? TOUR_MOMENTS[0]!;

  return (
    <section id="tour" className="relative overflow-hidden bg-obsidian py-24 text-ink-inverse sm:py-28 lg:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_75%_30%,rgba(14,159,110,0.10),transparent_70%)]" />
      <Container className="relative">
        <SectionHeading
          tone="dark"
          align="split"
          eyebrow="The product · six moments"
          title={
            <>
              What changes on <em className="italic">Monday morning.</em>
            </>
          }
          lede="Six moments from the owner's week, running on the same illustrative group as above. Pick one; the demo follows."
        />

        <div className="mt-14 lg:mt-20">
          {/* Moment selector */}
          <div
            role="tablist"
            aria-label="Product moments"
            className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-0 lg:overflow-visible lg:px-0"
          >
            {TOUR_MOMENTS.map((m) => {
              const on = m.id === active;
              return (
                <button
                  key={m.id}
                  id={`${uid}-tab-${m.id}`}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls={`${uid}-panel`}
                  onClick={() => setActive(m.id)}
                  onKeyDown={(e) => {
                    const i = TOUR_MOMENTS.findIndex((x) => x.id === active);
                    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                    if (!d) return;
                    e.preventDefault();
                    const next = TOUR_MOMENTS[(i + d + TOUR_MOMENTS.length) % TOUR_MOMENTS.length];
                    if (next) {
                      setActive(next.id);
                      document.getElementById(`${uid}-tab-${next.id}`)?.focus();
                    }
                  }}
                  tabIndex={on ? 0 : -1}
                  className={`group relative shrink-0 rounded-full px-4 py-2.5 text-left ring-1 lg:flex lg:flex-col lg:justify-start lg:self-stretch ring-inset transition-colors lg:rounded-none lg:border-t lg:px-0 lg:pb-0 lg:pr-4 lg:pt-5 lg:ring-0 ${
                    on ? "bg-white/10 ring-white/15 lg:border-white/25 lg:bg-transparent" : "ring-white/10 hover:bg-white/5 lg:border-obsidian-hairline lg:hover:bg-transparent"
                  }`}
                >
                  {on ? (
                    <motion.span layoutId={`${uid}-rule`} className="absolute -top-px left-0 hidden h-[2px] w-full bg-emerald lg:block" transition={{ duration: 0.35, ease }} />
                  ) : null}
                  <span className={`num block text-[0.75rem] ${on ? "text-emerald" : "text-ink-inverse-muted"} max-lg:inline max-lg:mr-2`}>{m.n}</span>
                  <span
                    className={`whitespace-nowrap text-[0.9375rem] font-semibold tracking-[-0.01em] lg:mt-2 lg:block lg:whitespace-normal lg:text-[1.0625rem] lg:leading-snug ${
                      on ? "text-ink-inverse" : "text-ink-inverse-muted group-hover:text-ink-inverse"
                    }`}
                  >
                    {m.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-12 lg:gap-12">
            <motion.p
              key={`b-${current.id}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease }}
              className="text-[1.0625rem] leading-relaxed text-ink-inverse-muted lg:col-span-6"
            >
              {current.body}
            </motion.p>
            <motion.p
              key={`o-${current.id}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease, delay: 0.05 }}
              className="font-display text-[1.625rem] leading-tight tracking-[-0.02em] text-ink-inverse sm:text-[1.875rem] lg:col-span-6"
            >
              <span className="eyebrow mb-3 block text-emerald">For the owner</span>
              {current.outcome}
            </motion.p>
          </div>

          {/* Theater */}
          <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`} className="mt-10 lg:mt-14">
            <IpadFrame tone="dark" className="mx-auto max-w-[1160px]">
              <TourApp moment={active} label={`fibr: ${current.title}`} />
            </IpadFrame>
          </div>
        </div>
      </Container>
    </section>
  );
}
