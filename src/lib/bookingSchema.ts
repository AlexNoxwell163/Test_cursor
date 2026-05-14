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
  giftCode: z.string().max(32).optional(),
  /** Демо: подтверждение депозита без реальной оплаты */
  depositPaid: z.boolean().refine((v) => v === true, {
    message: "Подтвердите внесение депозита за слот (в демо — без списания с карты)",
  }),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
