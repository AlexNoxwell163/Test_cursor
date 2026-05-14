"use client";

import type { AuthUser, AuthUserRecord } from "@/types";

const USERS_KEY = "barbershop:auth:users";
const CURRENT_USER_KEY = "barbershop:auth:current-user";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function readUsers(): AuthUserRecord[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AuthUserRecord[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: AuthUserRecord[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toAuthUser(record: AuthUserRecord): AuthUser {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    phone: record.phone,
  };
}

export function getCurrentUser(): AuthUser | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser | null;
    return parsed ?? null;
  } catch {
    return null;
  }
}

export function registerUser(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}): { ok: true; user: AuthUser } | { ok: false; error: string } {
  const users = readUsers();
  const email = normalizeEmail(input.email);

  if (users.some((user) => normalizeEmail(user.email) === email)) {
    return { ok: false, error: "Пользователь с таким email уже существует" };
  }

  const record: AuthUserRecord = {
    id: `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    name: input.name.trim(),
    email,
    phone: input.phone?.trim() || undefined,
    password: input.password,
    createdAt: new Date().toISOString(),
  };

  writeUsers([...users, record]);
  const current = toAuthUser(record);
  if (isBrowser()) {
    window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(current));
  }

  return { ok: true, user: current };
}

export function loginUser(input: {
  email: string;
  password: string;
}): { ok: true; user: AuthUser } | { ok: false; error: string } {
  const users = readUsers();
  const email = normalizeEmail(input.email);
  const matched = users.find(
    (user) => normalizeEmail(user.email) === email && user.password === input.password,
  );

  if (!matched) {
    return { ok: false, error: "Неверный email или пароль" };
  }

  const current = toAuthUser(matched);
  if (isBrowser()) {
    window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(current));
  }
  return { ok: true, user: current };
}

export function logoutUser(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(CURRENT_USER_KEY);
}
