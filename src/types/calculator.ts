/** Тип услуги на главной — одна точка входа для маршрутов и расчёта */
export type ServiceKind = "cleaning" | "repair" | "freelance";

export interface PriceLine {
  label: string;
  amountRub: number;
}

export interface QuoteResult {
  totalRub: number;
  lines: PriceLine[];
  note?: string;
}

/** Клининг */
export interface CleaningInput {
  areaSqm: number;
  rooms: number;
  windows: number;
  deepClean: boolean;
  suppliesIncluded: boolean;
}

/** Ремонт */
export type RepairLevel = "cosmetic" | "standard" | "turnkey";

export interface RepairInput {
  level: RepairLevel;
  areaSqm: number;
  demolition: boolean;
  materialsIncluded: boolean;
}

/** Фриланс */
export type FreelanceUrgency = "normal" | "rush";

export interface FreelanceInput {
  hours: number;
  hourlyRateRub: number;
  urgency: FreelanceUrgency;
  revisions: number;
}
