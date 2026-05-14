"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Clock,
  Gift,
  Loader2,
  MessageSquare,
  Phone,
  Sparkles,
  User,
} from "lucide-react";
import { categoryLabels, services } from "@/data/services";
import { masters } from "@/data/masters";
import { bookingSchema, type BookingFormValues } from "@/lib/bookingSchema";
import { generateBookingId, saveBooking } from "@/lib/storage";
import {
  generateTimeSlots,
  getMaxDateISO,
  getTodayISO,
} from "@/lib/timeSlots";
import type { Booking } from "@/types";
import { useAuth } from "@/components/auth/AuthProvider";
import { getOccupiedTimes } from "@/lib/availability";
import { computeDepositRub } from "@/lib/deposit";
import {
  addLoyaltyAfterBooking,
  getDiscountBreakdown,
} from "@/lib/loyalty";
import {
  findCertificateByCode,
  redeemFromCertificate,
  refundToCertificate,
} from "@/lib/giftCertificates";
import { getLastBookingForQuick } from "@/lib/quickBooking";

const allSlots = generateTimeSlots();

const fieldClass =
  "w-full rounded-xl border border-[var(--border-strong)] bg-[var(--background-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]";

const labelClass =
  "flex items-center gap-2 text-sm font-medium text-[var(--foreground)]";

const errorClass = "mt-1 text-xs text-[var(--danger)]";

function roundRub(n: number): number {
  return Math.max(0, Math.round(n));
}

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const initialServiceId = searchParams.get("service") ?? "";
  const initialMasterId = searchParams.get("master") ?? "";
  const quick = searchParams.get("quick") === "1";

  const today = useMemo(() => getTodayISO(), []);
  const maxDate = useMemo(() => getMaxDateISO(30), []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: initialServiceId,
      masterId: initialMasterId,
      date: "",
      time: "",
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      comment: "",
      giftCode: "",
      depositPaid: false,
    },
  });

  const selectedServiceId = watch("serviceId");
  const selectedMasterId = watch("masterId");
  const selectedTime = watch("time");
  const selectedDate = watch("date");
  const giftCodeWatch = watch("giftCode");

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId),
    [selectedServiceId],
  );

  const availableMasters = useMemo(() => {
    if (!selectedService) return masters;
    return masters.filter((master) =>
      master.specialties.includes(selectedService.category),
    );
  }, [selectedService]);

  const occupied = useMemo(
    () => getOccupiedTimes(selectedMasterId, selectedDate),
    [selectedMasterId, selectedDate],
  );

  const namePreview = watch("name");

  const loyalty = useMemo(
    () =>
      getDiscountBreakdown(
        user?.id ?? null,
        user?.name?.trim() || namePreview?.trim() || "Гость",
      ),
    [user?.id, user?.name, namePreview],
  );

  const priceAfterLoyalty = useMemo(() => {
    if (!selectedService) return 0;
    const pct = user ? loyalty.totalPercent : 0;
    return roundRub(selectedService.price * (1 - pct / 100));
  }, [selectedService, loyalty.totalPercent, user]);

  const giftPreview = useMemo(() => {
    const code = (giftCodeWatch ?? "").trim();
    if (!code || !selectedService) return { cert: undefined, applied: 0 };
    const cert = findCertificateByCode(code);
    if (!cert || cert.balanceRemaining <= 0) return { cert: undefined, applied: 0 };
    const applied = Math.min(cert.balanceRemaining, priceAfterLoyalty);
    return { cert, applied };
  }, [giftCodeWatch, selectedService, priceAfterLoyalty]);

  const depositRub = useMemo(
    () => (selectedService ? computeDepositRub(selectedService.price) : 0),
    [selectedService],
  );

  const finalServiceRub = useMemo(() => {
    return roundRub(priceAfterLoyalty - giftPreview.applied);
  }, [priceAfterLoyalty, giftPreview.applied]);

  useEffect(() => {
    if (
      selectedMasterId &&
      !availableMasters.some((master) => master.id === selectedMasterId)
    ) {
      setValue("masterId", "");
    }
  }, [availableMasters, selectedMasterId, setValue]);

  useEffect(() => {
    if (!user) return;
    if (!getValues("name")) {
      setValue("name", user.name, { shouldDirty: false });
    }
    if (!getValues("phone") && user.phone) {
      setValue("phone", user.phone, { shouldDirty: false });
    }
  }, [getValues, setValue, user]);

  useEffect(() => {
    if (!quick) return;
    const last = getLastBookingForQuick(user);
    if (!last) return;
    setValue("serviceId", last.serviceId, { shouldDirty: true });
    setValue("masterId", last.masterId, { shouldDirty: true });
    setValue("name", last.name, { shouldDirty: true });
    setValue("phone", last.phone, { shouldDirty: true });
  }, [quick, user, setValue]);

  useEffect(() => {
    if (selectedTime && occupied.has(selectedTime)) {
      setValue("time", "", { shouldValidate: true });
    }
  }, [occupied, selectedTime, setValue]);

  const onSubmit = async (values: BookingFormValues) => {
    const service = services.find((item) => item.id === values.serviceId);
    const master = masters.find((item) => item.id === values.masterId);

    if (!service || !master) return;

    if (getOccupiedTimes(values.masterId, values.date).has(values.time)) {
      setError("time", { type: "manual", message: "Это время только что заняли. Выберите другое." });
      return;
    }
    clearErrors("time");

    const giftTrim = (values.giftCode ?? "").trim();
    let giftApplied = 0;
    if (giftTrim) {
      const cert = findCertificateByCode(giftTrim);
      if (!cert || cert.balanceRemaining <= 0) {
        setError("giftCode", { type: "manual", message: "Неверный код или нулевой остаток" });
        return;
      }
      giftApplied = Math.min(cert.balanceRemaining, priceAfterLoyalty);
    }

    const loyaltyPct = user
      ? getDiscountBreakdown(
          user.id,
          user.name?.trim() || values.name.trim(),
        ).totalPercent
      : 0;
    const afterLoyalty = roundRub(service.price * (1 - loyaltyPct / 100));
    const finalRub = roundRub(afterLoyalty - giftApplied);

    const booking: Booking = {
      id: generateBookingId(),
      serviceId: values.serviceId,
      masterId: values.masterId,
      date: values.date,
      time: values.time,
      name: values.name.trim(),
      phone: values.phone.trim(),
      comment: values.comment?.trim() || undefined,
      createdAt: new Date().toISOString(),
      userId: user?.id,
      servicePriceRub: service.price,
      depositRub,
      depositPaid: true,
      giftCertificateCode: giftTrim || undefined,
      giftCertificateAppliedRub: giftApplied > 0 ? giftApplied : undefined,
      loyaltyDiscountPercent: loyaltyPct > 0 ? loyaltyPct : undefined,
      finalServicePriceRub: finalRub,
    };

    let redeemed = 0;
    let redeemedCode: string | undefined;

    try {
      if (giftApplied > 0 && giftTrim) {
        const r = redeemFromCertificate(giftTrim, giftApplied);
        if (!r.ok) {
          setError("giftCode", { type: "manual", message: r.error });
          return;
        }
        redeemed = giftApplied;
        redeemedCode = giftTrim;
      }

      saveBooking(booking);
      if (user?.id) {
        addLoyaltyAfterBooking(user.id, finalRub);
      }

      await new Promise((resolve) => setTimeout(resolve, 280));
      router.push(`/booking/success?id=${booking.id}`);
    } catch {
      if (redeemedCode && redeemed > 0) {
        refundToCertificate(redeemedCode, redeemed);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-6 rounded-3xl border border-[var(--border)] bg-[var(--background-soft)] p-6 sm:p-8"
      noValidate
    >
      {quick && (
        <p className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--foreground)]">
          <span className="font-medium text-[var(--accent)]">Быстрая запись:</span>{" "}
          подставлены услуга и мастер из прошлого визита. Укажите дату и свободное время.
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="serviceId" className={labelClass}>
            Услуга
          </label>
          <select
            id="serviceId"
            {...register("serviceId")}
            className={`${fieldClass} mt-2`}
          >
            <option value="">— Выберите услугу —</option>
            {Object.entries(
              services.reduce<Record<string, typeof services>>((acc, service) => {
                const key = categoryLabels[service.category];
                if (!acc[key]) acc[key] = [];
                acc[key].push(service);
                return acc;
              }, {}),
            ).map(([groupName, groupServices]) => (
              <optgroup key={groupName} label={groupName}>
                {groupServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} — {service.price.toLocaleString("ru-RU")} ₽
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.serviceId && (
            <p className={errorClass}>{errors.serviceId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="masterId" className={labelClass}>
            Мастер
          </label>
          <select
            id="masterId"
            {...register("masterId")}
            className={`${fieldClass} mt-2`}
            disabled={!selectedService}
          >
            <option value="">
              {selectedService ? "— Выберите мастера —" : "Сначала выберите услугу"}
            </option>
            {availableMasters.map((master) => (
              <option key={master.id} value={master.id}>
                {master.name} ({master.role})
              </option>
            ))}
          </select>
          {errors.masterId && (
            <p className={errorClass}>{errors.masterId.message}</p>
          )}
        </div>
      </div>

      {selectedService && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[var(--foreground-muted)]">Услуга в прайсе</span>
            <span className="font-medium">
              {selectedService.price.toLocaleString("ru-RU")} ₽
            </span>
          </div>
          {user && loyalty.totalPercent > 0 && (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[var(--accent)]">
              <span className="flex items-center gap-1">
                <Sparkles size={14} />
                Скидка лояльности ({loyalty.tier.name}
                {loyalty.topBonus > 0 ? " + топ рейтинга" : ""})
              </span>
              <span>−{loyalty.totalPercent}%</span>
            </div>
          )}
          {giftPreview.cert && (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[var(--foreground)]">
              <span className="flex items-center gap-1 text-[var(--foreground-muted)]">
                <Gift size={14} className="text-[var(--accent)]" />
                Сертификат до {giftPreview.applied.toLocaleString("ru-RU")} ₽
              </span>
              <span>
                остаток {giftPreview.cert.balanceRemaining.toLocaleString("ru-RU")} ₽
              </span>
            </div>
          )}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3 font-medium">
            <span>К оплате в салоне (после депозита)</span>
            <span>{finalServiceRub.toLocaleString("ru-RU")} ₽</span>
          </div>
          <p className="mt-2 text-xs text-[var(--foreground-muted)]">
            Депозит {depositRub.toLocaleString("ru-RU")} ₽ фиксирует слот и засчитывается в счёт визита.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="date" className={labelClass}>
            <Calendar size={16} className="text-[var(--accent)]" />
            Дата
          </label>
          <input
            id="date"
            type="date"
            min={today}
            max={maxDate}
            {...register("date")}
            className={`${fieldClass} mt-2`}
          />
          {errors.date && <p className={errorClass}>{errors.date.message}</p>}
        </div>

        <div>
          <span className={labelClass}>
            <Clock size={16} className="text-[var(--accent)]" />
            Время
            {selectedMasterId && selectedDate && (
              <span className="ml-auto text-xs font-normal text-[var(--foreground-muted)]">
                занятые слоты скрыты
              </span>
            )}
          </span>
          <input type="hidden" {...register("time")} />
          <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
            {allSlots.map((slot) => {
              const isActive = slot === selectedTime;
              const busy = occupied.has(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={busy || !selectedMasterId || !selectedDate}
                  title={busy ? "Занято" : undefined}
                  onClick={() =>
                    setValue("time", slot, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  className={`rounded-lg border px-2 py-2 text-sm transition-colors ${
                    busy
                      ? "cursor-not-allowed border-[var(--border)] bg-[var(--background)] text-[var(--foreground-muted)]/40 line-through"
                      : isActive
                        ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--background)]"
                        : "border-[var(--border-strong)] text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          {errors.time && <p className={errorClass}>{errors.time.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="giftCode" className={labelClass}>
          <Gift size={16} className="text-[var(--accent)]" />
          Подарочный сертификат <span className="font-normal text-[var(--foreground-muted)]">(код)</span>
        </label>
        <input
          id="giftCode"
          type="text"
          autoCapitalize="characters"
          placeholder="Например: LUME-AB12"
          {...register("giftCode")}
          className={`${fieldClass} mt-2 font-mono`}
        />
        {errors.giftCode && <p className={errorClass}>{errors.giftCode.message}</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            <User size={16} className="text-[var(--accent)]" />
            Имя
          </label>
          <input
            id="name"
            type="text"
            placeholder="Ваше имя"
            {...register("name")}
            className={`${fieldClass} mt-2`}
            autoComplete="name"
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            <Phone size={16} className="text-[var(--accent)]" />
            Телефон
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+7 (___) ___-__-__"
            {...register("phone")}
            className={`${fieldClass} mt-2`}
            autoComplete="tel"
          />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className={labelClass}>
          <MessageSquare size={16} className="text-[var(--accent)]" />
          Комментарий <span className="text-[var(--foreground-muted)]">(необязательно)</span>
        </label>
        <textarea
          id="comment"
          rows={3}
          placeholder="Пожелания к мастеру или особые требования"
          {...register("comment")}
          className={`${fieldClass} mt-2 resize-none`}
        />
        {errors.comment && (
          <p className={errorClass}>{errors.comment.message}</p>
        )}
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--border-strong)] bg-[var(--background)] p-4 text-sm">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]"
          {...register("depositPaid")}
        />
        <span>
          <span className="font-medium text-[var(--foreground)]">
            Депозит {depositRub ? `${depositRub.toLocaleString("ru-RU")} ₽` : "—"} за слот
          </span>
          <span className="mt-1 block text-[var(--foreground-muted)]">
            Демо: без реальной оплаты. В продакшене здесь будет оплата картой или СБП.
          </span>
        </span>
      </label>
      {errors.depositPaid && (
        <p className={errorClass}>{errors.depositPaid.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--background)] transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Отправка...
          </>
        ) : (
          "Подтвердить запись"
        )}
      </button>

      <p className="text-xs text-[var(--foreground-muted)]">
        Нажимая «Подтвердить запись», вы соглашаетесь с обработкой персональных
        данных. Слот резервируется после подтверждения депозита (в демо — симуляция).
      </p>
    </form>
  );
}
