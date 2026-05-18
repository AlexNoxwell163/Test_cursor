# Карта проекта (для обучения)

Цель: **понимать, где что лежит**, и уметь проверять проект командами.

## Структура

```
src/
  app/                    # Страницы (маршруты Next.js)
    page.tsx              # Главная — выбор услуги
    cleaning/page.tsx     # Калькулятор клининга
    repair/page.tsx
    freelance/page.tsx
  components/calculator/  # UI: поля, формы, панель цены
  data/
    pricingConfig.ts      # ⭐ Тарифы (числа) — меняйте здесь
  lib/pricing/            # ⭐ Формулы расчёта — по одному файлу на услугу
  types/calculator.ts     # TypeScript-типы входа и результата
```

## Поток данных

1. Пользователь двигает слайдеры / чекбоксы → `useState` в `*Calculator.tsx`
2. `useMemo` вызывает `calculateCleaning` / `calculateRepair` / `calculateFreelance`
3. Функции читают `pricingConfig` и возвращают `QuoteResult` (строки + итог)
4. `QuotePanel` показывает разбивку — **без своей математики**

## Команды контроля

| Команда | Зачем |
|---------|--------|
| `npm run dev` | Запуск на http://localhost:3000 |
| `npm run lint` | Стиль и типичные ошибки |
| `npm run typecheck` | Проверка типов без сборки |
| `npm run build` | Production-сборка (как на хостинге) |

Перед коммитом: **lint + typecheck** (или `build`).

## Где менять поведение

| Задача | Файл |
|--------|------|
| Поднять цену за м² клининга | `src/data/pricingConfig.ts` |
| Изменить формулу (например, скидку) | `src/lib/pricing/cleaning.ts` |
| Новое поле в форме | `*Calculator.tsx` + тип в `types/calculator.ts` |
| Тексты на главной | `src/app/page.tsx` |

## Чеклист «проект под контролем»

- [ ] Знаю, в какой папке лежит логика цен (`lib/pricing`)
- [ ] Знаю, где только тарифы (`data/pricingConfig.ts`)
- [ ] Умею запустить `npm run dev` и открыть `/cleaning`
- [ ] После правок прогоняю `npm run typecheck`
- [ ] Понимаю разницу: страница в `app/` vs форма в `components/`

## Следующие шаги (по желанию)

- Сохранение расчёта в `localStorage` или URL (`?area=45`)
- Четвёртая услуга — скопировать паттерн cleaning
- Тесты на функции в `lib/pricing` (Vitest)
