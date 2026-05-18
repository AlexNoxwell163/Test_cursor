import Link from "next/link";
import type { ServiceKind } from "@/types/calculator";

const services: {
  kind: ServiceKind;
  href: string;
  title: string;
  description: string;
}[] = [
  {
    kind: "cleaning",
    href: "/cleaning",
    title: "Клининг",
    description: "Площадь, комнаты, окна, генеральная уборка.",
  },
  {
    kind: "repair",
    href: "/repair",
    title: "Ремонт",
    description: "Косметический, капитальный или под ключ.",
  },
  {
    kind: "freelance",
    href: "/freelance",
    title: "Фриланс",
    description: "Часы, ставка, срочность и правки.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <header>
        <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">
          Учебный проект
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Калькулятор стоимости услуг
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--foreground-muted)]">
          Клиент выбирает параметры — вы видите разбивку цены. Вся математика
          отделена от интерфейса: правите тарифы в{" "}
          <code className="rounded bg-[var(--background-soft)] px-1.5 py-0.5 font-mono text-xs text-[var(--accent)]">
            src/data/pricingConfig.ts
          </code>
          , формулы — в{" "}
          <code className="rounded bg-[var(--background-soft)] px-1.5 py-0.5 font-mono text-xs text-[var(--accent)]">
            src/lib/pricing/
          </code>
          .
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {services.map((s) => (
          <Link
            key={s.kind}
            href={s.href}
            className="group rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-6 transition-colors hover:border-[var(--accent)]"
          >
            <h2 className="text-lg font-semibold group-hover:text-[var(--accent)]">
              {s.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              {s.description}
            </p>
            <span className="mt-4 inline-block text-sm text-[var(--accent)]">
              Рассчитать →
            </span>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--foreground-muted)]">
        <p className="font-medium text-[var(--foreground)]">
          Как держать проект под контролем
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1">
          <li>
            <code className="font-mono text-xs">npm run dev</code> — локальный
            запуск
          </li>
          <li>
            <code className="font-mono text-xs">npm run lint</code> и{" "}
            <code className="font-mono text-xs">npm run typecheck</code> —
            проверки перед коммитом
          </li>
          <li>
            Карта проекта — файл{" "}
            <code className="font-mono text-xs">PROJECT.md</code> в корне
          </li>
        </ul>
      </section>
    </div>
  );
}
