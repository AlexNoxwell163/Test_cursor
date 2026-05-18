"use client";

import { useMemo, useState } from "react";
import { calculateCleaning } from "@/lib/pricing";
import type { CleaningInput } from "@/types/calculator";
import QuotePanel from "./QuotePanel";
import { Field, inputClass } from "./Field";

const defaults: CleaningInput = {
  areaSqm: 45,
  rooms: 2,
  windows: 4,
  deepClean: false,
  suppliesIncluded: true,
};

export default function CleaningCalculator() {
  const [input, setInput] = useState<CleaningInput>(defaults);
  const quote = useMemo(() => calculateCleaning(input), [input]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <form className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-6">
        <h1 className="text-2xl font-semibold">Клининг</h1>
        <p className="text-sm text-[var(--foreground-muted)]">
          Площадь, комнаты и опции — цена пересчитывается сразу.
        </p>

        <Field label={`Площадь: ${input.areaSqm} м²`}>
          <input
            type="range"
            min={15}
            max={200}
            step={5}
            value={input.areaSqm}
            onChange={(e) =>
              setInput((s) => ({ ...s, areaSqm: Number(e.target.value) }))
            }
            className="w-full"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Комнаты">
            <input
              type="number"
              min={1}
              max={10}
              className={inputClass}
              value={input.rooms}
              onChange={(e) =>
                setInput((s) => ({ ...s, rooms: Number(e.target.value) }))
              }
            />
          </Field>
          <Field label="Окна">
            <input
              type="number"
              min={0}
              max={30}
              className={inputClass}
              value={input.windows}
              onChange={(e) =>
                setInput((s) => ({ ...s, windows: Number(e.target.value) }))
              }
            />
          </Field>
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={input.deepClean}
            onChange={(e) =>
              setInput((s) => ({ ...s, deepClean: e.target.checked }))
            }
            className="h-4 w-4 rounded accent-[var(--accent)]"
          />
          Генеральная уборка (+35%)
        </label>

        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={input.suppliesIncluded}
            onChange={(e) =>
              setInput((s) => ({ ...s, suppliesIncluded: e.target.checked }))
            }
            className="h-4 w-4 rounded accent-[var(--accent)]"
          />
          Моющие средства включены
        </label>
      </form>
      <QuotePanel quote={quote} />
    </div>
  );
}
