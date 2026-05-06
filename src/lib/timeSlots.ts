export const WORK_START_HOUR = 10;
export const WORK_END_HOUR = 20;
export const SLOT_STEP_MINUTES = 30;

export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = WORK_START_HOUR; hour < WORK_END_HOUR; hour += 1) {
    for (let minute = 0; minute < 60; minute += SLOT_STEP_MINUTES) {
      const h = hour.toString().padStart(2, "0");
      const m = minute.toString().padStart(2, "0");
      slots.push(`${h}:${m}`);
    }
  }
  return slots;
}

export function getTodayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 10);
}

export function getMaxDateISO(daysAhead = 30): string {
  const now = new Date();
  now.setDate(now.getDate() + daysAhead);
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 10);
}

export function formatDateRu(iso: string): string {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });
}
