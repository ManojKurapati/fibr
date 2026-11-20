import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { allow } from "@/lib/ask/rateLimit";
import { buildSystemPrompt } from "@/lib/ask/systemPrompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(1200) }))
    .min(1)
    .max(6)
    .refine((m) => m[m.length - 1]?.role === "user", "Last message must be from the user")
    .refine((m) => m.every((x) => x.role !== "user" || x.content.length <= 500), "Question too long"),
});

const REFUSAL = "I can only answer questions about the group's finances in this demo. Try asking about cash, debtors or bank facilities.";

let client: Anthropic | null = null;
let systemPrompt: string | null = null;

/**
 * Live answers unavailable (no key, kill switch, rate limit, upstream error). Returned as 200 JSON so the
 * browser logs nothing; the client sees `ok: false` and switches to demo mode.
 */
function unavailable(code: string) {
  return Response.json({ ok: false, code }, { status: 200, headers: { "Cache-Control": "no-store" } });
}

/** Merge consecutive same-role turns so the API always sees alternating roles starting with user. */
function normalise(messages: z.infer<typeof Body>["messages"]): Anthropic.Beta.BetaMessageParam[] {
  const out: Anthropic.Beta.BetaMessageParam[] = [];
  for (const m of messages) {
    const prev = out[out.length - 1];
    if (prev && prev.role === m.role && typeof prev.content === "string") prev.content = `${prev.content}\n\n${m.content}`;
    else out.push({ role: m.role, content: m.content });
  }
  while (out[0] && out[0].role !== "user") out.shift();
  return out;
}

export async function POST(req: Request) {
  if (process.env.ASK_FIBR_ENABLED === "false" || !process.env.ANTHROPIC_API_KEY) return unavailable("disabled");

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "local";
  if (!allow(ip)) return unavailable("rate_limited");

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return unavailable("bad_request");
  }

  client ??= new Anthropic();
  systemPrompt ??= buildSystemPrompt();

  const stream = client.beta.messages.stream({
    model: "claude-opus-5-5",
    max_tokens: 2048,
    output_config: { effort: "low" },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
    messages: normalise(body.messages),
  });

  const encoder = new TextEncoder();
  const iterator = stream[Symbol.asyncIterator]();

  // Pull the first event before answering, so auth/overload errors become a clean 503 the client can fall back from.
  let first: IteratorResult<Anthropic.Beta.BetaRawMessageStreamEvent>;
  try {
    first = await iterator.next();
  } catch {
    return unavailable("upstream");
  }

  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = false;
      const push = (e: Anthropic.Beta.BetaRawMessageStreamEvent) => {
        if (e.type === "content_block_delta" && e.delta.type === "text_delta") {
          controller.enqueue(encoder.encode(e.delta.text));
          sent = true;
        }
      };
      try {
        if (!first.done) push(first.value);
        for (;;) {
          const r = await iterator.next();
          if (r.done) break;
          push(r.value);
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal" && !sent) controller.enqueue(encoder.encode(REFUSAL));
      } catch {
        if (!sent) controller.enqueue(encoder.encode(REFUSAL));
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body$, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}
