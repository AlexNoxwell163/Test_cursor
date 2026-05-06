"use client";

import { useMemo, useState } from "react";
import ServiceCard from "@/components/ServiceCard";
import { categoryLabels, services } from "@/data/services";
import type { ServiceCategory } from "@/types";

type FilterValue = ServiceCategory | "all";

const filters: { value: FilterValue; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "cut", label: categoryLabels.cut },
  { value: "color", label: categoryLabels.color },
  { value: "styling", label: categoryLabels.styling },
  { value: "beard", label: categoryLabels.beard },
  { value: "care", label: categoryLabels.care },
];

export default function ServicesGrid() {
  const [active, setActive] = useState<FilterValue>("all");

  const filtered = useMemo(() => {
    if (active === "all") return services;
    return services.filter((service) => service.category === active);
  }, [active]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = filter.value === active;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActive(filter.value)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                isActive
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--background)]"
                  : "border-[var(--border-strong)] text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:text-[var(--foreground)]"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-[var(--foreground-muted)]">
          В этой категории пока нет услуг.
        </p>
      )}
    </div>
  );
}
