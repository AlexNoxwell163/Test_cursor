"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Scissors, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/services", label: "Услуги" },
  { href: "/masters", label: "Мастера" },
  { href: "/gallery", label: "Галерея" },
  { href: "/contacts", label: "Контакты" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, initialized, logout } = useAuth();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div
          className="flex select-none items-center gap-2 font-serif text-xl text-[var(--foreground)]"
          aria-label="Lumière"
        >
          <Scissors size={20} className="text-[var(--accent)]" aria-hidden />
          <span className="tracking-wider">LUMIÈRE</span>
        </div>

        <nav className="hidden items-center gap-5 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  isActive
                    ? "text-[var(--accent)]"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {initialized && user ? (
            <>
              <span className="max-w-[160px] truncate text-sm text-[var(--foreground-muted)]">
                {user.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-[var(--border-strong)] px-4 py-2 text-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Выйти
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="rounded-full border border-[var(--border-strong)] px-4 py-2 text-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Войти
            </Link>
          )}
          <Link
            href="/booking"
            className="rounded-full border border-[var(--accent)] bg-[var(--accent)] px-5 py-2 text-sm font-medium text-[var(--background)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            Записаться
          </Link>
        </div>

        <button
          type="button"
          aria-label="Открыть меню"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md p-2 text-[var(--foreground)] transition-colors hover:bg-[var(--background-soft)] md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-3 text-base ${
                    isActive
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "text-[var(--foreground)] hover:bg-[var(--background-soft)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/booking"
              className="mt-2 rounded-full bg-[var(--accent)] px-5 py-3 text-center text-base font-medium text-[var(--background)]"
            >
              Записаться
            </Link>
            {initialized && user ? (
              <button
                type="button"
                onClick={logout}
                className="mt-1 rounded-full border border-[var(--border-strong)] px-5 py-3 text-base text-[var(--foreground)]"
              >
                Выйти ({user.name})
              </button>
            ) : (
              <Link
                href="/auth"
                className="mt-1 rounded-full border border-[var(--border-strong)] px-5 py-3 text-center text-base text-[var(--foreground)]"
              >
                Войти / Регистрация
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
