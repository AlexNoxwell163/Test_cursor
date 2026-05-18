import { pricingConfig } from "@/data/pricingConfig";
import type { CleaningInput, QuoteResult } from "@/types/calculator";

export function calculateCleaning(input: CleaningInput): QuoteResult {
  const cfg = pricingConfig.cleaning;
  const lines = [
    { label: "Выезд и организация", amountRub: cfg.baseVisitRub },
    {
      label: `Уборка ${input.areaSqm} м²`,
      amountRub: input.areaSqm * cfg.perSqmRub,
    },
    {
      label: `Комнаты (${input.rooms})`,
      amountRub: input.rooms * cfg.perRoomRub,
    },
    {
      label: `Окна (${input.windows})`,
      amountRub: input.windows * cfg.perWindowRub,
    },
  ];

  if (input.suppliesIncluded) {
    lines.push({ label: "Моющие средства и расходники", amountRub: cfg.suppliesRub });
  }

  let subtotal = lines.reduce((sum, l) => sum + l.amountRub, 0);

  if (input.deepClean) {
    const extra = Math.round(subtotal * (cfg.deepCleanMultiplier - 1));
    lines.push({ label: "Генеральная уборка (+35%)", amountRub: extra });
    subtotal += extra;
  }

  return {
    totalRub: subtotal,
    lines,
    note: "Окончательная цена после осмотра объекта может измениться до ±10%.",
  };
}
