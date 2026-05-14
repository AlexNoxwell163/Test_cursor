import type { GiftCertificate } from "@/types";

const STORAGE_KEY = "barbershop:gift-certificates";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readAll(): GiftCertificate[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GiftCertificate[]) : [];
  } catch {
    return [];
  }
}

function writeAll(items: GiftCertificate[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function randomCode(): string {
  const part = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LUME-${part}`;
}

export function listGiftCertificates(): GiftCertificate[] {
  return readAll();
}

export function createGiftCertificate(amountRub: number): GiftCertificate {
  const certs = readAll();
  let code = randomCode();
  while (certs.some((c) => c.code === code)) {
    code = randomCode();
  }
  const cert: GiftCertificate = {
    id: `gc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    code,
    balanceInitial: amountRub,
    balanceRemaining: amountRub,
    createdAt: new Date().toISOString(),
  };
  writeAll([...certs, cert]);
  return cert;
}

export function findCertificateByCode(code: string): GiftCertificate | undefined {
  const normalized = code.trim().toUpperCase();
  return readAll().find((c) => c.code.toUpperCase() === normalized);
}

/** Списать сумму с сертификата (при успешной записи). Возвращает false если недостаточно средств. */
export function redeemFromCertificate(
  code: string,
  amountRub: number,
): { ok: true; remaining: number } | { ok: false; error: string } {
  const certs = readAll();
  const idx = certs.findIndex((c) => c.code.toUpperCase() === code.trim().toUpperCase());
  if (idx === -1) return { ok: false, error: "Сертификат не найден" };
  const c = certs[idx];
  if (c.balanceRemaining <= 0) return { ok: false, error: "Сертификат уже использован" };
  if (amountRub > c.balanceRemaining) {
    return { ok: false, error: "На сертификате недостаточно средств" };
  }
  const next = { ...c, balanceRemaining: c.balanceRemaining - amountRub };
  const copy = [...certs];
  copy[idx] = next;
  writeAll(copy);
  return { ok: true, remaining: next.balanceRemaining };
}

/** Вернуть списание при отмене сценария (не используется в текущем UI — заготовка). */
export function refundToCertificate(code: string, amountRub: number): void {
  const certs = readAll();
  const idx = certs.findIndex((c) => c.code.toUpperCase() === code.trim().toUpperCase());
  if (idx === -1) return;
  const c = certs[idx];
  const next = {
    ...c,
    balanceRemaining: Math.min(c.balanceInitial, c.balanceRemaining + amountRub),
  };
  const copy = [...certs];
  copy[idx] = next;
  writeAll(copy);
}
