/**
 * Deterministic formatters (identical on server and client — no locale/timezone drift).
 * All figures render through <Num> for JetBrains Mono + tabular-nums.
 */
const MINUS = "−";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function group(intStr: string): string {
  return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** 18_400_000 → "18,400,000" */
export function amount(value: number, dp = 0): string {
  const sign = value < 0 ? MINUS : "";
  const [i, d] = Math.abs(value).toFixed(dp).split(".");
  return sign + group(i ?? "0") + (d ? `.${d}` : "");
}

/** 18_400_000 → "18.4m", 860_000 → "860k" */
export function compact(value: number, dp = 1): string {
  const sign = value < 0 ? MINUS : "";
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(dp)}m`;
  if (abs >= 1_000) return `${sign}${Math.round(abs / 1_000)}k`;
  return `${sign}${abs.toFixed(0)}`;
}

/** AED with compact or full formatting. */
export function aed(value: number, opts: { compact?: boolean; dp?: number } = {}): string {
  return `AED ${opts.compact ? compact(value, opts.dp ?? 1) : amount(value, opts.dp ?? 0)}`;
}

export function pct(ratio: number, dp = 1): string {
  const v = ratio * 100;
  return `${v < 0 ? MINUS : ""}${Math.abs(v).toFixed(dp)}%`;
}

function parseIso(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split("-").map(Number);
  return { y: y ?? 1970, m: m ?? 1, d: d ?? 1 };
}

/** "2026-11-28" → "28 Nov" (or "28 Nov 2026" with year). */
export function dateShort(iso: string, withYear = false): string {
  const { y, m, d } = parseIso(iso);
  return `${d} ${MONTHS[m - 1]}${withYear ? ` ${y}` : ""}`;
}

/** Adds days to an ISO date in UTC and returns ISO. */
export function addDays(iso: string, days: number): string {
  const { y, m, d } = parseIso(iso);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

export function daysBetween(fromIso: string, toIso: string): number {
  const a = parseIso(fromIso);
  const b = parseIso(toIso);
  return Math.round((Date.UTC(b.y, b.m - 1, b.d) - Date.UTC(a.y, a.m - 1, a.d)) / 86_400_000);
}
