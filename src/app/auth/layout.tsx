import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Авторизация — Lumière",
  description: "Вход и регистрация в личный кабинет клиента Lumière.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
