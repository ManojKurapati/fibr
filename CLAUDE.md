# fibr — Group Finance Platform Website

## Product Truth (Never Invent Pricing or Fake Claims)
- **Brand:** `fibr` (always lowercase wordmark).
- **The pitch: financial visibility.** Every source of financial movement in the group is captured, and a data pipeline carries every transaction, invoice and receipt into one view of the group's finances. No new accounting system. No re-keying. Live in 4 weeks.
- **Hero line:** "See every dirham move." Supporting line: "fibr pipes every transaction, invoice and receipt from every company's books into one view of the group."
- **The device is not the pitch.** No tablet or phone bezel; never sell "on the iPad"; sell visibility, capture and traceability.
- **Core architecture:** Read-only by design (reads Tally, Business Central, QuickBooks Online, Zoho Books, Shopify; never writes/posts). Do not claim other sources (bank feeds, payment gateways, receipt scanning) unless they are added here.
- **UAE Context:** 9% corporate tax (>AED 375k) filed entity-by-entity; audited statements required for revenue >AED 50m & Qualifying Free Zone Persons (from 1 Jan 2025); hosted on Microsoft Azure UAE North (Dubai); 5% VAT tracked.
- **Commercial rule:** NEVER invent or display AED pricing bands. State "Annual group licence + per-company onboarding; tailored to group size."
- **Primary CTA everywhere:** "Book a 45-minute walkthrough" (sentence case, per the design system)

## Vocabulary (use these terms consistently)
| Term | Meaning | Avoid |
|---|---|---|
| Financial visibility | The category fibr is in | "dashboard app", "iPad app" |
| Sources | The systems money is recorded in (the five above) | "integrations", "plugins" |
| Movements | Umbrella for every transaction, invoice, receipt and payment | "data", "entries" |
| Captured | A movement has been pulled from its source | "synced", "imported" |
| Pipeline | Capture → check → view, for every movement | "ETL", "feed" |
| Traceable / trace to source | Any group number opens to the invoices and receipts behind it | "drill-down" |
| Last pulled | When sources were last read (e.g. "Today, 07:00 GST") | "real-time", "instant" |
| Read-only | fibr never writes to a source | "secure sync" |

## Design System: Claymorphism (supersedes Wayfind)
Soft clay on a light pastel page. Tokens live in `src/app/tokens.css`; Floor rules in `src/app/base.css`; the clay utilities, button styles, stamp and waivers sit in `src/app/globals.css`.
- **Type:** Nunito (rounded sans) for all words, 400 body, 800 heads and buttons. Chivo Mono only for figures, dates, timestamps and references (the `num` utility), always `tabular-nums`. Banned: Inter, Roboto, Arial, Space Grotesk.
- **Colour (tokens only, OKLCH):** pale blue-grey `--color-paper`, clay surfaces `--color-paper-3`, deep ink `--color-ink` for text, `--color-accent` blue for the primary action and the selected state. Pastels with a role: `--color-mint` / `--color-mint-ink` for cash and what is fine, `--color-peach` / `--color-peach-ink` for what is flagged, `--color-sky` for supporting cards. No dark bands; no gradients.
- **Clay recipe (one recipe, three states):** `clay` (radius 28px, `--shadow-card`: offset dark shadow, offset white highlight, inner highlight and inner shade), `clay-sm` (radius 18px, smaller shadows) and `clay-pressed` (inset shadows, for fields, rails and selected things). Buttons and chips are clay pills that sink when pressed. Never a clay surface inside another of the same size; no glass, no blur, no glow.
- **Never:** eyebrows or any small uppercase tracked label; an italic word inside a heading; middle-dot meta strings; decorative status dots; en or em dashes in copy; invented metrics, logos or quotes; device bezels.
- **Budget:** about 80 words per screen, 450 visible marketing words a page, 6 to 9 sections; hero is the headline (7 words or fewer), one sentence (12 words or fewer) and its actions.
- **Motion:** soft and brief: buttons lift 1px on hover and sink on press; the hero board rolls a row in every few seconds with one soft highlight, can be paused, and is still under reduced motion. No scroll reveals, no bounce.
- **Centerpiece:** the hero's clay board of captured movements (money in mint, money out peach), then the product switcher (Group, Trace, Ask, Facilities, Statements, Exceptions, Summary) in a clay frame.

## Engineering & Verification Rules
- Stack: Next.js (App Router) + TypeScript + Tailwind CSS v4 + Lucide React + Recharts.
- Zero `any` types, zero console errors, zero broken responsive layouts.
- **Definition of Done:** Before finishing any UI task, run `npm run build`, `npm run screens` (Playwright at Desktop `1440x900`, iPad Landscape `1180x820`, Mobile `390x844`, every interactive state) and Hallmark's `sloplint --render`, then visually inspect the screenshots. Fix any clipping, contrast, alignment, or overflow issues before reporting completion.
