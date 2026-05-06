"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Phone,
  Scissors,
  User,
} from "lucide-react";
import { getBookingById } from "@/lib/storage";
import { getServiceById } from "@/data/services";
import { getMasterById } from "@/data/masters";
import { formatDateRu } from "@/lib/timeSlots";
import type { BookingDetails } from "@/types";

export default function BookingSuccess() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [details, setDetails] = useState<BookingDetails | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }
    const booking = getBookingById(id);
    if (!booking) {
      setNotFound(true);
      return;
    }
    const service = getServiceById(booking.serviceId);
    const master = getMasterById(booking.masterId);
    if (!service || !master) {
      setNotFound(true);
      return;
    }
    setDetails({
      ...booking,
      serviceName: service.name,
      servicePrice: service.price,
      masterName: master.name,
    });
  }, [id]);

  if (notFound) {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--background-soft)] p-8 text-center">
        <h2 className="font-serif text-2xl">Запись не найдена</h2>
        <p className="mt-3 text-sm text-[var(--foreground-muted)]">
          Возможно, ссылка устарела или запись была сделана в другом браузере.
        </p>
        <Link
          href="/booking"
          className="mt-6 inline-flex rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]"
        >
          Создать новую запись
        </Link>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--background-soft)] p-8 text-[var(--foreground-muted)]">
        Загрузка деталей записи...
      </div>
    );
  }

  const rows = [
    {
      icon: Scissors,
      label: "Услуга",
      value: `${details.serviceName} — ${details.servicePrice.toLocaleString("ru-RU")} ₽`,
    },
    { icon: User, label: "Мастер", value: details.masterName },
    { icon: Calendar, label: "Дата", value: formatDateRu(details.date) },
    { icon: Clock, label: "Время", value: details.time },
    { icon: User, label: "Имя", value: details.name },
    { icon: Phone, label: "Телефон", value: details.phone },
  ];

  return (
    <div className="rounded-3xl border border-[var(--accent)]/40 bg-[var(--background-soft)] p-8 sm:p-10">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
          <CheckCircle2 size={36} />
        </div>
        <h1 className="mt-6 font-serif text-3xl sm:text-4xl">
          Запись подтверждена
        </h1>
        <p className="mt-3 max-w-md text-sm text-[var(--foreground-muted)]">
          Спасибо! Мы зарезервировали для вас время. Администратор перезвонит,
          чтобы подтвердить визит. Ниже — детали записи.
        </p>
      </div>

      <dl className="mt-8 grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6">
        {rows.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-3 last:border-b-0 last:pb-0"
          >
            <dt className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
              <Icon size={16} className="text-[var(--accent)]" />
              {label}
            </dt>
            <dd className="text-right text-sm font-medium text-[var(--foreground)]">
              {value}
            </dd>
          </div>
        ))}
        {details.comment && (
          <div className="border-t border-[var(--border)] pt-3">
            <dt className="text-sm text-[var(--foreground-muted)]">Комментарий</dt>
            <dd className="mt-1 text-sm text-[var(--foreground)]">
              {details.comment}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full border border-[var(--border-strong)] px-5 py-2.5 text-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          На главную
        </Link>
        <Link
          href="/booking"
          className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)]"
        >
          Записаться ещё раз
        </Link>
      </div>
    </div>
  );
}
