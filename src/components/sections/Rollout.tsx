import { ROLLOUT } from "@/data/content";

/** A route as steps: five plates joined by a 2px rule, the live stop in cobalt. */
export function Rollout() {
  return (
    <section id="rollout" aria-labelledby="rollout-head" className="py-[var(--section-gap)]">
      <div className="container">
        <h2 id="rollout-head">Live in four weeks.</h2>
        <ol className="relative mt-[var(--space-2xl)] grid grid-cols-1 gap-[var(--space-md)] md:grid-cols-5 md:gap-0">
          <span aria-hidden className="absolute bottom-0 left-[var(--space-lg)] top-0 w-[2px] bg-ink md:inset-x-0 md:bottom-auto md:left-0 md:top-1/2 md:h-[2px] md:w-auto" />
          {ROLLOUT.map((r, i) => {
            const live = r.stop === "Live";
            return (
              <li key={r.stop} className={`relative min-w-0 ${i ? "md:-ml-[2px]" : ""}`}>
                <div className={`flex min-h-[11rem] flex-col justify-between border-2 p-[var(--space-lg)] ${live ? "border-accent bg-accent text-accent-ink" : "border-ink bg-paper-3"}`}>
                  <p className={`num text-sm font-medium ${live ? "" : "text-muted"}`}>{r.week}</p>
                  <div>
                    <p className="text-title font-extrabold leading-tight tracking-[-0.02em]">{r.stop}</p>
                    <p className={`mt-[var(--space-2xs)] text-sm ${live ? "" : "text-muted"}`}>{r.line}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
