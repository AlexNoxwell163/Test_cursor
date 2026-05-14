import Image from "next/image";
import Link from "next/link";
import {
  Award,
  CalendarCheck,
  ChevronRight,
  Sparkles,
  Users,
} from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import SectionTitle from "@/components/SectionTitle";
import ReviewCard from "@/components/ReviewCard";
import QuickBookingBanner from "@/components/QuickBookingBanner";
import { services } from "@/data/services";
import { reviews } from "@/data/reviews";

const featuredServices = services.slice(0, 6);
const featuredReviews = reviews.slice(0, 3);

const advantages = [
  {
    icon: Award,
    title: "Опытные мастера",
    description:
      "Сертифицированные стилисты с опытом 6–12 лет, регулярно проходят обучение.",
  },
  {
    icon: Sparkles,
    title: "Премиальная косметика",
    description:
      "Работаем только с профессиональной косметикой L'Oréal, Kérastase, Davines.",
  },
  {
    icon: CalendarCheck,
    title: "Удобная запись",
    description:
      "Онлайн-запись 24/7 и точное соблюдение времени — без ожидания у двери.",
  },
  {
    icon: Users,
    title: "Индивидуальный подход",
    description:
      "Подбираем образ под форму лица, тип волос и ваш стиль жизни.",
  },
];

export default function HomePage() {
  return (
    <div>
      <QuickBookingBanner />
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -left-20 top-16 -z-10 h-64 w-64 rounded-full bg-[var(--glow-rose)] blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-10 -z-10 h-72 w-72 rounded-full bg-[var(--glow-gold)] blur-3xl" />
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1800&q=80"
            alt="Интерьер парикмахерской"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/78 to-[var(--background)]/35" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="glass-panel max-w-2xl rounded-3xl border border-white/10 p-8 shadow-[0_25px_80px_-35px_rgba(212,165,116,0.65)] animate-fade-up sm:p-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
              Парикмахерская премиум-класса
            </span>
            <h1 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="gold-gradient-text">Ваш образ</span> — наша визитная
              карточка
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--foreground-muted)] sm:text-lg">
              Lumière — место, где встречаются классическое мастерство и
              современные тенденции. Запишитесь онлайн и доверьте свой образ
              профессионалам.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--background)] shadow-[0_10px_28px_-14px_rgba(212,165,116,0.95)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]"
              >
                Записаться онлайн
                <ChevronRight size={16} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-6 py-3 text-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Услуги и цены
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Почему мы"
          title="Четыре причины выбрать Lumière"
          subtitle="Мы создаём не просто стрижку, а целостный образ — с заботой о здоровье ваших волос."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-6 transition-colors hover:border-[var(--accent)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 font-serif text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle
            eyebrow="Услуги"
            title="Что мы делаем лучше всего"
            subtitle="Полный спектр парикмахерских услуг — от классики до сложных техник окрашивания."
          />
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            Все услуги <ChevronRight size={16} />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle
            eyebrow="Отзывы"
            title="Что говорят наши клиенты"
          />
          <Link
            href="/reviews"
            className="inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            Все отзывы <ChevronRight size={16} />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featuredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--background-soft)] via-[var(--background-elev)] to-[var(--background-soft)] p-10 text-center sm:p-14">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl">
            Готовы к новому образу?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--foreground-muted)]">
            Запись занимает меньше минуты. Подберём услугу, мастера и удобное
            время.
          </p>
          <Link
            href="/booking"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-medium text-[var(--background)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            Записаться сейчас
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
