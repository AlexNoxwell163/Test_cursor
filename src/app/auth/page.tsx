"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

type Mode = "login" | "register";

const inputClass =
  "mt-2 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--background-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]";

export default function AuthPage() {
  const router = useRouter();
  const { user, initialized, login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const title = useMemo(
    () => (mode === "login" ? "Вход в аккаунт" : "Создание аккаунта"),
    [mode],
  );

  if (initialized && user) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--background-soft)] p-8 text-center sm:p-10">
          <h1 className="font-serif text-3xl">Вы уже авторизованы</h1>
          <p className="mt-3 text-[var(--foreground-muted)]">
            Вход выполнен как <span className="text-[var(--accent)]">{user.name}</span>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/booking"
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--background)]"
            >
              Перейти к записи
            </Link>
            <Link
              href="/"
              className="rounded-full border border-[var(--border-strong)] px-6 py-3 text-sm"
            >
              На главную
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const submitLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const result = login({ email: loginEmail, password: loginPassword });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/booking");
  };

  const submitRegister = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Имя должно содержать минимум 2 символа");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Введите корректный email");
      return;
    }
    if (password.length < 6) {
      setError("Пароль должен быть не короче 6 символов");
      return;
    }
    if (password !== passwordRepeat) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    const result = register({
      name,
      email,
      phone,
      password,
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/booking");
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--background-soft)] p-6 sm:p-8">
        <div className="mb-6 flex rounded-full border border-[var(--border)] bg-[var(--background)] p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex-1 rounded-full px-4 py-2 text-sm transition-colors ${
              mode === "login"
                ? "bg-[var(--accent)] text-[var(--background)]"
                : "text-[var(--foreground-muted)]"
            }`}
          >
            Вход
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className={`flex-1 rounded-full px-4 py-2 text-sm transition-colors ${
              mode === "register"
                ? "bg-[var(--accent)] text-[var(--background)]"
                : "text-[var(--foreground-muted)]"
            }`}
          >
            Регистрация
          </button>
        </div>

        <h1 className="font-serif text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          {mode === "login"
            ? "Войдите в аккаунт, чтобы быстрее записываться в следующий раз."
            : "Создайте аккаунт и сохраните свои данные для удобной записи."}
        </p>

        {mode === "login" ? (
          <form onSubmit={submitLogin} className="mt-6 grid gap-4" noValidate>
            <label className="text-sm">
              Email
              <input
                type="email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                className={inputClass}
                required
                autoComplete="email"
              />
            </label>
            <label className="text-sm">
              Пароль
              <input
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                className={inputClass}
                required
                autoComplete="current-password"
              />
            </label>
            {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--background)] disabled:opacity-70"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>
        ) : (
          <form onSubmit={submitRegister} className="mt-6 grid gap-4" noValidate>
            <label className="text-sm">
              Имя
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={inputClass}
                required
                autoComplete="name"
              />
            </label>
            <label className="text-sm">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
                required
                autoComplete="email"
              />
            </label>
            <label className="text-sm">
              Телефон (необязательно)
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className={inputClass}
                autoComplete="tel"
              />
            </label>
            <label className="text-sm">
              Пароль
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
                required
                autoComplete="new-password"
              />
            </label>
            <label className="text-sm">
              Повторите пароль
              <input
                type="password"
                value={passwordRepeat}
                onChange={(event) => setPasswordRepeat(event.target.value)}
                className={inputClass}
                required
                autoComplete="new-password"
              />
            </label>
            {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--background)] disabled:opacity-70"
            >
              {loading ? "Создание..." : "Создать аккаунт"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
