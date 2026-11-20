# fibr: marketing site

Every company. One screen. The marketing site for **fibr**, built to the rules in [`CLAUDE.md`](CLAUDE.md) and the blueprint in [`PLAN.md`](PLAN.md).

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run typecheck && npm run lint && npm test
```

## Verify (Definition of Done)

```bash
npm run build && npx next start -p 3000 &
BASE_URL=http://localhost:3000 npm run screens   # writes ./screenshots (git-ignored)
```

`scripts/screens.mjs` captures Desktop 1440x900, iPad landscape 1180x820 and Mobile 390x844. It also clicks through the iPad demo (tiles, drawer, Ask fibr presets and free text, facilities), the six tour moments, the roles and the booking form. It fails on console errors, hydration warnings or horizontal overflow.

## Where things live

- `src/data/names.ts`: group and company display names (placeholders; swap here only)
- `src/data/mockGroup.ts`: illustrative group data in AED. Every total is derived in `src/lib/aggregate.ts` and checked by `tests/aggregate.test.ts`
- `src/data/content.ts`: all section copy (no prices, stats or testimonials)
- `src/components/ipad/`: the iPad Pro frame and the fibr app demo
- `src/app/api/ask`: live "Ask fibr" free-text answers (Claude). Needs `ANTHROPIC_API_KEY`; without it the demo falls back to the preset questions
- `src/app/api/walkthrough`: booking stub (validates and logs a redacted summary; TODO: forward to email/CRM)

See `.env.example` for configuration.
