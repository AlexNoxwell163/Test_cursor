"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Clock, Loader2, MessageSquare, Phone, User } from "lucide-react";
import { categoryLabels, services } from "@/data/services";
import { masters } from "@/data/masters";
import { bookingSchema, type BookingFormValues } from "@/lib/bookingSchema";
import {
  generateBookingId,
  saveBooking,
} from "@/lib/storage";
import {
  generateTimeSlots,
  getMaxDateISO,
  getTodayISO,
} from "@/lib/timeSlots";
import type { Booking } from "@/types";

const slots = generateTimeSlots();

const fieldClass =
  "w-full rounded-xl border border-[var(--border-strong)] bg-[var(--background-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]";

const labelClass =
  "flex items-center gap-2 text-sm font-medium text-[var(--foreground)]";

const errorClass = "mt-1 text-xs text-[var(--danger)]";

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialServiceId = searchParams.get("service") ?? "";
  const initialMasterId = searchParams.get("master") ?? "";

  const today = useMemo(() => getTodayISO(), []);
  const maxDate = useMemo(() => getMaxDateISO(30), []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: initialServiceId,
      masterId: initialMasterId,
      date: "",
      time: "",
      name: "",
      phone: "",
      comment: "",
    },
  });

  const selectedServiceId = watch("serviceId");
  const selectedMasterId = watch("masterId");
  const selectedTime = watch("time");

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

  useEffect(() => {
    if (
      selectedMasterId &&
      !availableMasters.some((master) => master.id === selectedMasterId)
    ) {
      setValue("masterId", "");
    }
  }, [availableMasters, selectedMasterId, setValue]);

  const onSubmit = async (values: BookingFormValues) => {
    const service = services.find((item) => item.id === values.serviceId);
    const master = masters.find((item) => item.id === values.masterId);

    if (!service || !master) return;

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
    };

    saveBooking(booking);

    await new Promise((resolve) => setTimeout(resolve, 350));
    router.push(`/booking/success?id=${booking.id}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-6 rounded-3xl border border-[var(--border)] bg-[var(--background-soft)] p-6 sm:p-8"
      noValidate
    >
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
          </span>
          <input type="hidden" {...register("time")} />
          <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
            {slots.map((slot) => {
              const isActive = slot === selectedTime;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() =>
                    setValue("time", slot, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  className={`rounded-lg border px-2 py-2 text-sm transition-colors ${
                    isActive
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
        данных. Мы свяжемся с вами для подтверждения визита.
      </p>
    </form>
  );
}
