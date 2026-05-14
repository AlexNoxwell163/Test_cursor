import type { Booking } from "@/types";
import { getBookings } from "@/lib/storage";

/** Времена (HH:MM), уже занятые у мастера в эту дату — из сохранённых записей. */
export function getOccupiedTimes(
  masterId: string,
  dateISO: string,
  excludeBookingId?: string,
): Set<string> {
  if (!masterId || !dateISO) return new Set();
  const taken = new Set<string>();
  for (const b of getBookings() as Booking[]) {
    if (excludeBookingId && b.id === excludeBookingId) continue;
    if (b.masterId === masterId && b.date === dateISO) {
      taken.add(b.time);
    }
  }
  return taken;
}
