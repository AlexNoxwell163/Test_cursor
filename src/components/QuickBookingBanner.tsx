"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getLastBookingForQuick } from "@/lib/quickBooking";
import { getServiceById } from "@/data/services";
import { getMasterById } from "@/data/masters";

export default function QuickBookingBanner() {
  const { user, initialized } = useAuth();
  const last = initialized ? getLastBookingForQuick(user) : undefined;

  if (!last) return null;

  const service = getServiceById(last.serviceId);
  const master = getMasterById(last.masterId);
  if (!service || !master) return null;

  const href = `/booking?service=${encodeURIComponent(last.serviceId)}&master=${encodeURIComponent(last.masterId)}&quick=1`;

  return (
    <div className="border-b border-[var(--border)] bg-[var(--background-soft)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Zap size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">Быстрая запись</p>
            <p className="mt-0.5 text-xs text-[var(--foreground-muted)] sm:text-sm">
              Повторить: {service.name} · {master.name}. Останется выбрать дату и свободный слот.
            </p>
          </div>
        </div>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--background)] transition-colors hover:bg-[var(--accent-hover)]"
        >
          Продолжить
        </Link>
      </div>
    </div>
  );
}
