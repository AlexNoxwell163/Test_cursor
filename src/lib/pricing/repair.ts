import { pricingConfig } from "@/data/pricingConfig";
import type { QuoteResult, RepairInput } from "@/types/calculator";

const levelLabels = {
  cosmetic: "Косметический",
  standard: "Капитальный",
  turnkey: "Под ключ",
} as const;

export function calculateRepair(input: RepairInput): QuoteResult {
  const cfg = pricingConfig.repair;
  const rate = cfg.perSqm[input.level];

  const lines = [
    {
      label: `${levelLabels[input.level]} ремонт, ${input.areaSqm} м²`,
      amountRub: input.areaSqm * rate,
    },
  ];

  if (input.demolition) {
    lines.push({ label: "Демонтаж и вывоз", amountRub: cfg.demolitionRub });
  }

  let subtotal = lines.reduce((sum, l) => sum + l.amountRub, 0);

  if (input.materialsIncluded) {
    const materials = Math.round(subtotal * cfg.materialsPercent);
    lines.push({
      label: `Материалы (~${cfg.materialsPercent * 100}%)`,
      amountRub: materials,
    });
    subtotal += materials;
  }

  return {
    totalRub: subtotal,
    lines,
    note: "Смета ориентировочная; точная — после замеров и ТЗ.",
  };
}
