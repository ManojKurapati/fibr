"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { MousePointerClick } from "lucide-react";
import { FibrApp } from "../ipad/FibrApp";
import { IpadFrame } from "../ipad/IpadFrame";
import { Container } from "../ui/Container";
import { CtaButton } from "../ui/CtaButton";
import { Eyebrow } from "../ui/Eyebrow";

const ease = [0.22, 1, 0.36, 1] as const;

const PROOF = [
  { k: "01", v: "No new accounting system" },
  { k: "02", v: "No re-keying" },
  { k: "03", v: "Live in 4 weeks" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  };
  const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };

  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-10 sm:pt-14 lg:pb-28 lg:pt-16">
      {/* Editorial column rules */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(60%_60%_at_70%_0%,rgba(14,159,110,0.07),transparent_70%)]" />
      </div>

      <Container>
        <motion.div variants={container} initial="hidden" animate="show">
          <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-7">
              <motion.div variants={item}>
                <Eyebrow className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald" aria-hidden />
                  Group finance for UAE holding groups
                </Eyebrow>
              </motion.div>
              <h1 className="display mt-6 text-[clamp(3.5rem,9.2vw,8.25rem)] text-ink">
                <motion.span variants={item} className="block">
                  Every company.
                </motion.span>
                <motion.span variants={item} className="block italic text-ink/90">
                  One screen.
                </motion.span>
              </h1>
            </div>

            <div className="flex flex-col justify-end lg:col-span-5 lg:pb-3">
              <motion.p variants={item} className="max-w-[30rem] text-[1.125rem] leading-[1.6] text-ink-muted sm:text-[1.1875rem]">
                One live view of every company in the group, on the owner&apos;s iPad, at any hour. fibr reads the ledgers you already run. It never writes to them.
              </motion.p>
              <motion.ul variants={item} className="mt-7 grid grid-cols-1 border-y border-hairline sm:grid-cols-3">
                {PROOF.map((p, i) => (
                  <li key={p.k} className={`flex items-baseline gap-2.5 py-3 sm:block sm:py-4 ${i ? "border-t border-hairline sm:border-l sm:border-t-0 sm:pl-4" : ""}`}>
                    <span className="num text-[0.75rem] text-ink-faint">{p.k}</span>
                    <span className="text-[0.9375rem] font-semibold leading-snug tracking-[-0.01em] text-ink sm:mt-1 sm:block">{p.v}</span>
                  </li>
                ))}
              </motion.ul>
              <motion.div variants={item} className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <CtaButton />
                <CtaButton href="#tour" variant="ghost" arrow={false}>
                  See the six moments
                </CtaButton>
              </motion.div>
            </div>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: reduce ? 0 : 40 },
              show: { opacity: 1, y: 0, transition: { duration: 1, ease, delay: 0.15 } },
            }}
            className="relative mt-14 lg:mt-20"
          >
            <div className="mb-4 flex items-center justify-between gap-4 text-[0.8125rem] text-ink-muted">
              <p className="flex items-center gap-2">
                <MousePointerClick className="size-4 text-ink" aria-hidden />
                <span>
                  <span className="font-semibold text-ink">Live demo.</span> Tap a company, ask a question, open the facilities ladder.
                </span>
              </p>
              <p className="hidden text-[0.75rem] sm:block">Illustrative data. Not a real group.</p>
            </div>
            <IpadFrame className="mx-auto max-w-[1160px]">
              <FibrApp label="fibr demo: group overview, Ask fibr and bank facilities" />
            </IpadFrame>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
