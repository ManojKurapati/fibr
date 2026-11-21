import { ROLLOUT } from "@/data/content";

/** A route of clay stops joined by a soft rail; the live stop is the filled one. */
export function Rollout() {
  return (
    <section id="rollout" aria-labelledby="rollout-head" className="py-[var(--section-gap)]">
      <div className="container">
        <h2 id="rollout-head">Live in four weeks.</h2>
        <ol className="relative mt-[var(--space-2xl)] grid grid-cols-1 gap-[var(--space-lg)] md:grid-cols-5">
          <span aria-hidden className="clay-pressed absolute bottom-0 left-[var(--space-xl)] top-0 w-3 rounded-full md:inset-x-0 md:bottom-auto md:left-0 md:top-1/2 md:h-3 md:w-auto md:-translate-y-1/2" />
          {ROLLOUT.map((r) => {
            const live = r.stop === "Live";
            return (
              <li key={r.stop} className="relative min-w-0">
                <div className={`flex min-h-[11rem] flex-col justify-between p-[var(--space-lg)] ${live ? "rounded-[var(--radius-card)] bg-accent text-accent-ink shadow-clay-sm" : "clay"}`}>
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
