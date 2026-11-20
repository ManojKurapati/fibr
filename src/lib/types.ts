import type { EntityId } from "../data/names";

export type Sector = "Trading" | "Manufacturing" | "Distribution" | "Contracting" | "Property";

export type LedgerSource =
  | "Tally"
  | "Business Central"
  | "QuickBooks Online"
  | "Zoho Books"
  | "Shopify";

export type FacilityType = "Trust receipts" | "Letters of credit" | "Revolving" | "Term loan" | "Overdraft";

export interface BankAccount {
  bank: string;
  /** Last four digits, shown masked. */
  last4: string;
  currency: "AED";
  /** Balance at 31 Oct 2026 month-end close. */
  octClose: number;
  /** Balance at the latest pull (today, 07:00 GST). */
  today: number;
}

export interface Debtor {
  name: string;
  amount: number;
  daysOutstanding: number;
}

export interface PnlYtd {
  /** Jan–Oct 2026 (10 months), AED. */
  revenue: number;
  cogs: number;
  opex: number;
  depreciation: number;
  financeCost: number;
}

export interface VatReturn {
  period: string;
  outputVat: number;
  inputVat: number;
  /** ISO date. */
  due: string;
}

export interface Entity {
  id: EntityId;
  name: string;
  sector: Sector;
  activity: string;
  jurisdiction: string;
  freeZone: boolean;
  /** Qualifying Free Zone Person for UAE Corporate Tax. */
  qfzp: boolean;
  ledgers: LedgerSource[];
  /** FY2025 audited/closed revenue, AED. Drives the AED 50m audit test. */
  fy2025Revenue: number;
  pnl: PnlYtd;
  /** Relative monthly weighting Jan..Oct; normalised in code so months always sum to YTD revenue. */
  seasonality: readonly number[];
  bankAccounts: BankAccount[];
  receivables: {
    current: number;
    d31to60: number;
    d61to90: number;
    /** Every debtor over 90 days; the >90 bucket is derived from this list. */
    over90: Debtor[];
  };
  payables: number;
  vat: VatReturn;
  /** Average document sizes, used to derive how many movements the pipeline captures. */
  docs: { avgSale: number; avgPurchase: number; webShare?: number; avgWebOrder?: number };
}

export type MovementKind = "Sales invoice" | "Receipt" | "Purchase invoice" | "Payment" | "Web order";

export interface Movement {
  id: string;
  entityId: EntityId;
  kind: MovementKind;
  ref: string;
  /** ISO date. */
  date: string;
  time?: string;
  counterparty: string;
  amount: number;
  source: LedgerSource;
  /** For sales invoices: days outstanding if unpaid. */
  daysOutstanding?: number;
}

export interface Maturity {
  /** 1–13, week index in the ladder. */
  week: number;
  amount: number;
}

export interface Facility {
  id: string;
  entityId: EntityId;
  bank: string;
  type: FacilityType;
  limit: number;
  utilised: number;
  maturities: Maturity[];
}

export type ExceptionKind = "reconciliation" | "receivable" | "vat" | "facility" | "margin" | "utilisation";

export interface FinanceException {
  id: string;
  /** null for group-level exceptions. */
  entityId: EntityId | null;
  kind: ExceptionKind;
  title: string;
  detail: string;
}
