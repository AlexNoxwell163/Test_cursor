import type { Metadata } from "next";
import { Suspense } from "react";
import BookingForm from "@/components/BookingForm";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Онлайн-запись — Lumière",
  description:
    "Запишитесь в парикмахерскую Lumière онлайн: выберите услугу, мастера, удобное время и дату.",
};

export default function BookingPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Онлайн-запись"
        title="Запишитесь за минуту"
        subtitle="Заполните форму, и мы зарезервируем удобное для вас время. После отправки вы увидите детали записи."
      />
      <div className="mt-12">
        <Suspense
          fallback={
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--background-soft)] p-8 text-[var(--foreground-muted)]">
              Загрузка формы...
            </div>
          }
        >
          <BookingForm />
        </Suspense>
      </div>
    </section>
  );
}
