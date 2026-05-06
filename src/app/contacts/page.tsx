import type { Metadata } from "next";
import { Clock, Instagram, Mail, MapPin, Phone } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Контакты — Lumière",
  description: "Адрес, телефон и часы работы парикмахерской Lumière в центре Москвы.",
};

const items = [
  {
    icon: MapPin,
    title: "Адрес",
    value: "ул. Тверская, 15, Москва",
    hint: "м. Тверская, 3 минуты пешком",
  },
  {
    icon: Phone,
    title: "Телефон",
    value: "+7 (495) 123-45-67",
    href: "tel:+74951234567",
  },
  {
    icon: Mail,
    title: "Email",
    value: "hello@lumiere-salon.ru",
    href: "mailto:hello@lumiere-salon.ru",
  },
  {
    icon: Instagram,
    title: "Instagram",
    value: "@lumiere.salon",
  },
  {
    icon: Clock,
    title: "Часы работы",
    value: "Пн–Пт: 10:00 – 21:00",
    hint: "Сб–Вс: 10:00 – 20:00",
  },
];

export default function ContactsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Контакты"
        title="Как нас найти"
        subtitle="Мы находимся в самом центре города. Удобная парковка, рядом метро."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="grid gap-4">
          {items.map(({ icon: Icon, title, value, hint, href }) => {
            const content = (
              <div className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-5 transition-colors hover:border-[var(--accent)]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
                    {title}
                  </p>
                  <p className="mt-1 text-base text-[var(--foreground)]">{value}</p>
                  {hint && (
                    <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                      {hint}
                    </p>
                  )}
                </div>
              </div>
            );
            return href ? (
              <a key={title} href={href} className="block">
                {content}
              </a>
            ) : (
              <div key={title}>{content}</div>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
          <iframe
            title="Карта расположения салона"
            src="https://yandex.ru/map-widget/v1/?ll=37.612,55.760&z=15&pt=37.612,55.760,pm2rdl"
            width="100%"
            height="100%"
            style={{ minHeight: 480, border: 0 }}
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
