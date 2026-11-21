/**
 * Illustrative UAE holding group — NOT a real group.
 * All amounts in AED. P&L is Jan to Oct 2026 year-to-date; balances are at the 31 Oct 2026 close
 * and at the latest pull (today). Totals are never hard-coded: see src/lib/aggregate.ts.
 */
import { COMPANY_NAMES, type EntityId } from "./names";
import type { Entity, Facility } from "../lib/types";

/** The date the demo treats as "today" (Friday). */
export const TODAY_ISO = "2026-11-20";
export const LAST_PULLED = "Today, 07:00 GST";
export const PNL_PERIOD = "Jan to Oct 2026";
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"] as const;
/** Monday of ladder week 1. */
export const LADDER_START_ISO = "2026-11-23";
export const LADDER_WEEKS = 13;

const SEASON_TRADE = [0.98, 0.95, 1.06, 1.0, 1.04, 0.9, 0.86, 0.92, 1.08, 1.21] as const;
const SEASON_FLAT = [1, 0.97, 1.02, 1, 1.01, 0.98, 0.97, 0.99, 1.02, 1.04] as const;
const SEASON_BUILD = [0.92, 0.96, 1.08, 1.04, 1.1, 0.94, 0.82, 0.88, 1.08, 1.18] as const;

export const ENTITIES: Entity[] = [
  {
    id: "tradA",
    name: COMPANY_NAMES.tradA,
    sector: "Trading",
    activity: "Building-materials trading",
    jurisdiction: "Dubai, Mainland",
    freeZone: false,
    qfzp: false,
    ledgers: ["Tally"],
    fy2025Revenue: 142_360_000,
    pnl: { revenue: 121_840_000, cogs: 101_127_200, opex: 9_746_000, depreciation: 812_000, financeCost: 2_214_000 },
    seasonality: SEASON_TRADE,
    bankAccounts: [
      { bank: "Bank 1", last4: "2281", currency: "AED", octClose: 12_140_000, today: 11_620_500 },
      { bank: "Bank 2", last4: "7710", currency: "AED", octClose: 6_260_000, today: 6_905_300 },
    ],
    receivables: {
      current: 18_450_000,
      d31to60: 7_920_000,
      d61to90: 3_140_000,
      over90: [
        { name: "Contractor, Al Barsha villas", amount: 1_260_000, daysOutstanding: 104 },
        { name: "Retail fit-out customer, Deira", amount: 410_000, daysOutstanding: 133 },
      ],
    },
    payables: 14_880_000,
    vat: { period: "Aug to Oct 2026", outputVat: 1_523_000, inputVat: 1_264_100, due: "2026-11-28" },
    docs: { avgSale: 18_500, avgPurchase: 42_000 },
  },
  {
    id: "tradB",
    name: COMPANY_NAMES.tradB,
    sector: "Trading",
    activity: "Electronics re-export",
    jurisdiction: "Dubai, JAFZA (free zone)",
    freeZone: true,
    qfzp: true,
    ledgers: ["Business Central"],
    fy2025Revenue: 96_120_000,
    pnl: { revenue: 84_310_000, cogs: 74_192_800, opex: 4_980_000, depreciation: 296_000, financeCost: 1_395_000 },
    seasonality: SEASON_TRADE,
    bankAccounts: [
      { bank: "Bank 3", last4: "0943", currency: "AED", octClose: 8_410_000, today: 8_935_200 },
      { bank: "Bank 1", last4: "5528", currency: "AED", octClose: 2_790_000, today: 2_410_800 },
    ],
    receivables: {
      current: 11_280_000,
      d31to60: 4_610_000,
      d61to90: 1_920_000,
      over90: [{ name: "Distributor, Nairobi re-export", amount: 780_000, daysOutstanding: 97 }],
    },
    payables: 9_340_000,
    vat: { period: "Aug to Oct 2026", outputVat: 212_000, inputVat: 498_600, due: "2026-11-28" },
    docs: { avgSale: 36_000, avgPurchase: 95_000 },
  },
  {
    id: "mfgA",
    name: COMPANY_NAMES.mfgA,
    sector: "Manufacturing",
    activity: "Structural steel fabrication",
    jurisdiction: "Sharjah, SAIF Zone (free zone)",
    freeZone: true,
    qfzp: true,
    ledgers: ["Business Central"],
    fy2025Revenue: 88_450_000,
    pnl: { revenue: 74_960_000, cogs: 59_968_000, opex: 6_820_000, depreciation: 2_940_000, financeCost: 1_210_000 },
    seasonality: SEASON_BUILD,
    bankAccounts: [
      { bank: "Bank 1", last4: "3307", currency: "AED", octClose: 4_280_000, today: 3_915_600 },
      { bank: "Bank 4", last4: "8126", currency: "AED", octClose: 1_820_000, today: 2_104_300 },
    ],
    receivables: {
      current: 13_640_000,
      d31to60: 6_210_000,
      d61to90: 2_480_000,
      over90: [
        { name: "Main contractor, Business Bay tower", amount: 1_120_000, daysOutstanding: 112 },
        { name: "Steel stockist, Ajman", amount: 365_000, daysOutstanding: 96 },
      ],
    },
    payables: 10_120_000,
    vat: { period: "Aug to Oct 2026", outputVat: 1_104_000, inputVat: 865_300, due: "2026-11-28" },
    docs: { avgSale: 64_000, avgPurchase: 38_000 },
  },
  {
    id: "mfgB",
    name: COMPANY_NAMES.mfgB,
    sector: "Manufacturing",
    activity: "Plastic packaging",
    jurisdiction: "Ajman, Mainland",
    freeZone: false,
    qfzp: false,
    ledgers: ["Tally"],
    fy2025Revenue: 41_280_000,
    pnl: { revenue: 33_860_000, cogs: 30_812_600, opex: 2_640_000, depreciation: 1_180_000, financeCost: 386_000 },
    seasonality: SEASON_FLAT,
    bankAccounts: [{ bank: "Bank 5", last4: "6619", currency: "AED", octClose: 3_800_000, today: 3_412_700 }],
    receivables: {
      current: 5_120_000,
      d31to60: 2_240_000,
      d61to90: 890_000,
      over90: [{ name: "FMCG brand owner, Sharjah", amount: 240_000, daysOutstanding: 101 }],
    },
    payables: 4_960_000,
    vat: { period: "Sep to Nov 2026", outputVat: 472_000, inputVat: 391_500, due: "2026-12-28" },
    docs: { avgSale: 9_800, avgPurchase: 14_000 },
  },
  {
    id: "distA",
    name: COMPANY_NAMES.distA,
    sector: "Distribution",
    activity: "FMCG distribution",
    jurisdiction: "Dubai, Mainland",
    freeZone: false,
    qfzp: false,
    ledgers: ["Business Central"],
    fy2025Revenue: 210_640_000,
    pnl: { revenue: 181_220_000, cogs: 152_224_800, opex: 18_940_000, depreciation: 1_460_000, financeCost: 3_120_000 },
    seasonality: SEASON_TRADE,
    bankAccounts: [
      { bank: "Bank 2", last4: "4402", currency: "AED", octClose: 9_730_000, today: 10_286_400 },
      { bank: "Bank 1", last4: "9015", currency: "AED", octClose: 5_170_000, today: 4_688_900 },
    ],
    receivables: {
      current: 27_860_000,
      d31to60: 11_430_000,
      d61to90: 4_120_000,
      over90: [
        { name: "Retail chain, Dubai hypermarkets", amount: 1_840_000, daysOutstanding: 118 },
        { name: "Convenience chain, Northern Emirates", amount: 520_000, daysOutstanding: 94 },
      ],
    },
    payables: 22_310_000,
    vat: { period: "Aug to Oct 2026", outputVat: 2_275_000, inputVat: 1_902_400, due: "2026-11-28" },
    docs: { avgSale: 6_200, avgPurchase: 88_000 },
  },
  {
    id: "distB",
    name: COMPANY_NAMES.distB,
    sector: "Distribution",
    activity: "Medical consumables, B2B + web store",
    jurisdiction: "Abu Dhabi, Mainland",
    freeZone: false,
    qfzp: false,
    ledgers: ["Zoho Books", "Shopify"],
    fy2025Revenue: 37_520_000,
    pnl: { revenue: 32_940_000, cogs: 23_387_400, opex: 6_410_000, depreciation: 322_000, financeCost: 214_000 },
    seasonality: SEASON_FLAT,
    bankAccounts: [
      { bank: "Bank 5", last4: "1178", currency: "AED", octClose: 3_050_000, today: 3_262_900 },
      { bank: "Bank 2", last4: "3360", currency: "AED", octClose: 1_150_000, today: 1_094_200 },
    ],
    receivables: {
      current: 4_980_000,
      d31to60: 1_870_000,
      d61to90: 610_000,
      over90: [{ name: "Hospital group, Abu Dhabi", amount: 690_000, daysOutstanding: 126 }],
    },
    payables: 3_140_000,
    vat: { period: "Sep to Nov 2026", outputVat: 412_000, inputVat: 298_700, due: "2026-12-28" },
    docs: { avgSale: 2_400, avgPurchase: 21_000, webShare: 0.22, avgWebOrder: 420 },
  },
  {
    id: "contA",
    name: COMPANY_NAMES.contA,
    sector: "Contracting",
    activity: "MEP contracting",
    jurisdiction: "Dubai, Mainland",
    freeZone: false,
    qfzp: false,
    ledgers: ["Tally"],
    fy2025Revenue: 124_380_000,
    pnl: { revenue: 104_120_000, cogs: 88_502_000, opex: 7_860_000, depreciation: 1_240_000, financeCost: 1_540_000 },
    seasonality: SEASON_BUILD,
    bankAccounts: [
      { bank: "Bank 4", last4: "5590", currency: "AED", octClose: 5_410_000, today: 4_870_300 },
      { bank: "Bank 3", last4: "2047", currency: "AED", octClose: 2_190_000, today: 2_556_100 },
    ],
    receivables: {
      current: 16_720_000,
      d31to60: 8_940_000,
      d61to90: 4_380_000,
      over90: [
        { name: "Main contractor, Dubai Hills retail", amount: 2_380_000, daysOutstanding: 142 },
        { name: "Developer, JVC residential (retention)", amount: 1_650_000, daysOutstanding: 211 },
        { name: "Hotel owner, Palm (variation claim)", amount: 640_000, daysOutstanding: 99 },
      ],
    },
    payables: 15_460_000,
    vat: { period: "Aug to Oct 2026", outputVat: 1_302_000, inputVat: 1_118_600, due: "2026-11-28" },
    docs: { avgSale: 410_000, avgPurchase: 26_000 },
  },
  {
    id: "contB",
    name: COMPANY_NAMES.contB,
    sector: "Contracting",
    activity: "Interior fit-out",
    jurisdiction: "Dubai, Mainland",
    freeZone: false,
    qfzp: false,
    ledgers: ["QuickBooks Online"],
    fy2025Revenue: 29_140_000,
    pnl: { revenue: 23_780_000, cogs: 18_786_200, opex: 4_210_000, depreciation: 268_000, financeCost: 98_000 },
    seasonality: SEASON_BUILD,
    bankAccounts: [{ bank: "Bank 3", last4: "4410", currency: "AED", octClose: 2_300_000, today: 2_118_400 }],
    receivables: {
      current: 3_640_000,
      d31to60: 1_520_000,
      d61to90: 560_000,
      over90: [{ name: "Office tenant, DIFC fit-out", amount: 310_000, daysOutstanding: 108 }],
    },
    payables: 2_470_000,
    vat: { period: "Sep to Nov 2026", outputVat: 298_000, inputVat: 217_900, due: "2026-12-28" },
    docs: { avgSale: 85_000, avgPurchase: 12_500 },
  },
  {
    id: "propA",
    name: COMPANY_NAMES.propA,
    sector: "Property",
    activity: "Warehouse leasing",
    jurisdiction: "Dubai, Mainland",
    freeZone: false,
    qfzp: false,
    ledgers: ["Zoho Books"],
    fy2025Revenue: 22_460_000,
    pnl: { revenue: 19_180_000, cogs: 4_603_200, opex: 2_140_000, depreciation: 5_120_000, financeCost: 2_390_000 },
    seasonality: SEASON_FLAT,
    bankAccounts: [
      { bank: "Bank 1", last4: "6683", currency: "AED", octClose: 7_240_000, today: 7_515_800 },
      { bank: "Bank 4", last4: "0291", currency: "AED", octClose: 2_460_000, today: 2_460_000 },
    ],
    receivables: {
      current: 1_240_000,
      d31to60: 380_000,
      d61to90: 160_000,
      over90: [{ name: "Logistics tenant, Unit 14", amount: 286_000, daysOutstanding: 121 }],
    },
    payables: 1_120_000,
    vat: { period: "Aug to Oct 2026", outputVat: 241_000, inputVat: 96_400, due: "2026-11-28" },
    docs: { avgSale: 46_000, avgPurchase: 8_500 },
  },
  {
    id: "propB",
    name: COMPANY_NAMES.propB,
    sector: "Property",
    activity: "Residential portfolio",
    jurisdiction: "Abu Dhabi, Mainland",
    freeZone: false,
    qfzp: false,
    ledgers: ["QuickBooks Online"],
    fy2025Revenue: 14_320_000,
    pnl: { revenue: 12_410_000, cogs: 2_730_200, opex: 1_320_000, depreciation: 3_460_000, financeCost: 1_060_000 },
    seasonality: SEASON_FLAT,
    bankAccounts: [{ bank: "Bank 2", last4: "8854", currency: "AED", octClose: 5_100_000, today: 5_231_600 }],
    receivables: {
      current: 640_000,
      d31to60: 220_000,
      d61to90: 95_000,
      over90: [{ name: "Tenant, Al Reem tower", amount: 74_000, daysOutstanding: 135 }],
    },
    payables: 610_000,
    vat: { period: "Aug to Oct 2026", outputVat: 18_400, inputVat: 9_200, due: "2026-11-28" },
    docs: { avgSale: 7_800, avgPurchase: 5_200 },
  },
];

/**
 * Bank facilities. `maturities` are the scheduled repayments falling inside the 13-week ladder.
 * Revolving lines (trust receipts, LCs, revolver) repay their full utilisation inside the window;
 * term loans show only the instalments that fall due in it; overdrafts are on-demand.
 */
export const FACILITIES: Facility[] = [
  { id: "f1", entityId: "tradA", bank: "Bank 1", type: "Trust receipts", limit: 25_000_000, utilised: 17_600_000,
    maturities: [{ week: 2, amount: 3_200_000 }, { week: 3, amount: 4_100_000 }, { week: 5, amount: 2_600_000 }, { week: 7, amount: 3_000_000 }, { week: 9, amount: 2_400_000 }, { week: 11, amount: 2_300_000 }] },
  { id: "f2", entityId: "tradA", bank: "Bank 2", type: "Overdraft", limit: 5_000_000, utilised: 1_200_000, maturities: [] },
  { id: "f3", entityId: "tradB", bank: "Bank 3", type: "Letters of credit", limit: 20_000_000, utilised: 12_400_000,
    maturities: [{ week: 1, amount: 2_800_000 }, { week: 3, amount: 3_600_000 }, { week: 6, amount: 2_200_000 }, { week: 8, amount: 1_900_000 }, { week: 10, amount: 1_900_000 }] },
  { id: "f4", entityId: "mfgA", bank: "Bank 1", type: "Term loan", limit: 18_000_000, utilised: 14_000_000,
    maturities: [{ week: 6, amount: 1_500_000 }, { week: 13, amount: 1_500_000 }] },
  { id: "f5", entityId: "mfgA", bank: "Bank 4", type: "Trust receipts", limit: 8_000_000, utilised: 5_900_000,
    maturities: [{ week: 2, amount: 1_800_000 }, { week: 4, amount: 2_100_000 }, { week: 8, amount: 2_000_000 }] },
  { id: "f6", entityId: "mfgB", bank: "Bank 5", type: "Overdraft", limit: 3_000_000, utilised: 2_610_000, maturities: [] },
  { id: "f7", entityId: "distA", bank: "Bank 2", type: "Revolving", limit: 30_000_000, utilised: 21_000_000,
    maturities: [{ week: 3, amount: 6_000_000 }, { week: 7, amount: 5_000_000 }, { week: 11, amount: 5_000_000 }, { week: 13, amount: 5_000_000 }] },
  { id: "f8", entityId: "distB", bank: "Bank 5", type: "Trust receipts", limit: 4_000_000, utilised: 2_900_000,
    maturities: [{ week: 4, amount: 1_100_000 }, { week: 9, amount: 900_000 }, { week: 12, amount: 900_000 }] },
  { id: "f9", entityId: "contA", bank: "Bank 4", type: "Overdraft", limit: 10_000_000, utilised: 6_800_000, maturities: [] },
  { id: "f10", entityId: "contA", bank: "Bank 3", type: "Term loan", limit: 12_000_000, utilised: 9_000_000,
    maturities: [{ week: 2, amount: 750_000 }, { week: 6, amount: 750_000 }, { week: 11, amount: 750_000 }] },
  { id: "f11", entityId: "contB", bank: "Bank 3", type: "Overdraft", limit: 1_500_000, utilised: 1_100_000, maturities: [] },
  { id: "f12", entityId: "propA", bank: "Bank 1", type: "Term loan", limit: 40_000_000, utilised: 32_500_000,
    maturities: [{ week: 6, amount: 2_500_000 }] },
  { id: "f13", entityId: "propB", bank: "Bank 2", type: "Term loan", limit: 15_000_000, utilised: 11_200_000,
    maturities: [{ week: 2, amount: 900_000 }, { week: 6, amount: 900_000 }, { week: 11, amount: 900_000 }] },
];

/** Forecast group net operating cash flow per ladder week (collections less suppliers, payroll, rent). */
export const WEEKLY_NET_OPERATING: readonly number[] = [
  6_000_000, 7_400_000, 7_200_000, 5_800_000, 6_300_000, 4_100_000, 8_600_000,
  6_900_000, 7_100_000, 6_600_000, 9_400_000, 7_800_000, 7_000_000,
];

/** Facts used by exception text that are not otherwise in the ledgers above. */
export const EXCEPTION_FACTS = {
  contBUnreconciled: { last4: "4410", days: 9, lines: 14, amount: 186_300, lastReconciled: "11 Nov" },
  mfgBOctGrossMargin: -0.021,
  singleDebtorThreshold: 1_500_000,
} as const;

/** Intercompany trading Jan to Oct 2026, eliminated on consolidation (no profit effect). */
export const INTERCOMPANY: { from: EntityId; to: EntityId; what: string; amount: number; buyerLine: "cogs" | "opex" }[] = [
  { from: "propA", to: "tradA", what: "Warehouse rent", amount: 2_400_000, buyerLine: "opex" },
  { from: "propA", to: "distA", what: "Warehouse rent", amount: 3_100_000, buyerLine: "opex" },
  { from: "tradA", to: "contA", what: "Building materials", amount: 4_600_000, buyerLine: "cogs" },
  { from: "mfgA", to: "contA", what: "Fabricated steel", amount: 3_800_000, buyerLine: "cogs" },
  { from: "mfgB", to: "distA", what: "Packaging", amount: 1_200_000, buyerLine: "cogs" },
];
