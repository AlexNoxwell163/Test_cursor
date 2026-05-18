import type { RepairLevel, FreelanceUrgency } from "@/types/calculator";

/** Все базовые тарифы в одном файле — меняете цены здесь, не в компонентах */
export const pricingConfig = {
  cleaning: {
    baseVisitRub: 1500,
    perSqmRub: 85,
    perRoomRub: 400,
    perWindowRub: 250,
    deepCleanMultiplier: 1.35,
    suppliesRub: 600,
  },
  repair: {
    perSqm: {
      cosmetic: 4500,
      standard: 7500,
      turnkey: 12000,
    } satisfies Record<RepairLevel, number>,
    demolitionRub: 8000,
    materialsPercent: 0.22,
  },
  freelance: {
    urgencyMultiplier: {
      normal: 1,
      rush: 1.4,
    } satisfies Record<FreelanceUrgency, number>,
    perRevisionRub: 1500,
    presetHourlyRates: [1500, 2500, 4000, 6000] as const,
  },
} as const;
