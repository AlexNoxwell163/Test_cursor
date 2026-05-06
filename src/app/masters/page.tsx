import type { Metadata } from "next";
import MasterCard from "@/components/MasterCard";
import SectionTitle from "@/components/SectionTitle";
import { masters } from "@/data/masters";

export const metadata: Metadata = {
  title: "Мастера — Lumière",
  description:
    "Команда стилистов и барберов парикмахерской Lumière. Опыт, специализация, портфолио.",
};

export default function MastersPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Команда"
        title="Наши мастера"
        subtitle="Каждый специалист — это многолетний опыт, постоянное обучение и любовь к своему делу."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {masters.map((master) => (
          <MasterCard key={master.id} master={master} />
        ))}
      </div>
    </section>
  );
}
