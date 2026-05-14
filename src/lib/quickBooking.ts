import type { AuthUser, Booking } from "@/types";
import { getBookings } from "@/lib/storage";

function normalizePhone(p: string | undefined | null): string {
  return String(p ?? "").replace(/\D/g, "");
}

/** Последняя запись для быстрого повтора (по userId или совпадению телефона). */
export function getLastBookingForQuick(user: AuthUser | null): Booking | undefined {
  const list = getBookings() as Booking[];
  if (!list.length) return undefined;
  const sorted = [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  if (user) {
    const byUser = sorted.find((b) => b.userId === user.id);
    if (byUser) return byUser;
    if (user.phone) {
      const n = normalizePhone(user.phone);
      if (n.length >= 10) {
        const byPhone = sorted.find((b) => normalizePhone(b.phone).endsWith(n.slice(-10)));
        if (byPhone) return byPhone;
      }
    }
  }
  return sorted[0];
}
