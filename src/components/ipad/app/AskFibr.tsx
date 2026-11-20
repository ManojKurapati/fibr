"use client";

import { motion } from "motion/react";
import { ArrowUp, Check, Sparkles } from "lucide-react";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { PRESETS, type Preset, type PresetAnswer } from "@/lib/ask/presets";
import { SourceBadge } from "../SourceBadge";
import { AnswerBars } from "./charts";

type Msg =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "assistant"; kind: "preset"; preset: Preset; answer: PresetAnswer; status: "thinking" | "done"; step: number }
  | { id: number; role: "assistant"; kind: "text"; text: string; status: "streaming" | "done"; demo?: boolean };

const ease = [0.22, 1, 0.36, 1] as const;
const FALLBACK = "Live answers are paused in this demo right now. Try one of the preset questions below. They run on the same ledger data.";

export function AskFibr() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const idRef = useRef(0);
  const threadRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const nextId = () => ++idRef.current;

  function askPreset(p: Preset) {
    if (busy) return;
    setBusy(true);
    const answerId = nextId();
    const answer = p.answer();
    setMsgs((m) => [
      ...m,
      { id: nextId(), role: "user", text: p.question },
      { id: answerId, role: "assistant", kind: "preset", preset: p, answer, status: "thinking", step: 0 },
    ]);
    answer.steps.forEach((_, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setMsgs((m) => m.map((x) => (x.id === answerId && x.role === "assistant" && x.kind === "preset" ? { ...x, step: i + 1 } : x)));
        }, 320 * (i + 1)),
      );
    });
    timers.current.push(
      window.setTimeout(() => {
        setMsgs((m) => m.map((x) => (x.id === answerId && x.role === "assistant" && x.kind === "preset" ? { ...x, status: "done" } : x)));
        setBusy(false);
      }, 320 * (answer.steps.length + 1)),
    );
  }

  async function askLive(question: string) {
    const q = question.trim().slice(0, 500);
    if (!q || busy) return;
    setBusy(true);
    setInput("");
    const answerId = nextId();
    const history = [...msgs, { id: 0, role: "user" as const, text: q }];
    setMsgs((m) => [...m, { id: nextId(), role: "user", text: q }, { id: answerId, role: "assistant", kind: "text", text: "", status: "streaming" }]);

    const payload = history
      .map((m) =>
        m.role === "user"
          ? { role: "user" as const, content: m.text }
          : m.kind === "preset"
            ? { role: "assistant" as const, content: `${m.answer.figure}: ${m.answer.lead}` }
            : { role: "assistant" as const, content: m.text || "(no answer)" },
      )
      .slice(-6);

    const set = (text: string, done: boolean, demo = false) =>
      setMsgs((m) => m.map((x) => (x.id === answerId && x.role === "assistant" && x.kind === "text" ? { ...x, text, status: done ? "done" : "streaming", demo } : x)));

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });
      if (!res.ok || !res.body) {
        set(FALLBACK, true, true);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        set(text, false);
      }
      set(text.trim() || FALLBACK, true, !text.trim());
    } catch {
      set(FALLBACK, true, true);
    } finally {
      setBusy(false);
    }
  }

  const empty = msgs.length === 0;

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-4 pt-1 @min-[54rem]:px-5">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-x-3 gap-y-1.5">
          <div>
            <h2 className="font-display text-[24px] leading-none tracking-[-0.02em] @min-[54rem]:text-[28px]">Ask fibr</h2>
            <p className="mt-1 text-[11px] text-ink-muted">Plain-English questions, answered from all 10 ledgers</p>
          </div>
          <SourceBadge />
        </div>
      </div>

      <div ref={threadRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 @min-[54rem]:px-5">
        {empty ? (
          <div className="mx-auto flex h-full max-w-[640px] flex-col justify-center py-4">
            <span className="mx-auto grid size-10 place-items-center rounded-[12px] bg-ink text-canvas" aria-hidden>
              <Sparkles className="size-4" />
            </span>
            <p className="mt-3 text-center font-display text-[22px] leading-tight tracking-[-0.02em] @min-[54rem]:text-[26px]">
              Ask the whole group a question.
            </p>
            <p className="mt-1 text-center text-[11.5px] text-ink-muted">Every answer shows its working and where the numbers came from.</p>
            <div className="mt-4 grid gap-2 @min-[40rem]:grid-cols-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => askPreset(p)}
                  className="rounded-[14px] border border-hairline bg-white px-3.5 py-3 text-left text-[12px] font-medium leading-snug text-ink transition-[border-color,box-shadow,transform] hover:border-hairline-strong hover:shadow-[0_6px_18px_-12px_rgba(11,18,33,0.4)] active:scale-[0.99]"
                >
                  {p.question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-[760px] space-y-3 pt-1">
            {msgs.map((m) =>
              m.role === "user" ? (
                <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease }} className="flex justify-end">
                  <p className="max-w-[80%] rounded-[16px] rounded-br-[6px] bg-ink px-3.5 py-2 text-[12px] leading-snug text-canvas">{m.text}</p>
                </motion.div>
              ) : (
                <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, ease }} className="flex gap-2">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-[8px] bg-ink text-canvas" aria-hidden>
                    <Sparkles className="size-3" />
                  </span>
                  <div className="min-w-0 flex-1" aria-live="polite">
                    {m.kind === "preset" ? (
                      m.status === "thinking" ? (
                        <Thinking steps={m.answer.steps} step={m.step} />
                      ) : (
                        <PresetAnswerCard answer={m.answer} />
                      )
                    ) : (
                      <LiveAnswer text={m.text} streaming={m.status === "streaming"} demo={m.demo} />
                    )}
                  </div>
                </motion.div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-hairline bg-app px-4 pb-3 pt-2 @min-[54rem]:px-5">
        {!empty ? (
          <div className="no-scrollbar mx-auto mb-2 flex max-w-[760px] gap-1.5 overflow-x-auto">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                disabled={busy}
                onClick={() => askPreset(p)}
                className="shrink-0 rounded-full border border-hairline bg-white px-3 py-1.5 text-[11px] font-medium text-ink-muted transition-colors hover:text-ink disabled:opacity-50"
              >
                {p.short}
              </button>
            ))}
          </div>
        ) : null}
        <form
          className="mx-auto flex max-w-[760px] items-center gap-2 rounded-full border border-hairline bg-white py-1 pl-4 pr-1 shadow-[0_1px_2px_rgba(11,18,33,0.05)] focus-within:border-hairline-strong"
          onSubmit={(e) => {
            e.preventDefault();
            void askLive(input);
          }}
        >
          <label htmlFor="ask-input" className="sr-only">
            Ask fibr a question
          </label>
          <input
            id="ask-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={500}
            placeholder="Ask about cash, debtors, facilities, VAT…"
            className="min-w-0 flex-1 bg-transparent text-[12.5px] text-ink outline-none placeholder:text-ink-faint"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send question"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-canvas transition-opacity disabled:opacity-30"
          >
            <ArrowUp className="size-4" aria-hidden />
          </button>
        </form>
        <p className="mx-auto mt-1.5 max-w-[760px] text-center text-[9.5px] text-ink-faint">AI answers from illustrative data. Not a real group. Read-only: fibr never writes to your ledgers.</p>
      </div>
    </div>
  );
}

function Thinking({ steps, step }: { steps: string[]; step: number }) {
  return (
    <div className="rounded-[14px] border border-hairline bg-white px-3.5 py-3">
      <ul className="space-y-1.5">
        {steps.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={s} className={`flex items-center gap-2 text-[11.5px] transition-colors ${done ? "text-ink" : active ? "text-ink-muted" : "text-ink-faint/60"}`}>
              <span className={`grid size-3.5 place-items-center rounded-full ${done ? "bg-emerald text-white" : "border border-hairline-strong"}`}>
                {done ? <Check className="size-2.5" strokeWidth={3} aria-hidden /> : active ? <span className="size-1 animate-pulse rounded-full bg-ink-muted" /> : null}
              </span>
              {s}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PresetAnswerCard({ answer }: { answer: PresetAnswer }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-[14px] border border-hairline bg-white"
    >
      <div className="grid gap-0 @min-[54rem]:grid-cols-[1fr_1.05fr]">
        <div className="p-3.5">
          <p className="text-[10.5px] font-medium text-ink-muted">{answer.figureLabel}</p>
          <p className="num mt-0.5 text-[26px] font-semibold leading-none tracking-[-0.035em]">{answer.figure}</p>
          <p className="mt-2 text-[11.5px] leading-snug text-ink-muted">{answer.lead}</p>
          <ol className="mt-2.5">
            {answer.rows.map((r, i) => (
              <li key={`${r.label}-${i}`} className="flex items-baseline justify-between gap-3 border-t border-hairline py-1.5">
                <span className="min-w-0">
                  <span className="flex items-baseline gap-1.5 text-[11.5px] font-medium">
                    <span className="num w-3.5 shrink-0 text-[10px] text-ink-faint">{i + 1}</span>
                    <span className="truncate">{r.label}</span>
                  </span>
                  {r.sub ? <span className="block truncate pl-5 text-[10px] text-ink-faint">{r.sub}</span> : null}
                </span>
                <span className={`num shrink-0 text-[11.5px] font-semibold ${r.tone === "amber" ? "text-amber-ink" : ""}`}>{r.value}</span>
              </li>
            ))}
          </ol>
          {answer.moreNote ? <p className="num border-t border-hairline pt-1.5 text-[10px] text-ink-faint">{answer.moreNote}</p> : null}
        </div>
        <div className="border-t border-hairline bg-[#fbfaf8] p-3.5 @min-[54rem]:border-l @min-[54rem]:border-t-0">
          <p className="mb-1.5 text-[10.5px] font-semibold">{answer.chart.title}</p>
          <AnswerBars
            data={answer.chart.data}
            layout={answer.chart.layout}
            refLine={answer.chart.refLine}
            height={answer.chart.layout === "vertical" ? Math.max(150, answer.chart.data.length * 21) : 170}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline px-3.5 py-2">
        <p className="text-[10.5px] text-ink-muted">{answer.footnote}</p>
        <SourceBadge />
      </div>
    </motion.div>
  );
}

/** Renders streamed model text safely: paragraphs, "- " bullets, **bold**; numbers in mono. */
function LiveAnswer({ text, streaming, demo }: { text: string; streaming: boolean; demo?: boolean }) {
  const blocks = text.split(/\n{2,}/).filter(Boolean);
  return (
    <div className="rounded-[14px] border border-hairline bg-white px-3.5 py-3 text-[12px] leading-relaxed text-ink">
      {demo ? <span className="mb-1.5 inline-block rounded-full bg-[#ecebe6] px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Demo mode</span> : null}
      {blocks.length === 0 && streaming ? <span className="inline-block h-3.5 w-1.5 animate-pulse bg-ink-muted align-middle" /> : null}
      {blocks.map((b, i) => {
          const lines = b.split("\n");
          const bullets = lines.every((l) => /^\s*[-•*]\s+/.test(l));
          return bullets ? (
            <ul key={i} className="mt-1.5 list-disc space-y-0.5 pl-4 first:mt-0">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*[-•*]\s+/, ""))}</li>
              ))}
            </ul>
          ) : (
            <p key={i} className="mt-1.5 first:mt-0">
              {lines.map((l, j) => (
                <Fragment key={j}>
                  {j ? <br /> : null}
                  {inline(l)}
                </Fragment>
              ))}
            </p>
          );
        })}
      {!streaming && !demo ? (
        <div className="mt-2 flex justify-end">
          <SourceBadge />
        </div>
      ) : null}
    </div>
  );
}

function inline(s: string): ReactNode[] {
  const out: ReactNode[] = [];
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  parts.forEach((p, i) => {
    const bold = p.startsWith("**") && p.endsWith("**");
    const body = bold ? p.slice(2, -2) : p;
    const segs = body.split(/((?:AED\s?)?[−-]?\d[\d,]*(?:\.\d+)?(?:\s?[mk]\b|%)?)/g);
    const nodes = segs.map((seg, j) =>
      /\d/.test(seg) ? (
        <span key={j} className="num">
          {seg}
        </span>
      ) : (
        <Fragment key={j}>{seg}</Fragment>
      ),
    );
    out.push(bold ? <strong key={i} className="font-semibold">{nodes}</strong> : <Fragment key={i}>{nodes}</Fragment>);
  });
  return out;
}
