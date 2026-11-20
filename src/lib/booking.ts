import { z } from "zod";
import { COMPANY_COUNTS, SOURCES, TIME_WINDOWS } from "../data/content";
import { ROLES } from "../data/content";

export const ROLE_LABELS = ROLES.map((r) => r.label) as [string, ...string[]];

export const BookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid work email.").max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v === "" || /^[+()\d\s-]{7,}$/.test(v), "Please enter a valid phone number, or leave it blank."),
  role: z.enum(ROLE_LABELS, { message: "Please choose your role." }),
  group: z.string().trim().min(2, "Please enter your group's name.").max(160),
  companies: z.enum(COMPANY_COUNTS, { message: "Please choose how many companies." }),
  ledgers: z.array(z.enum([...SOURCES, "Other"] as [string, ...string[]])).min(1, "Choose at least one system."),
  window: z.enum(TIME_WINDOWS, { message: "Please choose a time window." }),
  /** Honeypot — must stay empty. */
  website: z.string().max(0).optional().default(""),
});

export type Booking = z.infer<typeof BookingSchema>;
export type BookingErrors = Partial<Record<keyof Booking, string>>;

export function fieldErrors(err: z.ZodError): BookingErrors {
  const out: BookingErrors = {};
  for (const issue of err.issues) {
    const k = issue.path[0];
    if (typeof k === "string" && !(k in out)) out[k as keyof Booking] = issue.message;
  }
  return out;
}
