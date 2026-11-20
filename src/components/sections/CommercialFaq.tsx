"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { COMMERCIAL_LINE, FAQ } from "@/data/content";
import { Container } from "../ui/Container";
import { CtaButton } from "../ui/CtaButton";
import { Eyebrow } from "../ui/Eyebrow";

const ease = [0.22, 1, 0.36, 1] as const;

export function CommercialFaq() {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();
  return (
    <section className="py-24 sm:py-28 lg:py-36">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div id="pricing" className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Eyebrow>Commercial model</Eyebrow>
              <h2 className="display mt-5 text-[clamp(2.5rem,5.2vw,4.5rem)]">
                Priced for
                <br />
                <em className="italic">the whole group.</em>
              </h2>
              <div className="mt-8 rounded-[24px] bg-ink p-6 text-ink-inverse sm:p-9">
                <p className="font-display text-[1.75rem] leading-[1.1] tracking-[-0.02em] sm:text-[2rem]">{COMMERCIAL_LINE}</p>
                <ul className="mt-7 space-y-3 border-t border-white/10 pt-6 text-[0.9375rem] text-ink-inverse-muted">
                  <li className="flex justify-between gap-4">
                    <span>Annual group licence</span>
                    <span className="text-ink-inverse">The whole group</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span>Per-company onboarding</span>
                    <span className="text-ink-inverse">As each company joins</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span>Your exact figure</span>
                    <span className="text-ink-inverse">After the walkthrough</span>
                  </li>
                </ul>
                <CtaButton variant="inverse" className="mt-8 w-full sm:w-auto" />
              </div>
            </div>
          </div>

          <div id="faq" className="lg:col-span-7">
            <Eyebrow>Questions owners ask</Eyebrow>
            <ul className="mt-6 border-t border-ink">
              {FAQ.map((f, i) => {
                const on = open === i;
                return (
                  <li key={f.q} className="border-b border-hairline">
                    <h3>
                      <button
                        type="button"
                        id={`${uid}-q${i}`}
                        aria-expanded={on}
                        aria-controls={`${uid}-a${i}`}
                        onClick={() => setOpen(on ? null : i)}
                        className="group flex w-full items-start gap-5 py-6 text-left sm:py-7"
                      >
                        <span className="num mt-1.5 text-[0.8125rem] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                        <span className="flex-1 font-display text-[1.5rem] leading-[1.15] tracking-[-0.02em] sm:text-[1.875rem]">{f.q}</span>
                        <span
                          aria-hidden
                          className={`mt-1 grid size-8 shrink-0 place-items-center rounded-full ring-1 ring-inset transition-[transform,background-color,color] duration-300 ${
                            on ? "rotate-45 bg-ink text-canvas ring-ink" : "text-ink ring-hairline-strong group-hover:ring-ink"
                          }`}
                        >
                          <Plus className="size-4" />
                        </span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {on ? (
                        <motion.div
                          id={`${uid}-a${i}`}
                          role="region"
                          aria-labelledby={`${uid}-q${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-[40rem] pb-7 pl-10 pr-12 text-[1.0625rem] leading-relaxed text-ink-muted sm:pl-11">{f.a}</p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
