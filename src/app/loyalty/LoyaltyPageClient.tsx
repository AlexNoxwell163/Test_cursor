"use client";

import Link from "next/link";
import { Crown, Sparkles, Trophy } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  buildLeaderboard,
  getDiscountBreakdown,
  getLoyaltyProfile,
  getTierForPoints,
} from "@/lib/loyalty";

const tierHints = [
  { name: "Серебро", from: 400, discount: "3%" },
  { name: "Золото", from: 1000, discount: "5%" },
  { name: "Платина", from: 2200, discount: "8%" },
];

export default function LoyaltyPageClient() {
  const { user, initialized } = useAuth();
  const profile = user ? getLoyaltyProfile(user.id) : null;
  const tier = profile ? getTierForPoints(profile.points) : null;
  const breakdown = user
    ? getDiscountBreakdown(user.id, user.name)
    : null;
  const board = buildLeaderboard(user?.id ?? null, user?.name ?? "Вы");

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Программа"
        title="Лояльность и рейтинг"
        subtitle="Копите баллы за визиты, повышайте уровень и получайте скидку. Лидер рейтинга в демо получает +2% к скидке."
      />

      {!initialized ? (
        <p className="mt-8 text-sm text-[var(--foreground-muted)]">Загрузка...</p>
      ) : !user ? (
        <div className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--background-soft)] p-8 text-center">
          <p className="text-[var(--foreground-muted)]">
            Войдите, чтобы видеть свои баллы и место в рейтинге.
          </p>
          <Link
            href="/auth"
            className="mt-6 inline-flex rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]"
          >
            Войти или зарегистрироваться
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--background-soft)] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
              <Sparkles size={18} />
              Ваш статус
            </div>
            <p className="mt-4 font-serif text-3xl">{tier?.name ?? "—"}</p>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Баллы: <span className="font-medium text-[var(--foreground)]">{profile?.points ?? 0}</span>
              {" · "}
              Визитов в программе: {profile?.visits ?? 0}
            </p>
            <p className="mt-4 text-sm text-[var(--foreground)]">
              Текущая скидка при записи:{" "}
              <span className="font-semibold text-[var(--accent)]">
                {breakdown?.totalPercent ?? 0}%
              </span>
              {breakdown && breakdown.topBonus > 0 ? (
                <span className="text-[var(--foreground-muted)]">
                  {" "}
                  (включая бонус лидера рейтинга +{breakdown.topBonus}%)
                </span>
              ) : null}
            </p>
            <ul className="mt-6 space-y-2 text-sm text-[var(--foreground-muted)]">
              {tierHints.map((t) => (
                <li key={t.name} className="flex justify-between gap-2">
                  <span>
                    {t.name} от {t.from} баллов
                  </span>
                  <span className="text-[var(--foreground)]">до {t.discount}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--background-soft)] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
              <Trophy size={18} />
              Рейтинг клиентов (демо)
            </div>
            <p className="mt-2 text-xs text-[var(--foreground-muted)]">
              Смешанный список: примеры и ваши баллы в этом браузере. Лидер получает дополнительные 2% к скидке.
            </p>
            <ol className="mt-6 space-y-3">
              {board.slice(0, 8).map((row) => (
                <li
                  key={`${row.rank}-${row.name}`}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${
                    row.isYou
                      ? "border-[var(--accent)]/50 bg-[var(--accent-soft)]"
                      : "border-[var(--border)] bg-[var(--background)]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--background-soft)] text-xs font-semibold">
                      {row.rank}
                    </span>
                    {row.rank === 1 && <Crown size={14} className="text-[var(--accent)]" />}
                    <span className={row.isYou ? "font-medium" : ""}>{row.name}</span>
                  </span>
                  <span className="text-[var(--foreground-muted)]">{row.points} б.</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      <p className="mt-10 text-center text-xs text-[var(--foreground-muted)]">
        Данные хранятся локально в браузере. Для боя нужен сервер и единая база клиентов.
      </p>
    </section>
  );
}
