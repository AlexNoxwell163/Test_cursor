import type { Service, ServiceCategory } from "@/types";

export const services: Service[] = [
  {
    id: "haircut-men",
    name: "Мужская стрижка",
    description: "Классическая или модельная стрижка с мытьём головы и укладкой.",
    price: 1500,
    duration: 45,
    category: "cut",
  },
  {
    id: "haircut-women",
    name: "Женская стрижка",
    description: "Стрижка любой сложности: каре, каскад, лесенка, авторская форма.",
    price: 2500,
    duration: 60,
    category: "cut",
  },
  {
    id: "haircut-kids",
    name: "Детская стрижка",
    description: "Аккуратная стрижка для детей до 12 лет в дружелюбной атмосфере.",
    price: 1000,
    duration: 30,
    category: "cut",
  },
  {
    id: "color-single",
    name: "Окрашивание в один тон",
    description: "Равномерное окрашивание профессиональными красителями.",
    price: 4500,
    duration: 120,
    category: "color",
  },
  {
    id: "color-balayage",
    name: "Балаяж / Шатуш",
    description: "Сложное окрашивание с плавным переходом цвета.",
    price: 8500,
    duration: 180,
    category: "color",
  },
  {
    id: "color-highlights",
    name: "Мелирование",
    description: "Классическое или калифорнийское мелирование на фольгу.",
    price: 5500,
    duration: 150,
    category: "color",
  },
  {
    id: "styling-evening",
    name: "Вечерняя укладка",
    description: "Праздничная укладка для особого случая или фотосессии.",
    price: 2000,
    duration: 60,
    category: "styling",
  },
  {
    id: "styling-blowdry",
    name: "Укладка феном",
    description: "Объёмная укладка с использованием стайлинговых средств.",
    price: 1200,
    duration: 45,
    category: "styling",
  },
  {
    id: "beard-trim",
    name: "Стрижка бороды",
    description: "Моделирование контура и придание формы бороде.",
    price: 1000,
    duration: 30,
    category: "beard",
  },
  {
    id: "beard-shave",
    name: "Королевское бритьё",
    description: "Опасное бритьё с горячими полотенцами и уходовыми маслами.",
    price: 1500,
    duration: 45,
    category: "beard",
  },
  {
    id: "care-keratin",
    name: "Кератиновое выпрямление",
    description: "Глубокое восстановление структуры волос и эффект гладких прядей.",
    price: 7500,
    duration: 180,
    category: "care",
  },
  {
    id: "care-mask",
    name: "Уходовая маска",
    description: "Профессиональный уход для блеска и питания волос.",
    price: 1800,
    duration: 45,
    category: "care",
  },
];

export const categoryLabels: Record<ServiceCategory, string> = {
  cut: "Стрижки",
  color: "Окрашивание",
  styling: "Укладки",
  beard: "Борода",
  care: "Уход",
};

export function getServiceById(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}
