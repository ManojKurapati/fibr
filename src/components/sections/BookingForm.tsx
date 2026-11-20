"use client";

import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { COMPANY_COUNTS, SOURCES, TIME_WINDOWS } from "@/data/content";
import { BookingSchema, ROLE_LABELS, fieldErrors, type BookingErrors } from "@/lib/booking";
import { PRIMARY_CTA } from "../ui/CtaButton";

const ease = [0.22, 1, 0.36, 1] as const;
const LEDGER_OPTIONS = [...SOURCES, "Other"] as const;

export function BookingForm() {
  const uid = useId();
  const [errors, setErrors] = useState<BookingErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      role: String(fd.get("role") ?? ""),
      group: String(fd.get("group") ?? ""),
      companies: String(fd.get("companies") ?? ""),
      ledgers: fd.getAll("ledgers").map(String),
      window: String(fd.get("window") ?? ""),
      website: String(fd.get("website") ?? ""),
    };
    const parsed = BookingSchema.safeParse(data);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      const first = Object.keys(errs)[0];
      if (first) document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/walkthrough", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      const json: unknown = await res.json().catch(() => null);
      if (res.ok) setStatus("done");
      else {
        if (json && typeof json === "object" && "errors" in json) setErrors((json as { errors: BookingErrors }).errors);
        setStatus("failed");
      }
    } catch {
      setStatus("failed");
    }
  }

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="flex min-h-[28rem] flex-col items-start justify-center rounded-[24px] bg-surface p-8 text-ink sm:p-10"
        role="status"
      >
        <CheckCircle2 className="size-10 text-emerald" aria-hidden />
        <p className="mt-6 font-display text-[2.25rem] leading-[1.05] tracking-[-0.025em]">Thank you. Your walkthrough request is in.</p>
        <p className="mt-3 max-w-[28rem] text-[1rem] leading-relaxed text-ink-muted">
          We&apos;ll confirm your 45-minute iPad walkthrough by email.
        </p>
      </motion.div>
    );
  }

  const field = "mt-1.5 block w-full rounded-[12px] border bg-white px-3.5 py-3 text-[0.9375rem] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-faint focus:border-ink focus:shadow-[0_0_0_3px_rgba(11,18,33,0.08)]";
  const border = (k: keyof BookingErrors) => (errors[k] ? "border-amber" : "border-hairline-strong");

  return (
    <form noValidate onSubmit={onSubmit} className="relative rounded-[24px] bg-surface p-6 text-ink shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] sm:p-8" aria-describedby={`${uid}-note`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={`${uid}-name`} label="Full name" error={errors.name}>
          <input id={`${uid}-name`} name="name" autoComplete="name" className={`${field} ${border("name")}`} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-name-err` : undefined} />
        </Field>
        <Field id={`${uid}-email`} label="Work email" error={errors.email}>
          <input id={`${uid}-email`} name="email" type="email" autoComplete="email" className={`${field} ${border("email")}`} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${uid}-email-err` : undefined} />
        </Field>
        <Field id={`${uid}-group`} label="Group name" error={errors.group}>
          <input id={`${uid}-group`} name="group" autoComplete="organization" className={`${field} ${border("group")}`} aria-invalid={!!errors.group} aria-describedby={errors.group ? `${uid}-group-err` : undefined} />
        </Field>
        <Field id={`${uid}-phone`} label="Phone (optional)" error={errors.phone}>
          <input id={`${uid}-phone`} name="phone" type="tel" autoComplete="tel" placeholder="+971" className={`${field} ${border("phone")}`} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${uid}-phone-err` : undefined} />
        </Field>
        <Field id={`${uid}-role`} label="Your role" error={errors.role}>
          <select id={`${uid}-role`} name="role" defaultValue="" className={`${field} ${border("role")} appearance-none`} aria-invalid={!!errors.role} aria-describedby={errors.role ? `${uid}-role-err` : undefined}>
            <option value="" disabled>
              Choose…
            </option>
            {ROLE_LABELS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>
        <Field id={`${uid}-companies`} label="Companies in the group" error={errors.companies}>
          <select id={`${uid}-companies`} name="companies" defaultValue="" className={`${field} ${border("companies")} appearance-none`} aria-invalid={!!errors.companies} aria-describedby={errors.companies ? `${uid}-companies-err` : undefined}>
            <option value="" disabled>
              Choose…
            </option>
            {COMPANY_COUNTS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>

      <fieldset className="mt-5" aria-describedby={errors.ledgers ? `${uid}-ledgers-err` : undefined}>
        <legend className="text-[0.8125rem] font-semibold">Accounting systems in use</legend>
        <div className="mt-2 flex flex-wrap gap-2" id={`${uid}-ledgers`} tabIndex={-1}>
          {LEDGER_OPTIONS.map((l) => (
            <label key={l} className="cursor-pointer">
              <input type="checkbox" name="ledgers" value={l} className="peer sr-only" />
              <span className="inline-flex items-center rounded-full border border-hairline-strong px-3.5 py-2 text-[0.8125rem] font-medium text-ink-muted transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-canvas peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald">
                {l}
              </span>
            </label>
          ))}
        </div>
        {errors.ledgers ? (
          <p id={`${uid}-ledgers-err`} className="mt-1.5 text-[0.8125rem] text-amber-ink">
            {errors.ledgers}
          </p>
        ) : null}
      </fieldset>

      <fieldset className="mt-5" aria-describedby={errors.window ? `${uid}-window-err` : undefined}>
        <legend className="text-[0.8125rem] font-semibold">Preferred time</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3" id={`${uid}-window`} tabIndex={-1}>
          {TIME_WINDOWS.map((w) => (
            <label key={w} className="cursor-pointer">
              <input type="radio" name="window" value={w} className="peer sr-only" />
              <span className="block rounded-[12px] border border-hairline-strong px-3 py-2.5 text-center text-[0.8125rem] font-medium text-ink-muted transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-canvas peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald">
                {w}
              </span>
            </label>
          ))}
        </div>
        {errors.window ? (
          <p id={`${uid}-window-err`} className="mt-1.5 text-[0.8125rem] text-amber-ink">
            {errors.window}
          </p>
        ) : null}
      </fieldset>

      {/* Honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="group mt-7 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[0.9375rem] font-semibold text-canvas transition-colors hover:bg-[#1a2336] disabled:opacity-60"
      >
        {status === "sending" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {status === "sending" ? "Sending…" : PRIMARY_CTA}
        {status === "sending" ? null : <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />}
      </button>
      <p id={`${uid}-note`} className="mt-3 text-center text-[0.8125rem] text-ink-muted" role={status === "failed" ? "alert" : undefined}>
        {status === "failed" ? (
          <span className="text-amber-ink">Something went wrong sending your request. Please try again.</span>
        ) : (
          "45 minutes, on an iPad, with your questions. No preparation needed."
        )}
      </p>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-[0.8125rem] font-semibold">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-[0.8125rem] text-amber-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
