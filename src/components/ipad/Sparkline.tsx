/** Tiny dependency-free sparkline for tiles (10 points). */
export function Sparkline({ values, className = "" }: { values: number[]; className?: string }) {
  const w = 100;
  const h = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - 3 - ((v - min) / span) * (h - 6)] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={className} aria-hidden>
      <path d={`${d} L${w} ${h} L0 ${h} Z`} fill="currentColor" opacity="0.08" />
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.25" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}
