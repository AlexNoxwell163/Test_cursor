import Link from "next/link";
import { Clock } from "lucide-react";
import type { Service } from "@/types";
import { categoryLabels } from "@/data/services";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_24px_50px_-24px_rgba(212,165,116,0.65)]">
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[var(--glow-gold)] blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-60" />
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs uppercase tracking-wider text-[var(--accent)]">
          {categoryLabels[service.category]}
        </span>
        <span className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
          <Clock size={14} />
          {service.duration} мин
        </span>
      </div>

      <div className="flex-1">
        <h3 className="font-serif text-2xl text-[var(--foreground)]">
          {service.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
          {service.description}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
        <span className="font-serif text-2xl text-[var(--accent)]">
          {service.price.toLocaleString("ru-RU")} ₽
        </span>
        <Link
          href={`/booking?service=${service.id}`}
          className="rounded-full border border-[var(--border-strong)] px-4 py-2 text-sm transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
        >
          Записаться
        </Link>
      </div>
    </article>
  );
}
