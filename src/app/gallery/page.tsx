import type { Metadata } from "next";
import Image from "next/image";
import SectionTitle from "@/components/SectionTitle";
import { gallery } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Галерея — Lumière",
  description: "Работы мастеров парикмахерской Lumière: стрижки, окрашивание, укладки.",
};

export default function GalleryPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Галерея"
        title="Работы наших мастеров"
        subtitle="Несколько примеров того, что мы умеем — от классических стрижек до сложного окрашивания."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((item, index) => (
          <div
            key={item.id}
            className={`relative overflow-hidden rounded-2xl border border-[var(--border)] ${
              index % 5 === 0 ? "lg:row-span-2 lg:h-[640px]" : "h-80"
            }`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
