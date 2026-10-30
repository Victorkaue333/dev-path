import "server-only";

import { cookies } from "next/headers";

import { isProduction, serverEnv } from "@/config/env";

import {
  type AdminSession,
  SESSION_COOKIE_NAME,
  signSessionToken,
  verifySessionToken,
} from "./session-token";

/**
 * Cookie de sessão: httpOnly, SameSite=Lax, Secure em produção, Path=/.
 * Lax + Server Actions (verificação de Origin nativa do Next) cobrem CSRF para o painel.
 */
function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export async function createAdminSession(session: Omit<AdminSession, "expiresAt">): Promise<void> {
  const secret = serverEnv.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET não configurado; impossível criar sessão.");
  }
  const ttlHours = serverEnv.AUTH_SESSION_TTL_HOURS;
  const token = await signSessionToken(session, secret, ttlHours);
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, cookieOptions(ttlHours * 3600));
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, "", { ...cookieOptions(0), maxAge: 0 });
}

/** Lê e valida a sessão atual. Acessa cookies(): chamar dentro de <Suspense> (Cache Components). */
export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token, serverEnv.AUTH_SECRET);
}
