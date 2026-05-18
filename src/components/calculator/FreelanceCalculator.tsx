"use client";

import { useMemo, useState } from "react";
import { pricingConfig } from "@/data/pricingConfig";
import { calculateFreelance } from "@/lib/pricing";
import type { FreelanceInput, FreelanceUrgency } from "@/types/calculator";
import QuotePanel from "./QuotePanel";
import { Field, inputClass, selectClass } from "./Field";

const defaults: FreelanceInput = {
  hours: 20,
  hourlyRateRub: 2500,
  urgency: "normal",
  revisions: 1,
};

export default function FreelanceCalculator() {
  const [input, setInput] = useState<FreelanceInput>(defaults);
  const quote = useMemo(() => calculateFreelance(input), [input]);
  const presets = pricingConfig.freelance.presetHourlyRates;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <form className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-6">
        <h1 className="text-2xl font-semibold">Фриланс</h1>
        <p className="text-sm text-[var(--foreground-muted)]">
          Часы, ставка и срочность — для дизайна, разработки, консалтинга.
        </p>

        <Field label={`Часов: ${input.hours}`}>
          <input
            type="range"
            min={1}
            max={160}
            step={1}
            value={input.hours}
            onChange={(e) =>
              setInput((s) => ({ ...s, hours: Number(e.target.value) }))
            }
            className="w-full"
          />
        </Field>

        <Field label="Ставка, ₽/час">
          <div className="flex flex-wrap gap-2">
            {presets.map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setInput((s) => ({ ...s, hourlyRateRub: rate }))}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  input.hourlyRateRub === rate
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--background)]"
                    : "border-[var(--border-strong)] hover:border-[var(--accent)]"
                }`}
              >
                {rate.toLocaleString("ru-RU")}
              </button>
            ))}
          </div>
          <input
            type="number"
            min={500}
            step={100}
            className={`${inputClass} mt-2`}
            value={input.hourlyRateRub}
            onChange={(e) =>
              setInput((s) => ({
                ...s,
                hourlyRateRub: Number(e.target.value),
              }))
            }
          />
        </Field>

        <Field label="Срочность">
          <select
            className={selectClass}
            value={input.urgency}
            onChange={(e) =>
              setInput((s) => ({
                ...s,
                urgency: e.target.value as FreelanceUrgency,
              }))
            }
          >
            <option value="normal">Обычный срок</option>
            <option value="rush">Срочно (+40%)</option>
          </select>
        </Field>

        <Field label="Доп. раунды правок">
          <input
            type="number"
            min={0}
            max={10}
            className={inputClass}
            value={input.revisions}
            onChange={(e) =>
              setInput((s) => ({ ...s, revisions: Number(e.target.value) }))
            }
          />
        </Field>
      </form>
      <QuotePanel quote={quote} />
    </div>
  );
}
