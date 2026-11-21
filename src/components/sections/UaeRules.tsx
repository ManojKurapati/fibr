import { UAE_RULES } from "@/data/content";

/** Four rules as a ruled row on ink: each figure in amber, its line directly under it. */
export function UaeRules() {
  return (
    <section id="uae" aria-labelledby="uae-head" className="on-ink bg-ink py-[var(--section-gap-s)] text-paper-3">
      <div className="container">
        <h2 id="uae-head">Ready, company by company.</h2>
        <ul className="mt-[var(--space-2xl)] grid grid-cols-1 border-t-2 border-paper-3 sm:grid-cols-2 lg:grid-cols-4">
          {UAE_RULES.map((r, i) => (
            <li
              key={r.line}
              className={`min-w-0 py-[var(--space-xl)] sm:pr-[var(--space-xl)] ${i ? "border-t border-ink-rule sm:border-t-0" : ""} ${i % 2 ? "sm:border-l sm:border-ink-rule sm:pl-[var(--space-xl)]" : ""} ${i === 2 ? "lg:border-l lg:border-ink-rule lg:pl-[var(--space-xl)]" : ""}`}
            >
              <p className="num flex items-start gap-[var(--space-xs)] text-display-s font-extrabold leading-none tracking-[-0.04em] text-accent-2">
                {r.unit ? <span className="mt-[0.3em] text-sm font-medium tracking-normal text-paper-2">{r.unit}</span> : null}
                {r.figure}
              </p>
              <p className="mt-[var(--space-md)] max-w-[24ch]">{r.line}</p>
            </li>
          ))}
        </ul>
        <p className="mt-[var(--space-lg)] text-sm text-paper-2">A summary of the rules, not tax advice. Confirm your obligations with your adviser.</p>
      </div>
    </section>
  );
}
