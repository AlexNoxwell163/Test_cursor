import type { Metadata } from "next";
import SectionTitle from "@/components/SectionTitle";
import ServicesGrid from "@/components/ServicesGrid";

export const metadata: Metadata = {
  title: "Услуги и цены — Lumière",
  description:
    "Полный прайс парикмахерской Lumière: стрижки, окрашивание, укладки, борода, уход за волосами.",
};

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Прайс"
        title="Услуги и цены"
        subtitle="Все цены указаны в рублях. Стоимость может варьироваться в зависимости от длины и густоты волос — точную цену уточняем перед началом процедуры."
      />
      <div className="mt-12">
        <ServicesGrid />
      </div>
    </section>
  );
}
