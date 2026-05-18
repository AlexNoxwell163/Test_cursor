import type { QuoteResult } from "@/types/calculator";

interface QuotePanelProps {
  quote: QuoteResult;
}

export default function QuotePanel({ quote }: QuotePanelProps) {
  return (
    <aside className="rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-6 lg:sticky lg:top-6">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
        Расчёт
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        {quote.lines.map((line) => (
          <li
            key={line.label}
            className="flex justify-between gap-4 border-b border-[var(--border)]/60 pb-2"
          >
            <span className="text-[var(--foreground-muted)]">{line.label}</span>
            <span className="shrink-0 font-mono tabular-nums">
              {line.amountRub.toLocaleString("ru-RU")} ₽
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-3xl font-semibold tabular-nums text-[var(--accent)]">
        {quote.totalRub.toLocaleString("ru-RU")} ₽
      </p>
      {quote.note && (
        <p className="mt-4 text-xs leading-relaxed text-[var(--foreground-muted)]">
          {quote.note}
        </p>
      )}
    </aside>
  );
}
