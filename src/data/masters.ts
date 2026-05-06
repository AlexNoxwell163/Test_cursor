import type { Master } from "@/types";

export const masters: Master[] = [
  {
    id: "anna",
    name: "Анна Соколова",
    role: "Топ-стилист, колорист",
    experienceYears: 12,
    photo:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    bio: "Сертифицированный колорист L'Oréal Professionnel. Специализируется на сложных окрашиваниях и работе с блондом.",
    specialties: ["color", "cut", "care"],
  },
  {
    id: "dmitry",
    name: "Дмитрий Орлов",
    role: "Барбер",
    experienceYears: 8,
    photo:
      "https://images.unsplash.com/photo-1542178243-bc20204b769f?auto=format&fit=crop&w=600&q=80",
    bio: "Мастер мужских стрижек и моделирования бороды. Работает в классической и современной школах.",
    specialties: ["cut", "beard"],
  },
  {
    id: "elena",
    name: "Елена Морозова",
    role: "Стилист-парикмахер",
    experienceYears: 6,
    photo:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    bio: "Эксперт по укладкам и вечерним причёскам. Регулярно повышает квалификацию на международных платформах.",
    specialties: ["styling", "cut"],
  },
  {
    id: "maxim",
    name: "Максим Лебедев",
    role: "Стилист, технолог",
    experienceYears: 10,
    photo:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80",
    bio: "Специалист по уходовым процедурам, кератиновому выпрямлению и реконструкции волос.",
    specialties: ["care", "color", "styling"],
  },
];

export function getMasterById(id: string): Master | undefined {
  return masters.find((master) => master.id === id);
}
