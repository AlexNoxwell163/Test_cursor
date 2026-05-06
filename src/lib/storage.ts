import type { Booking } from "@/types";

const STORAGE_KEY = "barbershop:bookings";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getBookings(): Booking[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Booking[]) : [];
  } catch {
    return [];
  }
}

export function saveBooking(booking: Booking): void {
  if (!isBrowser()) return;
  const existing = getBookings();
  const next = [...existing, booking];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function getBookingById(id: string): Booking | undefined {
  return getBookings().find((booking) => booking.id === id);
}

export function generateBookingId(): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `bk_${Date.now().toString(36)}_${random}`;
}
