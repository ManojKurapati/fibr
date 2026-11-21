# fibr marketing website: architecture blueprint

> **Design update (latest):** the page was redesigned with Hallmark (theme Wayfind): Chivo Mono throughout, no device bezel, 8 sections (hero board, before/after, product switcher, sources and security, UAE rules, 4-week route, booking, footer). CLAUDE.md is the source of truth; the component tree below is historical.

> **Positioning update (supersedes iPad-led copy below):** the pitch is financial visibility: every source captured, a data pipeline for every transaction, invoice and receipt, every number traceable to source. CTA is "Book a 45-Minute Walkthrough". Tour moment 06 is "Trace to source". A Pipeline section sits between the problem and the tour. See CLAUDE.md → Vocabulary.

## Context
The repo is new: it holds only `README.md` and `CLAUDE.md`. We are building the fibr marketing site from scratch. CLAUDE.md sets the rules (Product Truth, Anti-"AI Slop" design rules, Engineering & Verification). The site's centrepiece is a working landscape iPad Pro mockup running the fibr app. Every section supports one CTA: **"Book a 45-Minute iPad Walkthrough"**.

Decisions confirmed with you:
- **Booking form:** a Next.js route handler stub at `/api/walkthrough`. It validates with zod and returns `{ ok }`. A clearly marked TODO shows where email or a CRM plugs in. Needs a Node host such as Vercel.
- **Ask fibr chat:** live Claude API, grounded in the mock dataset through a server route. Scripted answers are the fallback.
- **Company names:** you will supply them. Until then all names sit in one file (`src/data/names.ts`) as neutral placeholders, so swapping them is a one-file change.

Approve this plan and it is saved to `PLAN.md` at the repo root. We then build it in the slices below.

---

## 1. Stack and conventions
- Next.js 15 App Router, TypeScript strict (`noImplicitAny` and `noUncheckedIndexedAccess`, so `any` is ruled out), Tailwind CSS v4 (CSS-first `@theme`), `lucide-react`, `recharts`, `motion` (the current name of framer-motion), `zod`, `@anthropic-ai/sdk`.
- **Fonts** load through `next/font/google`, self-hosted with no layout shift:
  - Display font: `Instrument Serif` (regular and italic).
  - Sans font: `Plus Jakarta Sans` (Satoshi is not on Google Fonts).
  - Numbers font: `JetBrains Mono`.
  - These are exposed as `--font-display`, `--font-sans` and `--font-mono`. Inter, Roboto, Arial and Space Grotesk never appear, not even as fallbacks: the fallback stacks are `Georgia, serif`, `ui-sans-serif, system-ui` and `ui-monospace`.
- **`<Num>` component:** every AED amount, %, date and timestamp renders through `<Num>`. It uses mono, `tabular-nums` and `lining-nums`. The plan bans raw numbers in JSX. This is checked by review and by a grep in slice 10.
- **Formatting:** `lib/format.ts` provides `aed(value, { compact })` → `AED 18.4m`, plus `pct()` and `date()` (en-AE, `Asia/Dubai` timezone).

## 2. Design tokens (`src/app/globals.css`)
```
:root {
  --bg-canvas:#F8F7F4; --bg-surface:#FFFFFF; --hairline:#E6E4DD;
  --bg-obsidian:#0A0F1A; --obsidian-raised:#111827; --obsidian-hairline:#1F2937;
  --ink-primary:#0B1221; --ink-muted:#525B6B; --ink-inverse:#F1EFEA; --ink-inverse-muted:#9AA3B2;
  --accent-emerald:#0E9F6E; --accent-amber:#C27803;
}
@theme { --color-canvas: var(--bg-canvas); ...; --font-display: ...; }
```
- **Type scale:** the hero display text is `clamp(3.25rem, 7vw, 6.5rem)` in Instrument Serif, tracked `-0.03em`. Body text is 17–18px, which keeps the hero at 3x or more of body size. Eyebrows are 12px, uppercase, tracked `0.12em`, in Jakarta 600.
- **Surfaces:** white cards with a `1px solid var(--hairline)` border. Dark sections use obsidian with `--obsidian-hairline`. We avoid heavy shadows, except for the iPad, which gets layered realistic ones.
- **Motion:** one staggered reveal in the hero (eyebrow → H1 lines → sub → CTAs → iPad, 80ms stagger, ease `[0.22,1,0.36,1]`, no overshoot). Tab and drawer transitions inside the iPad are 180–240ms crossfade plus a 6px slide. No parallax and no spring bounce. Everything respects `prefers-reduced-motion`.
- **Contrast:** check that `--ink-muted` on canvas and `--ink-inverse-muted` on obsidian are ≥ 4.5:1. Amber is used only as a badge background with dark ink, or as an icon, never as small body text on white.

## 3. File and component tree
```
src/
  app/
    layout.tsx            fonts, metadata, <SiteHeader/>, <SiteFooter/>
    page.tsx              composes sections in narrative order (server component)
    globals.css           tokens + @theme + base
    api/ask/route.ts      Claude streaming endpoint (Node runtime)
    api/walkthrough/route.ts  booking stub (zod)
    opengraph-image.tsx   wordmark + one-liner
  components/
    ui/       Container, Eyebrow, SectionHeading, Num, CtaButton (primary/ghost; scrolls to #book),
              Card, Accordion (button + region, aria-expanded), SegmentedTabs (roving tabindex, arrow keys),
              Badge (emerald/amber/neutral)
    layout/   SiteHeader (lowercase "fibr" wordmark, anchor nav, sticky, CTA), SiteFooter
    ipad/
      IpadFrame.tsx        photoreal bezel: graphite aluminium gradient rim, 18px black glass bezel,
                           landscape front camera dot, inner screen glare, layered contact + ambient shadows;
                           container-query host (@container)
      FibrApp.tsx          client; state {tab, selectedEntityId, drawerOpen}; props {initialTab, moment?}
      app/StatusBar.tsx    "Dubai 09:41" (Num), wifi/battery icons
      app/AppTabBar.tsx    Group · Ask fibr · Facilities
      app/GroupTiles.tsx   group KPI strip (cash, AR >90d, facility headroom) + 10 entity tiles
      app/EntityDrawer.tsx slide-in: entity P&L summary, aging, ledger source, last sync, exceptions
      app/AskFibr.tsx      chat thread, 4 preset chips, input, streaming render, "AI · illustrative data" note
      app/ChatAnswer.tsx   renders streamed markdown-lite (bold, lists, simple tables) safely, no raw HTML
      app/BankFacilities.tsx  facility list + headroom gauge + <MaturityLadder/>
      app/MaturityLadder.tsx  Recharts stacked BarChart, 13 weeks × facility type, amber when a week exceeds cash cover
      app/screens/*         read-only "moment" screens for the tour (Summary, Statements, Exceptions, iPad gestures)
    sections/
      Hero.tsx  StatusQuo.tsx  ProductTour.tsx  RoleSwitcher.tsx  WhyNowUAE.tsx
      SecurityPillars.tsx  PilotTimeline.tsx  Commercial.tsx  Faq.tsx  FinalCta.tsx  BookingForm.tsx
  data/
    names.ts        GROUP_NAME + 10 company display names (placeholders; user to supply)
    group.ts        10 Entity records (typed)
    facilities.ts   bank facilities + 13-week maturity schedule
    content.ts      all section copy (problem cards, tour moments, roles, FAQ, timeline) — single source for copy review
  lib/
    types.ts        Entity, AgingBuckets, Facility, Maturity, Exception, ChatPreset, etc.
    aggregate.ts    pure fns: groupCash(), arOver90(), facilityHeadroom(), ladder(), eliminations()
    format.ts       aed(), pct(), date()
    ask/systemPrompt.ts  builds the grounding prompt from data (deterministic JSON, sorted keys)
    ask/fallback.ts      scripted answers for the presets, computed with aggregate.ts
    ask/rateLimit.ts     in-memory sliding window per IP (best-effort)
scripts/screens.mjs    Playwright: 1440x900, 1180x820, 390x844 full-page + hero + iPad tab states → ./screenshots/
tests/aggregate.test.ts  vitest: totals reconcile, ladder sums = facility totals
```
Recharts is browser-only, so `MaturityLadder` loads through `next/dynamic({ ssr:false })` with a skeleton at the same size, so nothing shifts on load.

## 4. Mock data: illustrative UAE holding group (AED, as at **31 Oct 2026**)
The names below are placeholders until you supply real ones. Each record holds:
- sector, emirate/jurisdiction, free-zone and QFZP flag, ledger source(s)
- FY revenue, YTD revenue, gross margin
- cash by bank
- AR aging (0–30 / 31–60 / 61–90 / >90) with the top debtors
- AP
- VAT net position (5%) and next filing date
- CT position (9% over AED 375k)
- audit-required flag (derived)
- last sync timestamp
- exceptions

| # | Placeholder | Sector | Jurisdiction | Ledger | FY rev (AED m) | Cash 31 Oct (AED m) | Audit flag |
|---|---|---|---|---|---|---|---|
| 1 | Trading Co. A | Building-materials trading | Dubai mainland | Tally | 142 | 18.4 | >50m |
| 2 | Trading Co. B | Electronics re-export | JAFZA (free zone) | Business Central | 96 | 11.2 | >50m + QFZP |
| 3 | Manufacturing Co. A | Steel fabrication | Sharjah mainland | Business Central | 88 | 6.1 | >50m |
| 4 | Manufacturing Co. B | Plastic packaging | Ajman mainland | Tally | 41 | 3.8 | — |
| 5 | Distribution Co. A | FMCG distribution | Dubai mainland | Business Central | 210 | 14.9 | >50m |
| 6 | Distribution Co. B | Medical consumables (B2B + web store) | Abu Dhabi mainland | Zoho Books + Shopify | 37 | 4.2 | — |
| 7 | Contracting Co. A | MEP contracting | Dubai mainland | Tally | 124 | 7.6 | >50m |
| 8 | Contracting Co. B | Interior fit-out | Dubai mainland | QuickBooks Online | 29 | 2.3 | — |
| 9 | Property Co. A | Warehouse leasing | Dubai (DIC, free zone) | Zoho Books | 22 | 9.7 | QFZP |
| 10 | Property Co. B | Residential portfolio | Abu Dhabi mainland | QuickBooks Online | 14 | 5.1 | — |

- Group cash at 31 Oct is ~AED 83.3m. This is computed by code, never typed in by hand.
- AR over 90 days is concentrated in contracting (retentions) and in one distribution debtor. This answers the "Who owes us more than 90 days?" preset.
- Intercompany balances (property leases to trading and distribution, and a trading-to-manufacturing supply loan) drive the "eliminations" line in the group statements.
- **Facilities:** trust receipts, LCs, overdrafts, a term loan and a revolving facility across 5 UAE-style banks. The banks get generic labels ("Bank 1–5") so no real bank is implied. The 13-week ladder runs from w/c 2 Nov 2026 to w/c 25 Jan 2027, with two weeks flagged amber where maturities exceed the free cash forecast.
- **Exceptions (6–8):**
  - a bank account not reconciled for 9 days
  - one debtor over 90 days past an AED 1m threshold
  - a VAT return due in 12 days
  - a TR maturity cluster in week 3
  - a ledger sync more than 24h stale (QuickBooks Online company)
  - a negative gross margin month at Manufacturing Co. B
- A visible label reads "Illustrative data. Not a real group." on the iPad's status bar and in the chat footer.

## 5. Ask fibr: live Claude integration
- **Route:** `POST /api/ask` (Node runtime).
  - Request body: `{ messages: {role,content}[] }`. The body is validated with zod: at most 6 turns, at most 500 characters per user message, roles alternate.
  - Server: `new Anthropic()` reads `ANTHROPIC_API_KEY`, which lives on the server only.
  - Model `claude-opus-5-5`, `output_config: { effort: "low" }` (chat latency), `max_tokens: 2048`.
  - Uses `client.beta.messages.stream` with `betas: ["server-side-fallback-2026-07-01"]` and `fallbacks: "default"`. You asked for live answers, and this enables refusal fallback by default.
  - The system prompt is a frozen block holding the serialized dataset with `cache_control: {type:"ephemeral"}`, so repeat questions read from cache.
  - Text deltas stream to the client as `text/plain`. On `stop_reason === "refusal"`, the server sends a polite canned line.
- **Guardrails in the system prompt:**
  - Answer only from the dataset, and cite company names and figures exactly.
  - Say plainly when something isn't in the data.
  - All figures in AED as at 31 Oct 2026.
  - Never give pricing beyond "Annual group licence + per-company onboarding; tailored to group size."
  - Never claim fibr writes to ledgers.
  - No financial or tax advice: point to the group's advisers.
  - Keep answers short, with a small table where it helps.
- **Abuse and cost controls:**
  - Per-IP sliding window: 8 requests per 10 minutes, and 60 per day globally. This is in-memory and best-effort; the TODO names Upstash/Vercel KV for production.
  - Input length caps.
  - A `ASK_FIBR_ENABLED` env kill switch.
- **Fallback:** when there is no key, the switch is off, the request is rate-limited or the network fails, the route returns `503` with `{code}`. For the four presets, the client then plays the scripted answer from `lib/ask/fallback.ts`, built with the same aggregate functions so the figures match. A "Demo mode" chip appears. Free text gets "Live answers are paused, so try a preset." The client catches the error and logs nothing to the console.
- **Presets:**
  1. "What was our cash across all companies at the end of October?"
  2. "Who owes us more than 90 days?"
  3. "Which facilities mature in the next 4 weeks?"
  4. "Which companies need audited statements for corporate tax?"

## 6. Section-by-section narrative (`page.tsx` order)
| # | Section (id) | Surface | Job in the story | Key content and interaction |
|---|---|---|---|---|
| 1 | **Hero** `#top` | canvas | Promise | Eyebrow "Group finance for UAE holding groups". H1 "Every company. *One screen.*" (italic serif accent). Subhead: the one-liner. Three proof chips: "No new accounting system · No re-keying · Live in 4 weeks". Primary CTA and a ghost "See it live ↓". On the right or below: **IpadFrame + FibrApp** opening on Group Tiles. Tiles open the EntityDrawer; tabs switch to Ask fibr and Facilities (13-week ladder). |
| 2 | **Status Quo** `#problem` | canvas, white cards | Pain | Four numbered cards in large mono numerals: **01** Separate ledgers · **02** Manual Excel consolidation · **03** Days per question · **04** Stale on arrival (2–4 weeks). Each has one sentence and one Lucide icon. No invented statistics. |
| 3 | **Product Tour** `#tour`, the "iPad Theater" | **obsidian** | Solution | Six moment selectors on the left (on mobile, a horizontal scroller): Group Dashboard · Same Summary Everywhere · Group Statements · Exceptions Flagged · Ask a Question · Built for the iPad. On the right, a second FibrApp in `moment` mode that switches screens with a tactile crossfade. Each moment has a caption and a "what changed for the owner" line. |
| 4 | **Role Switcher** `#roles` | canvas | Relevance | SegmentedTabs: Chairman/Owner · Group CFO · Holding Co./Family Office · Board & Audit Committee. Each role shows three questions fibr answers for them, the view they open first, and a small mini-screen thumbnail. |
| 5 | **Why Now: UAE Corporate Tax & Audit Readiness** `#uae` | **obsidian** | Urgency | Four fact tiles with mono figures: **9%** CT on taxable income above **AED 375,000**, filed entity by entity · audited statements for revenue above **AED 50m** and for **Qualifying Free Zone Persons** (from 1 Jan 2025) · **5%** VAT tracked per entity · hosted on **Microsoft Azure UAE North (Dubai)**. Each tile ties to an in-app view (the audit flag on tiles, VAT due exceptions). Footnote: "Not tax advice; confirm obligations with your adviser." |
| 6 | **Read-Only Security & Reconciliation** `#security` | canvas | Trust | Three pillars: **Read-only by design** (reads Tally, Business Central, QuickBooks Online, Zoho Books, Shopify; never writes or posts) · **Microsoft sign-in with MFA** · **Reconciled to your last signed accounts** (zero migration). A connector strip shows the 5 source names as text in the type system, with no third-party logos. |
| 7 | **4-Week Pilot** `#pilot` | canvas | Ease | A horizontal timeline that becomes vertical on mobile: Wk 1 Scope → Wk 2 Connect → Wk 3 Load & Reconcile → Wk 4 Pilot Live → Wk 5+ Roll Out. Caption: "Start with 2–3 pilot companies." Each step lists what we do and what we need from you. |
| 8 | **Commercial + FAQ** `#pricing` `#faq` | canvas | Objections | The commercial card says exactly "Annual group licence + per-company onboarding; tailored to group size." with no figures, plus a CTA. Below it, an accordion of the five objections: (1) Do we have to replace or change our accounting systems? (2) Where is our data, and who can see it? (3) Will the numbers match our audited accounts? (4) How much of our finance team's time does it take? (5) What does it cost, and how is it priced? |
| 9 | **Final CTA** `#book` | obsidian band → white form card | Action | H2 "One view. Nothing changes. *Four weeks.*" next to an inline BookingForm. |

**BookingForm.** Fields:
- name, work email, phone (optional)
- role (the 4 roles)
- group name
- number of companies (2–5 / 6–10 / 11–20 / 20+)
- ledgers used (checkboxes for the 5 sources plus Other)
- preferred time window
- hidden honeypot

The form validates with zod on both client and server, and the same schema is shared from `lib/booking.ts`. It has inline accessible errors, a pending state, and a success state: "Thanks. We'll confirm your 45-minute iPad walkthrough by email." The route logs only a redacted summary, plus `// TODO: forward to email/CRM`.

**Header and footer.**
- Header: wordmark, anchors (Product · Why now · Security · Pilot · FAQ), and the CTA. On mobile the nav collapses into a sheet.
- Footer: wordmark, the one-liner, "Hosted on Microsoft Azure UAE North (Dubai)", © year, and the illustrative-data disclaimer.

**Copy rules.** No customer logos, testimonials, performance stats or prices unless you supply them. "Live in 4 weeks" stays consistent with the timeline (Pilot Live in week 4).

## 7. Responsive strategy for the iPad
- The bezel is a fixed 4:3-ish landscape (`aspect-[1.4]`) and the app inside uses **container queries**, so the same component works in the hero, in the theater and at every size:
  - **≥ 1024px:** hero in two columns (copy left, iPad right, width about 640–720px). At 1440 the iPad holds about 56% of the width.
  - **1180x820 (iPad landscape):** hero stacks with the copy above and the iPad full width (about 1040px).
  - **390px:** the bezel thins to 8px and keeps the rounded glass look. The app switches to its compact layout: 2-column tiles, a bottom tab bar, the drawer as a full-screen sheet, and the ladder scrolling horizontally inside the chart card only. The page itself never scrolls horizontally.

## 8. Vertical slices (each ends with build + 3-viewport screenshots)
1. **Scaffold:**
   - Set up `create-next-app` (TS, App Router, Tailwind v4, src dir), the fonts, tokens, ui primitives, SiteHeader and SiteFooter, and an empty section shell.
   - Add `scripts/screens.mjs` and the npm scripts `build`, `lint`, `typecheck`, `test` and `screens`.
2. **Data layer:** `types.ts`, `names.ts`, `group.ts`, `facilities.ts`, `aggregate.ts`, `format.ts`, plus vitest reconciliation tests.
3. **Hero + iPad shell + Group Tiles + EntityDrawer**, with the staggered reveal.
4. **Bank Facilities tab** and the Recharts 13-week maturity ladder.
5. **Ask fibr:**
   - `/api/ask` streaming route (Claude), system prompt builder, rate limit, kill switch.
   - Chat UI, presets and scripted fallback.
   - `.env.example` listing `ANTHROPIC_API_KEY` and `ASK_FIBR_ENABLED`.
6. **Status Quo + Product Tour** (obsidian theater, six moment screens).
7. **Role Switcher + Why Now UAE + Security pillars.**
8. **Pilot Timeline + Commercial + FAQ accordion.**
9. **Final CTA + BookingForm + `/api/walkthrough`.**
10. **Hardening:**
    - metadata and OG image, a11y pass (keyboard on tabs, drawer, accordion; focus rings; aria-live for streaming chat), reduced motion.
    - grep checks: no banned fonts, no `any`, no raw numbers outside `<Num>`, no "AED" next to price words.
    - final screenshot review.

Swapping in your names happens whenever you send them and touches only `src/data/names.ts`.

## 9. Verification (Definition of Done for every slice)
- `npm run typecheck && npm run lint && npm test && npm run build` all pass.
- `npm run screens` starts `next start` and captures with Playwright at **1440x900, 1180x820 and 390x844**:
  - the full page
  - the hero
  - each iPad tab (Group, drawer open, Ask fibr with a preset answered, Facilities)
  - each tour moment
  - the FAQ open
  - the form error and success states
- The script fails on any `console.error`/`pageerror` and on `document.scrollingElement.scrollWidth > innerWidth` (horizontal overflow).
- Inspect the screenshots for clipping, contrast and alignment, and fix before reporting.
- **Ask fibr testing:**
  - With no key, the fallback path is verified automatically.
  - With a key in the environment, run one live preset manually and confirm the figures match `aggregate.ts`. This is reported to you with the cost noted, since every live call is billed.
- After approval, commit `PLAN.md` to `claude/eloquent-cerf-zo693l`.
