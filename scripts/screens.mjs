/**
 * Visual + UX verification (CLAUDE.md Definition of Done).
 * Usage: BASE_URL=http://localhost:3000 node scripts/screens.mjs [outDir]
 * Captures Desktop 1440x900, iPad landscape 1180x820 and Mobile 390x844, clicks through every
 * interactive state of the product demo, and fails on console errors, hydration warnings or
 * horizontal overflow.
 */
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

// Resolve Playwright from the project or the machine-wide install (NODE_PATH).
const { chromium } = createRequire(import.meta.url)("playwright");

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = process.argv[2] ?? "screenshots";
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "ipad", width: 1180, height: 820 },
  { name: "mobile", width: 390, height: 844 },
];
const CTA = /Book a 45-minute walkthrough/;

const problems = [];
const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const log = [];
  page.on("console", (m) => {
    if (m.type() === "error" || (m.type() === "warning" && /hydrat|did not match|key prop|Recharts|width\(0\)/i.test(m.text()))) log.push(`${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => log.push(`pageerror: ${e.message}`));

  const pause = (ms = 450) => page.waitForTimeout(ms);
  const overflow = async (label) => {
    const o = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (o > 0) problems.push(`${vp.name}: horizontal overflow ${o}px ${label}`);
  };

  await page.goto(BASE, { waitUntil: "networkidle" });
  await pause(1200);
  await page.screenshot({ path: `${OUT}/${vp.name}-01-fold.png` });
  await overflow("on load");

  // ---- Hero board: pause/play control ----
  const board = page.locator("#top");
  await board.getByRole("button", { name: /Pause|Play/ }).click();
  await pause(300);

  // ---- Product switcher ----
  const product = page.locator("#product");
  const frame = product.getByRole("tabpanel");
  await product.scrollIntoViewIfNeeded();
  await pause();
  await frame.screenshot({ path: `${OUT}/${vp.name}-02-group.png` });

  await frame.getByRole("button", { name: /Manufacturing Co\. B: cash/ }).click();
  await pause(600);
  await frame.screenshot({ path: `${OUT}/${vp.name}-03-drawer-pnl.png` });
  for (const t of ["Cash", "Movements"]) {
    await frame.getByRole("tab", { name: new RegExp(`^${t}$`) }).click();
    await pause(400);
    await frame.screenshot({ path: `${OUT}/${vp.name}-04-drawer-${t.toLowerCase()}.png` });
  }
  await frame.getByRole("button", { name: "Close", exact: true }).click();
  await pause(400);

  const tabs = product.getByRole("tablist", { name: "Product views" });
  for (const t of ["Trace", "Facilities", "Statements", "Exceptions", "Summary"]) {
    await tabs.getByRole("tab", { name: t, exact: true }).click();
    await pause(700);
    await frame.screenshot({ path: `${OUT}/${vp.name}-05-${t.toLowerCase()}.png` });
  }

  await tabs.getByRole("tab", { name: "Ask", exact: true }).click();
  await pause(500);
  await frame.getByRole("button", { name: /cash across all companies at the end of October/ }).click();
  await pause(2200);
  await frame.screenshot({ path: `${OUT}/${vp.name}-06-ask-cash.png` });
  await frame.getByLabel("Ask fibr a question").fill("Which company has the highest net margin?");
  await frame.getByRole("button", { name: "Send question" }).click();
  await pause(2500);
  await frame.screenshot({ path: `${OUT}/${vp.name}-07-ask-live.png` });

  // ---- Header Ask pill (desktop widths only) runs a real question ----
  const pill = page.getByRole("button", { name: /Ask fibr: Who owes us more than 90 days/ });
  if (await pill.isVisible()) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await pill.click();
    await pause(2600);
    await frame.screenshot({ path: `${OUT}/${vp.name}-08-pill-ask.png` });
  }

  // ---- Sections ----
  for (const id of ["sources", "uae", "rollout"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await pause(250);
    await page.locator(`#${id}`).screenshot({ path: `${OUT}/${vp.name}-09-${id}.png` });
  }

  // ---- Booking form: errors, then success ----
  const book = page.locator("#book");
  await book.scrollIntoViewIfNeeded();
  await book.getByRole("button", { name: CTA }).click();
  await pause(400);
  await book.screenshot({ path: `${OUT}/${vp.name}-10-form-errors.png` });
  await book.getByLabel("Full name").fill("Test Owner");
  await book.getByLabel("Work email").fill("owner@example.com");
  await book.getByLabel("Group name").fill("Example Holding");
  await book.getByLabel("Your role").selectOption({ index: 1 });
  await book.getByLabel("Companies in the group").selectOption({ index: 2 });
  await book.locator('label:has(input[value="Tally"])').click();
  await book.locator('label:has(input[name="window"])').first().click();
  await book.getByRole("button", { name: CTA }).click();
  await pause(1200);
  await book.screenshot({ path: `${OUT}/${vp.name}-11-form-success.png` });

  await page.screenshot({ path: `${OUT}/${vp.name}-00-full.png`, fullPage: true });
  await overflow("after interaction");
  for (const l of log) problems.push(`${vp.name}: ${l}`);
  await page.close();
}

await browser.close();
if (problems.length) {
  console.error("FAIL\n" + problems.join("\n"));
  process.exit(1);
}
console.log(`OK: screenshots in ${OUT}/, no console errors, no hydration warnings, no horizontal overflow.`);
