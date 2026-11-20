/**
 * Visual + UX verification (CLAUDE.md Definition of Done).
 * Usage: BASE_URL=http://localhost:3000 node scripts/screens.mjs [outDir]
 * Captures Desktop 1440x900, iPad landscape 1180x820 and Mobile 390x844, clicks through every
 * interactive state of the iPad demo, and fails on console errors, hydration warnings or
 * horizontal page overflow.
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

const problems = [];
const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const log = [];
  page.on("console", (m) => {
    if (m.type() === "error" || (m.type() === "warning" && /hydrat|did not match|key prop|Recharts|width\(0\)/i.test(m.text()))) log.push(`${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => log.push(`pageerror: ${e.message}`));

  const shot = async (name, opts = {}) => page.screenshot({ path: `${OUT}/${vp.name}-${name}.png`, ...opts });
  const pause = (ms = 450) => page.waitForTimeout(ms);

  await page.goto(BASE, { waitUntil: "networkidle" });
  await pause(1600);
  await shot("01-fold");

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) problems.push(`${vp.name}: horizontal overflow ${overflow}px`);

  // ---- Hero iPad ----
  const app = page.locator('[role="application"]').first();
  await app.scrollIntoViewIfNeeded();
  await pause();
  await app.screenshot({ path: `${OUT}/${vp.name}-02-ipad-group.png` });

  // Company tile → drawer (P&L), then Cash tab
  await app.getByRole("button", { name: /Manufacturing Co\. B: cash/ }).click();
  await pause(600);
  await app.screenshot({ path: `${OUT}/${vp.name}-03-ipad-drawer-pnl.png` });
  await app.getByRole("tab", { name: /^Cash$/ }).click();
  await pause(500);
  await app.screenshot({ path: `${OUT}/${vp.name}-04-ipad-drawer-cash.png` });
  await app.getByRole("tab", { name: /^Movements$/ }).click();
  await pause(500);
  await app.screenshot({ path: `${OUT}/${vp.name}-04b-ipad-drawer-movements.png` });
  await app.getByRole("button", { name: "Close", exact: true }).click();
  await pause(500);

  // Ask fibr: two presets + one free-text question
  const tabsVisible = app.locator('[role="tablist"][aria-label="fibr sections"]:visible');
  await tabsVisible.getByRole("tab", { name: "Ask fibr" }).click();
  await pause(500);
  await app.screenshot({ path: `${OUT}/${vp.name}-05-ipad-ask-empty.png` });
  await app.getByRole("button", { name: /cash across all companies at the end of October/ }).click();
  await pause(2200);
  await app.screenshot({ path: `${OUT}/${vp.name}-06-ipad-ask-cash.png` });
  await app.getByRole("button", { name: "Debtors over 90 days" }).click();
  await pause(2200);
  await app.screenshot({ path: `${OUT}/${vp.name}-07-ipad-ask-debtors.png` });
  await app.getByLabel("Ask fibr a question").fill("Which company has the highest net margin?");
  await app.getByRole("button", { name: "Send question" }).click();
  await pause(2500);
  await app.screenshot({ path: `${OUT}/${vp.name}-08-ipad-ask-live.png` });

  // Facilities + select a week
  await tabsVisible.getByRole("tab", { name: "Facilities" }).click();
  await pause(1100);
  await app.screenshot({ path: `${OUT}/${vp.name}-09-ipad-facilities.png` });

  // ---- Product tour moments ----
  const tour = page.locator("#tour");
  const moments = tour.getByRole("tab");
  const n = await moments.count();
  for (let i = 0; i < n; i++) {
    await moments.nth(i).click();
    await pause(500);
    if (i === 0 || i === 2 || i === 5 || vp.name === "ipad") {
      await tour.screenshot({ path: `${OUT}/${vp.name}-10-tour-${i + 1}.png` });
    }
  }

  // ---- Roles ----
  const roles = page.locator("#roles").getByRole("tab");
  for (let i = 0; i < (await roles.count()); i++) {
    await roles.nth(i).click();
    await pause(400);
    if (i === 0 || i === 1) await page.locator("#roles").screenshot({ path: `${OUT}/${vp.name}-11-roles-${i + 1}.png` });
  }

  // ---- Sections ----
  for (const id of ["problem", "pipeline", "uae", "security", "pilot", "faq"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await pause(300);
    await page.locator(id === "faq" ? "#faq >> xpath=ancestor::section" : `#${id}`).screenshot({ path: `${OUT}/${vp.name}-12-${id}.png` });
  }

  // ---- Booking form: errors, then success ----
  const book = page.locator("#book");
  await book.scrollIntoViewIfNeeded();
  await book.getByRole("button", { name: /Book a 45-Minute Walkthrough/ }).click();
  await pause(400);
  await book.screenshot({ path: `${OUT}/${vp.name}-13-form-errors.png` });
  await book.getByLabel("Full name").fill("Test Owner");
  await book.getByLabel("Work email").fill("owner@example.com");
  await book.getByLabel("Group name").fill("Example Holding");
  await book.getByLabel("Your role").selectOption({ index: 1 });
  await book.getByLabel("Companies in the group").selectOption({ index: 2 });
  await book.locator('label:has(input[value="Tally"])').click();
  await book.locator('label:has(input[name="window"])').first().click();
  await book.getByRole("button", { name: /Book a 45-Minute Walkthrough/ }).click();
  await pause(1200);
  await book.screenshot({ path: `${OUT}/${vp.name}-14-form-success.png` });

  await shot("00-full", { fullPage: true });

  const overflow2 = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow2 > 0) problems.push(`${vp.name}: horizontal overflow after interaction ${overflow2}px`);
  for (const l of log) problems.push(`${vp.name}: ${l}`);
  await page.close();
}

await browser.close();
if (problems.length) {
  console.error("FAIL\n" + problems.join("\n"));
  process.exit(1);
}
console.log(`OK: screenshots in ${OUT}/, no console errors, no hydration warnings, no horizontal overflow.`);
