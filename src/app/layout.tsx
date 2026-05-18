import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Калькулятор услуг",
  description:
    "Расчёт стоимости клининга, ремонта и фриланс-работ — учебный проект с прозрачной структурой.",
};

const nav = [
  { href: "/cleaning", label: "Клининг" },
  { href: "/repair", label: "Ремонт" },
  { href: "/freelance", label: "Фриланс" },
] as const;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen antialiased">
        <header className="border-b border-[var(--border)] bg-[var(--background-soft)]/80 backdrop-blur">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              <span className="text-[var(--accent)]">Calc</span>
              <span className="text-[var(--foreground-muted)]">Services</span>
            </Link>
            <nav className="flex flex-wrap gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</main>
        <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--foreground-muted)]">
          Учебный проект — логика цен в{" "}
          <code className="font-mono text-[var(--accent)]">src/lib/pricing</code>
        </footer>
      </body>
    </html>
  );
}
