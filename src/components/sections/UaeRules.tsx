import { UAE_RULES } from "@/data/content";

const TINTS = ["bg-sky", "bg-mint", "bg-peach", "bg-paper-3"] as const;

/** Four rules as clay cards in the pastel set, the figure large and the line beneath. */
export function UaeRules() {
  return (
    <section id="uae" aria-labelledby="uae-head" className="py-[var(--section-gap-s)]">
      <div className="container">
        <h2 id="uae-head">Ready, company by company.</h2>
        <ul className="mt-[var(--space-2xl)] grid grid-cols-1 gap-[var(--space-lg)] sm:grid-cols-2 lg:grid-cols-4">
          {UAE_RULES.map((r, i) => (
            <li key={r.line} className={`clay min-w-0 p-[var(--space-lg)] ${TINTS[i]}`}>
              <p className="num flex items-start gap-[var(--space-xs)] text-display-s font-extrabold leading-none tracking-[-0.04em]">
                {r.unit ? <span className="mt-[0.3em] text-sm font-medium tracking-normal text-ink-2">{r.unit}</span> : null}
                {r.figure}
              </p>
              <p className="mt-[var(--space-lg)] max-w-[24ch] text-ink-2">{r.line}</p>
            </li>
          ))}
        </ul>
        <p className="mt-[var(--space-lg)] text-sm text-muted">A summary of the rules, not tax advice. Confirm your obligations with your adviser.</p>
      </div>
    </section>
  );
}
