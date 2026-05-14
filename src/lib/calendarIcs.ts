import type { Booking } from "@/types";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/** Экранирование текста по RFC 5545 для DESCRIPTION / SUMMARY. */
export function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function parseLocalDateTime(dateISO: string, timeHHmm: string): Date | null {
  const [y, m, d] = dateISO.split("-").map(Number);
  const [hh, mm] = timeHHmm.split(":").map(Number);
  if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

function formatIcsDateTimeLocal(d: Date): string {
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  );
}

export function buildBookingIcs(params: {
  booking: Booking;
  serviceName: string;
  masterName: string;
  durationMinutes: number;
  address?: string;
}): string {
  const { booking, serviceName, masterName, durationMinutes, address } = params;
  const start = parseLocalDateTime(booking.date, booking.time);
  if (!start) return "";

  const end = new Date(start.getTime() + Math.max(15, durationMinutes) * 60_000);
  const dtStart = formatIcsDateTimeLocal(start);
  const dtEnd = formatIcsDateTimeLocal(end);
  const dtStamp = formatIcsDateTimeLocal(new Date());

  const summary = escapeIcsText(`Lumière — ${serviceName}`);
  const location = escapeIcsText(address ?? "Lumière, ул. Тверская, 15, Москва");
  const desc = escapeIcsText(
    `Услуга: ${serviceName}\\nМастер: ${masterName}\\nТелефон салона: +7 (495) 123-45-67`,
  );

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lumiere//Booking//RU",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${booking.id}@lumiere-booking.local`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${desc}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Напоминание: визит в Lumière через 1 час",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}
