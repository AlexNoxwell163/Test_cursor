"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Phone,
  Scissors,
  User,
} from "lucide-react";
import { getBookingById } from "@/lib/storage";
import { getServiceById } from "@/data/services";
import { getMasterById } from "@/data/masters";
import { formatDateRu } from "@/lib/timeSlots";
import type { BookingDetails } from "@/types";
import { buildBookingIcs } from "@/lib/calendarIcs";

function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

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

  const icsContent = useMemo(() => {
    if (!details) return "";
    const service = getServiceById(details.serviceId);
    if (!service) return "";
    return buildBookingIcs({
      booking: details,
      serviceName: details.serviceName,
      masterName: details.masterName,
      durationMinutes: service.duration,
    });
  }, [details]);

  const onAddToCalendar = useCallback(() => {
    if (!icsContent || !details) return;
    downloadTextFile(icsContent, `lumiere-zapis-${details.id}.ics`);
  }, [icsContent, details]);

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

  const hasPricing =
    details.depositRub != null ||
    details.loyaltyDiscountPercent != null ||
    details.giftCertificateAppliedRub != null ||
    details.finalServicePriceRub != null;

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
          Слот зарезервирован. Депозит зафиксирован (в демо без реальной оплаты). Добавьте
          визит в календарь телефона — напоминание за 1 час включено.
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
        {hasPricing && (
          <>
            {details.depositRub != null && (
              <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-3">
                <dt className="text-sm text-[var(--foreground-muted)]">Депозит за слот</dt>
                <dd className="text-right text-sm font-medium text-[var(--foreground)]">
                  {details.depositRub.toLocaleString("ru-RU")} ₽
                </dd>
              </div>
            )}
            {details.loyaltyDiscountPercent != null && details.loyaltyDiscountPercent > 0 && (
              <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-3">
                <dt className="text-sm text-[var(--foreground-muted)]">Скидка лояльности</dt>
                <dd className="text-right text-sm font-medium text-[var(--accent)]">
                  −{details.loyaltyDiscountPercent}%
                </dd>
              </div>
            )}
            {details.giftCertificateAppliedRub != null && details.giftCertificateAppliedRub > 0 && (
              <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-3">
                <dt className="text-sm text-[var(--foreground-muted)]">Сертификат</dt>
                <dd className="text-right text-sm font-medium text-[var(--foreground)]">
                  −{details.giftCertificateAppliedRub.toLocaleString("ru-RU")} ₽
                </dd>
              </div>
            )}
            {details.finalServicePriceRub != null && (
              <div className="flex items-start justify-between gap-4 pt-1">
                <dt className="text-sm font-medium text-[var(--foreground)]">К оплате в салоне</dt>
                <dd className="text-right text-sm font-semibold text-[var(--accent)]">
                  {details.finalServicePriceRub.toLocaleString("ru-RU")} ₽
                </dd>
              </div>
            )}
          </>
        )}
        {details.comment && (
          <div className="border-t border-[var(--border)] pt-3">
            <dt className="text-sm text-[var(--foreground-muted)]">Комментарий</dt>
            <dd className="mt-1 text-sm text-[var(--foreground)]">
              {details.comment}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        {icsContent ? (
          <button
            type="button"
            onClick={onAddToCalendar}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--accent)]/20 sm:w-auto"
          >
            <Download size={16} />
            В календарь (напоминание за 1 ч)
          </button>
        ) : null}
        <Link
          href="/"
          className="inline-flex w-full items-center justify-center rounded-full border border-[var(--border-strong)] px-5 py-2.5 text-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:w-auto"
        >
          На главную
        </Link>
        <Link
          href="/booking"
          className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--background)] hover:bg-[var(--accent-hover)] sm:w-auto"
        >
          Записаться ещё раз
        </Link>
      </div>
    </div>
  );
}
