"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Copy, Gift } from "lucide-react";
import { createGiftCertificate } from "@/lib/giftCertificates";
import SectionTitle from "@/components/SectionTitle";

const PRESETS = [3000, 5000, 10000, 15000];

export default function GiftsPageClient() {
  const [amount, setAmount] = useState(5000);
  const [issued, setIssued] = useState<ReturnType<typeof createGiftCertificate> | null>(null);
  const [copied, setCopied] = useState(false);

  const hint = useMemo(
    () =>
      "Код можно ввести на странице записи. В демо деньги не списываются — баланс хранится в браузере.",
    [],
  );

  const onIssue = () => {
    const cert = createGiftCertificate(amount);
    setIssued(cert);
    setCopied(false);
  };

  const onCopy = async () => {
    if (!issued) return;
    try {
      await navigator.clipboard.writeText(issued.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Подарок"
        title="Подарочные сертификаты"
        subtitle="Оформите номинал — получите код для себя или в подарок. Применение при онлайн-записи."
      />

      <div className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--background-soft)] p-6 sm:p-8">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
          <Gift size={18} className="text-[var(--accent)]" />
          Номинал
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setAmount(n)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                amount === n
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--border-strong)] text-[var(--foreground-muted)] hover:border-[var(--accent)]"
              }`}
            >
              {n.toLocaleString("ru-RU")} ₽
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onIssue}
          className="mt-8 w-full rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--background)] transition-colors hover:bg-[var(--accent-hover)] sm:w-auto"
        >
          Выпустить сертификат
        </button>
        <p className="mt-3 text-xs text-[var(--foreground-muted)]">{hint}</p>

        {issued && (
          <div className="mt-8 rounded-2xl border border-[var(--accent)]/40 bg-[var(--background)] p-5">
            <p className="text-sm text-[var(--foreground-muted)]">Ваш код</p>
            <p className="mt-2 font-mono text-xl font-semibold tracking-wider text-[var(--foreground)]">
              {issued.code}
            </p>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Номинал {issued.balanceInitial.toLocaleString("ru-RU")} ₽ · действует в этом браузере (демо)
            </p>
            <button
              type="button"
              onClick={onCopy}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-4 py-2 text-sm hover:border-[var(--accent)]"
            >
              <Copy size={16} />
              {copied ? "Скопировано" : "Копировать код"}
            </button>
            <Link
              href="/booking"
              className="mt-4 block text-sm text-[var(--accent)] hover:underline"
            >
              Перейти к записи →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
