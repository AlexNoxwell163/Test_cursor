import type { Metadata } from "next";
import { Suspense } from "react";
import BookingSuccess from "@/components/BookingSuccess";

export const metadata: Metadata = {
  title: "Запись подтверждена — Lumière",
};

export default function BookingSuccessPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--background-soft)] p-8 text-[var(--foreground-muted)]">
            Загрузка деталей записи...
          </div>
        }
      >
        <BookingSuccess />
      </Suspense>
    </section>
  );
}
