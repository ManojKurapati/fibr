/**
 * Best-effort in-memory limiter (per server instance). For production, move to a shared store
 * (e.g. Upstash Redis / Vercel KV) so limits hold across instances.
 */
const WINDOW_MS = 10 * 60 * 1000;
const PER_IP = 8;
const GLOBAL_PER_DAY = 200;

const hits = new Map<string, number[]>();
let day = { start: Date.now(), count: 0 };

export function allow(ip: string): boolean {
  const now = Date.now();
  if (now - day.start > 86_400_000) day = { start: now, count: 0 };
  if (day.count >= GLOBAL_PER_DAY) return false;
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= PER_IP) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  day.count += 1;
  if (hits.size > 5000) hits.clear();
  return true;
}
