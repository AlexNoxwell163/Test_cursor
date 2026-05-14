import Link from "next/link";
import { Instagram, Mail, MapPin, Phone, Scissors } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--border)] bg-[var(--background-soft)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2 font-serif text-xl">
            <Scissors size={20} className="text-[var(--accent)]" />
            <span className="tracking-wider">LUMIÈRE</span>
          </Link>
          <p className="mt-3 text-sm text-[var(--foreground-muted)]">
            Парикмахерская и салон красоты в центре города. Современный подход,
            опытные мастера, премиальная косметика.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
            Контакты
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-[var(--foreground-muted)]">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-[var(--accent)]" />
              <span>ул. Тверская, 15, Москва</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 text-[var(--accent)]" />
              <a href="tel:+74951234567" className="hover:text-[var(--foreground)]">
                +7 (495) 123-45-67
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={16} className="mt-0.5 text-[var(--accent)]" />
              <a
                href="mailto:hello@lumiere-salon.ru"
                className="hover:text-[var(--foreground)]"
              >
                hello@lumiere-salon.ru
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Instagram size={16} className="mt-0.5 text-[var(--accent)]" />
              <span>@lumiere.salon</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
            Часы работы
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-[var(--foreground-muted)]">
            <li className="flex justify-between">
              <span>Пн – Пт</span>
              <span>10:00 – 21:00</span>
            </li>
            <li className="flex justify-between">
              <span>Сб – Вс</span>
              <span>10:00 – 20:00</span>
            </li>
          </ul>
          <Link
            href="/booking"
            className="mt-6 inline-flex rounded-full border border-[var(--accent)] px-5 py-2 text-sm text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]"
          >
            Записаться онлайн
          </Link>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/gifts" className="text-[var(--foreground-muted)] hover:text-[var(--accent)]">
              Подарочные сертификаты
            </Link>
            <Link href="/loyalty" className="text-[var(--foreground-muted)] hover:text-[var(--accent)]">
              Программа лояльности
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-[var(--foreground-muted)] sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Lumière. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
