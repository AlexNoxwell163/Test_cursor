import type { Metadata } from "next";
import GiftsPageClient from "./GiftsPageClient";

export const metadata: Metadata = {
  title: "Подарочные сертификаты — Lumière",
  description: "Подарочный сертификат Lumière: номинал и код для оплаты части визита при онлайн-записи.",
};

export default function GiftsPage() {
  return <GiftsPageClient />;
}
