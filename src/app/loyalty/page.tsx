import type { Metadata } from "next";
import LoyaltyPageClient from "./LoyaltyPageClient";

export const metadata: Metadata = {
  title: "Программа лояльности — Lumière",
  description: "Баллы, уровни и рейтинг клиентов Lumière. Скидки при онлайн-записи.",
};

export default function LoyaltyPage() {
  return <LoyaltyPageClient />;
}
