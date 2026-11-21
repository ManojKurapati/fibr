"use client";

import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { COMPANY_COUNTS, PRIMARY_CTA, SOURCES, TIME_WINDOWS } from "@/data/content";
import { BookingSchema, ROLE_LABELS, fieldErrors, type BookingErrors } from "@/lib/booking";
import { BOOKING_EMAIL, STATIC_EXPORT } from "@/lib/runtime";

const LEDGER_OPTIONS = [...SOURCES, "Other"] as const;

export function BookingForm() {
  const uid = useId();
  const [errors, setErrors] = useState<BookingErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed" | "mailto" | "preview">("idle");

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
    if (STATIC_EXPORT) {
      // Static (GitHub Pages) build: no server to receive the request.
      if (BOOKING_EMAIL) {
        const b = parsed.data;
        const body = [`Name: ${b.name}`, `Email: ${b.email}`, `Phone: ${b.phone || "-"}`, `Role: ${b.role}`, `Group: ${b.group}`, `Companies: ${b.companies}`, `Sources: ${b.ledgers.join(", ")}`, `Preferred time: ${b.window}`].join("\n");
        window.location.href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent("fibr walkthrough request")}&body=${encodeURIComponent(body)}`;
        setStatus("mailto");
      } else {
        setStatus("preview");
      }
      return;
    }
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

  if (status === "done" || status === "mailto" || status === "preview") {
    const copy =
      status === "done"
        ? { title: "Request received.", body: "We will confirm your 45-minute walkthrough by email." }
        : status === "mailto"
          ? { title: "Send the email to finish.", body: "Your email app has opened with your details filled in." }
          : { title: "This preview cannot send requests yet.", body: "Online booking is not connected on this preview site. Nothing was sent." };
    return (
      <div role="status" className="flex min-h-[28rem] flex-col justify-center border-2 border-ink bg-paper-3 p-[var(--space-xl)]">
        <span className="grid size-12 place-items-center bg-accent text-accent-ink" aria-hidden>
          <Check className="size-6" strokeWidth={3} />
        </span>
        <p className="mt-[var(--space-lg)] text-title font-extrabold tracking-[-0.02em]">{copy.title}</p>
        <p className="mt-[var(--space-xs)] text-muted">{copy.body}</p>
      </div>
    );
  }

  const field =
    "mt-[var(--space-xs)] block min-h-12 w-full rounded-none border-2 bg-paper-3 px-[var(--space-md)] py-[var(--space-sm)] text-ink outline-none placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";
  const border = (k: keyof BookingErrors) => (errors[k] ? "border-error" : "border-ink");
  const choice =
    "block cursor-pointer border-2 border-ink bg-paper-3 px-[var(--space-md)] py-[var(--space-sm)] text-center text-sm font-medium transition-colors duration-[var(--dur-micro)] ease-[steps(1)] peer-checked:bg-ink peer-checked:text-paper-3 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus hover:bg-paper-2";

  return (
    <form noValidate onSubmit={onSubmit} className="relative" aria-describedby={`${uid}-note`}>
      <div className="grid gap-[var(--space-lg)] sm:grid-cols-2">
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
          <Chevron />
          <select id={`${uid}-role`} name="role" defaultValue="" className={`${field} ${border("role")} appearance-none pr-[var(--space-2xl)]`} aria-invalid={!!errors.role} aria-describedby={errors.role ? `${uid}-role-err` : undefined}>
            <option value="" disabled>
              Choose
            </option>
            {ROLE_LABELS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>
        <Field id={`${uid}-companies`} label="Companies in the group" error={errors.companies}>
          <Chevron />
          <select id={`${uid}-companies`} name="companies" defaultValue="" className={`${field} ${border("companies")} appearance-none pr-[var(--space-2xl)]`} aria-invalid={!!errors.companies} aria-describedby={errors.companies ? `${uid}-companies-err` : undefined}>
            <option value="" disabled>
              Choose
            </option>
            {COMPANY_COUNTS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>

      <fieldset className="mt-[var(--space-xl)] min-w-0 border-0 p-0" aria-describedby={errors.ledgers ? `${uid}-ledgers-err` : undefined}>
        <legend className="text-sm font-medium">Sources in use</legend>
        <div className="mt-[var(--space-xs)] flex flex-wrap gap-[var(--space-xs)]" id={`${uid}-ledgers`} tabIndex={-1}>
          {LEDGER_OPTIONS.map((l) => (
            <label key={l}>
              <input type="checkbox" name="ledgers" value={l} className="peer sr-only" />
              <span className={choice}>{l}</span>
            </label>
          ))}
        </div>
        {errors.ledgers ? (
          <p id={`${uid}-ledgers-err`} className="mt-[var(--space-xs)] text-sm font-medium text-error">
            {errors.ledgers}
          </p>
        ) : null}
      </fieldset>

      <fieldset className="mt-[var(--space-xl)] min-w-0 border-0 p-0" aria-describedby={errors.window ? `${uid}-window-err` : undefined}>
        <legend className="text-sm font-medium">Preferred time</legend>
        <div className="mt-[var(--space-xs)] grid gap-[var(--space-xs)] sm:grid-cols-3" id={`${uid}-window`} tabIndex={-1}>
          {TIME_WINDOWS.map((w) => (
            <label key={w}>
              <input type="radio" name="window" value={w} className="peer sr-only" />
              <span className={choice}>{w}</span>
            </label>
          ))}
        </div>
        {errors.window ? (
          <p id={`${uid}-window-err`} className="mt-[var(--space-xs)] text-sm font-medium text-error">
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

      <button type="submit" disabled={status === "sending"} aria-busy={status === "sending"} className="btn btn--primary mt-[var(--space-xl)] w-full">
        {status === "sending" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {status === "sending" ? "Sending" : PRIMARY_CTA}
      </button>
      <p id={`${uid}-note`} className="mt-[var(--space-sm)] text-sm text-muted" role={status === "failed" ? "alert" : undefined}>
        {status === "failed" ? <span className="font-medium text-error">The request did not send. Please try again.</span> : "No preparation needed."}
      </p>
    </form>
  );
}

function Chevron() {
  return <ChevronDown aria-hidden className="pointer-events-none absolute bottom-[14px] right-[var(--space-md)] size-4" />;
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="relative">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-[var(--space-xs)] text-sm font-medium text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
