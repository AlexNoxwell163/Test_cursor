/** Депозит за слот: доля от цены услуги с нижним порогом (демо, без платёжного шлюза). */
const DEPOSIT_RATE = 0.15;
const DEPOSIT_MIN_RUB = 400;

export function computeDepositRub(servicePriceRub: number): number {
  const raw = Math.round(servicePriceRub * DEPOSIT_RATE);
  return Math.max(DEPOSIT_MIN_RUB, raw);
}
