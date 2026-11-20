import { PILOT_STEPS } from "@/data/content";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

export function PilotTimeline() {
  return (
    <section id="pilot" className="border-t border-hairline bg-[#f2f0eb] py-24 sm:py-28 lg:py-36">
      <Container>
        <SectionHeading
          align="split"
          eyebrow="The 4-week pilot"
          title={
            <>
              Every movement visible
              <br />
              <em className="italic">in four weeks.</em>
            </>
          }
          lede="Start with 2–3 pilot companies. Connect their sources, prove every number ties out, then roll out the rest at your pace."
        />

        <ol className="relative mt-14 grid gap-0 lg:mt-20 lg:grid-cols-5">
          {/* Track */}
          <span aria-hidden className="absolute bottom-0 left-[7px] top-0 w-px bg-hairline-strong lg:bottom-auto lg:left-0 lg:right-0 lg:top-[7px] lg:h-px lg:w-auto" />
          <span aria-hidden className="absolute left-[7px] top-0 h-[80%] w-px bg-ink lg:left-0 lg:top-[7px] lg:h-px lg:w-[80%]" />
          {PILOT_STEPS.map((s, i) => {
            const live = i === 3;
            const after = i === 4;
            return (
              <li key={s.title} className="relative pb-10 pl-10 last:pb-0 lg:pb-0 lg:pl-0 lg:pr-6">
                <span
                  aria-hidden
                  className={`absolute left-0 top-0 grid size-[15px] place-items-center rounded-full lg:left-0 ${
                    live ? "bg-emerald ring-4 ring-emerald/20" : after ? "border border-hairline-strong bg-[#f2f0eb]" : "bg-ink"
                  }`}
                />
                <p className={`num text-[0.8125rem] lg:mt-8 ${live ? "text-emerald-ink" : "text-ink-muted"}`}>{s.week}</p>
                <h3 className="mt-2 font-display text-[2rem] leading-none tracking-[-0.025em]">{s.title}</h3>
                <dl className="mt-5 space-y-4 text-[0.9375rem] leading-relaxed">
                  <div>
                    <dt className="eyebrow text-ink-faint">We do</dt>
                    <dd className="mt-1.5 text-ink">{s.we}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-ink-faint">You do</dt>
                    <dd className="mt-1.5 text-ink-muted">{s.you}</dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
