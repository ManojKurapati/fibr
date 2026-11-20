# fibr — Group Finance Platform Website

## Product Truth (Never Invent Pricing or Fake Claims)
- **Brand:** `fibr` (always lowercase wordmark).
- **One-liner:** Every company. One screen. One live view of every company in the group, on the owner's iPad, at any hour. No new accounting system. No re-keying. Live in 4 weeks.
- **Core architecture:** Read-only by design (reads Tally, Business Central, QuickBooks Online, Zoho Books, Shopify; never writes/posts).
- **UAE Context:** 9% corporate tax (>AED 375k) filed entity-by-entity; audited statements required for revenue >AED 50m & Qualifying Free Zone Persons (from 1 Jan 2025); hosted on Microsoft Azure UAE North (Dubai); 5% VAT tracked.
- **Commercial rule:** NEVER invent or display AED pricing bands. State "Annual group licence + per-company onboarding; tailored to group size."
- **Primary CTA everywhere:** "Book a 45-Minute iPad Walkthrough"

## Anti-"AI Slop" Design System Rules
- **Banned fonts:** Do NOT use Inter, Roboto, Arial, or Space Grotesk.
- **Typography:** Pair an editorial/executive display font (`Instrument Serif` or `Newsreader` for key display accents) with a sharp geometric sans (`Plus Jakarta Sans` or `Satoshi`) and `JetBrains Mono` with `font-variant-numeric: tabular-nums` for EVERY financial number, date, and timestamp.
- **Type contrast:** Use bold scale jumps (3x+ hero-to-body ratio), tight tracking (`-0.03em`) on display headings, and crisp uppercase tracked eyebrows (`0.12em`).
- **Color tokens (CSS variables in globals.css):**
  - `--bg-canvas: #F8F7F4` (warm alabaster, not flat `#FFFFFF`)
  - `--bg-surface: #FFFFFF` with `1px solid #E6E4DD` hairlines
  - `--bg-obsidian: #0A0F1A` (used for the UAE Compliance & Interactive iPad Theater section)
  - `--ink-primary: #0B1221`, `--ink-muted: #525B6B`
  - `--accent-emerald: #0E9F6E` (cash/headroom), `--accent-amber: #C27803` (flagged exceptions)
- **Motion discipline:** One orchestrated staggered hero reveal (`framer-motion` or CSS) + tactile tab/drawer transitions inside the iPad mockup. No bouncy gimmicks, no parallax clutter.
- **Visual centerpiece:** A photorealistic, interactive landscape iPad Pro bezel running a live **fibr** app (clickable entity tiles, working AI chat presets, 13-week maturity ladder chart via Recharts).

## Engineering & Verification Rules
- Stack: Next.js (App Router) + TypeScript + Tailwind CSS v4 + Lucide React + Recharts.
- Zero `any` types, zero console errors, zero broken responsive layouts.
- **Definition of Done:** Before finishing any UI task, run `npm run build` AND run Playwright to capture and visually inspect screenshots at Desktop (`1440x900`), iPad Landscape (`1180x820`), and Mobile (`390x844`). Fix any clipping, contrast, alignment, or overflow issues before reporting completion.
