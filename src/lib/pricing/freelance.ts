import { pricingConfig } from "@/data/pricingConfig";
import type { FreelanceInput, QuoteResult } from "@/types/calculator";

export function calculateFreelance(input: FreelanceInput): QuoteResult {
  const cfg = pricingConfig.freelance;
  const base = input.hours * input.hourlyRateRub;
  const mult = cfg.urgencyMultiplier[input.urgency];

  const lines = [
    {
      label: `${input.hours} ч × ${input.hourlyRateRub.toLocaleString("ru-RU")} ₽/ч`,
      amountRub: base,
    },
  ];

  if (mult > 1) {
    const rushExtra = Math.round(base * (mult - 1));
    lines.push({ label: "Срочность (+40%)", amountRub: rushExtra });
  }

  if (input.revisions > 0) {
    lines.push({
      label: `Доп. правки (${input.revisions})`,
      amountRub: input.revisions * cfg.perRevisionRub,
    });
  }

  const totalRub = lines.reduce((sum, l) => sum + l.amountRub, 0);

  return {
    totalRub,
    lines,
    note: "Оплата по договору: аванс 30%, остаток по сдаче этапов.",
  };
}
