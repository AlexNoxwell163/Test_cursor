import Link from "next/link";
import Image from "next/image";
import type { Master } from "@/types";
import { categoryLabels } from "@/data/services";

interface MasterCardProps {
  master: Master;
}

function pluralYears(years: number): string {
  const mod10 = years % 10;
  const mod100 = years % 100;
  if (mod10 === 1 && mod100 !== 11) return "год";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "года";
  return "лет";
}

export default function MasterCard({ master }: MasterCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] transition-all hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_24px_50px_-24px_rgba(212,165,116,0.65)]">
      <div className="pointer-events-none absolute -left-16 top-20 z-0 h-40 w-40 rounded-full bg-[var(--glow-blue)] opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src={master.photo}
          alt={master.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="relative z-10 flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="font-serif text-2xl">{master.name}</h3>
          <p className="text-sm text-[var(--accent)]">{master.role}</p>
        </div>
        <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
          {master.bio}
        </p>
        <div className="flex flex-wrap gap-2">
          {master.specialties.map((specialty) => (
            <span
              key={specialty}
              className="rounded-full border border-[var(--border-strong)] px-3 py-1 text-xs text-[var(--foreground-muted)]"
            >
              {categoryLabels[specialty]}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-[var(--border)] pt-4">
          <span className="text-sm text-[var(--foreground-muted)]">
            Опыт: {master.experienceYears} {pluralYears(master.experienceYears)}
          </span>
          <Link
            href={`/booking?master=${master.id}`}
            className="rounded-full border border-[var(--border-strong)] px-4 py-2 text-sm transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
          >
            К мастеру
          </Link>
        </div>
      </div>
    </article>
  );
}
