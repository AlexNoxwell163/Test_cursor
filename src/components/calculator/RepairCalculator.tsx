"use client";

import { useMemo, useState } from "react";
import { calculateRepair } from "@/lib/pricing";
import type { RepairInput, RepairLevel } from "@/types/calculator";
import QuotePanel from "./QuotePanel";
import { Field, selectClass } from "./Field";

const defaults: RepairInput = {
  level: "standard",
  areaSqm: 55,
  demolition: false,
  materialsIncluded: true,
};

const levelOptions: { value: RepairLevel; label: string }[] = [
  { value: "cosmetic", label: "Косметический" },
  { value: "standard", label: "Капитальный" },
  { value: "turnkey", label: "Под ключ" },
];

export default function RepairCalculator() {
  const [input, setInput] = useState<RepairInput>(defaults);
  const quote = useMemo(() => calculateRepair(input), [input]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <form className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-6">
        <h1 className="text-2xl font-semibold">Ремонт</h1>
        <p className="text-sm text-[var(--foreground-muted)]">
          Тип работ и площадь — основа сметы.
        </p>

        <Field label="Тип ремонта">
          <select
            className={selectClass}
            value={input.level}
            onChange={(e) =>
              setInput((s) => ({
                ...s,
                level: e.target.value as RepairLevel,
              }))
            }
          >
            {levelOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label={`Площадь: ${input.areaSqm} м²`}>
          <input
            type="range"
            min={20}
            max={250}
            step={5}
            value={input.areaSqm}
            onChange={(e) =>
              setInput((s) => ({ ...s, areaSqm: Number(e.target.value) }))
            }
            className="w-full"
          />
        </Field>

        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={input.demolition}
            onChange={(e) =>
              setInput((s) => ({ ...s, demolition: e.target.checked }))
            }
            className="h-4 w-4 rounded accent-[var(--accent)]"
          />
          Демонтаж и вывоз мусора
        </label>

        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={input.materialsIncluded}
            onChange={(e) =>
              setInput((s) => ({
                ...s,
                materialsIncluded: e.target.checked,
              }))
            }
            className="h-4 w-4 rounded accent-[var(--accent)]"
          />
          Материалы в смете (~22%)
        </label>
      </form>
      <QuotePanel quote={quote} />
    </div>
  );
}
