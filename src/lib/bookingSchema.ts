import { z } from "zod";

export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Выберите услугу"),
  masterId: z.string().min(1, "Выберите мастера"),
  date: z.string().min(1, "Выберите дату"),
  time: z.string().min(1, "Выберите время"),
  name: z
    .string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(50, "Имя слишком длинное"),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{10,}$/, "Введите корректный номер телефона"),
  comment: z.string().max(300, "Комментарий слишком длинный").optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
