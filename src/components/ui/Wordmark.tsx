/** The fibr wordmark, always lowercase. */
export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={`font-display text-[1.5rem] font-extrabold leading-none tracking-[-0.04em] ${className}`}>fibr</span>;
}
