/**
 * Display names for the illustrative group.
 * Placeholders until the real names are supplied — swapping them is a change to this file only.
 */
export const GROUP_NAME = "Group Holding";
export const GROUP_SHORT = "GH";

export const COMPANY_NAMES = {
  tradA: "Trading Co. A",
  tradB: "Trading Co. B",
  mfgA: "Manufacturing Co. A",
  mfgB: "Manufacturing Co. B",
  distA: "Distribution Co. A",
  distB: "Distribution Co. B",
  contA: "Contracting Co. A",
  contB: "Contracting Co. B",
  propA: "Property Co. A",
  propB: "Property Co. B",
} as const;

export type EntityId = keyof typeof COMPANY_NAMES;
