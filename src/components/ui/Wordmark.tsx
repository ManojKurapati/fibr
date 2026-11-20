/** The fibr wordmark — always lowercase. */
export function Wordmark({ className = "", tone = "ink" }: { className?: string; tone?: "ink" | "inverse" }) {
  return (
    <span
      className={`inline-flex items-baseline font-display text-[1.75rem] leading-none tracking-[-0.04em] ${tone === "inverse" ? "text-ink-inverse" : "text-ink"} ${className}`}
    >
      fibr
      <span aria-hidden className="ml-[0.06em] inline-block size-[0.2em] translate-y-[-0.02em] rounded-full bg-emerald" />
    </span>
  );
}
