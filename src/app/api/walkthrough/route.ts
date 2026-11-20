import { BookingSchema, fieldErrors } from "@/lib/booking";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ ok: false, errors: {} }, { status: 400 });
  }
  const parsed = BookingSchema.safeParse(json);
  if (!parsed.success) return Response.json({ ok: false, errors: fieldErrors(parsed.error) }, { status: 422 });

  const b = parsed.data;
  // Honeypot filled: accept silently, do nothing.
  if (b.website) return Response.json({ ok: true });

  // Redacted server log only — no personal data in logs.
  console.info("[walkthrough] request", { role: b.role, companies: b.companies, ledgers: b.ledgers, window: b.window });

  // TODO: forward to email/CRM (e.g. Resend, HubSpot) — wire up before launch.
  return Response.json({ ok: true });
}
