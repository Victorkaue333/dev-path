import "server-only";

import { redirect } from "next/navigation";

import { getAdminSession } from "./session";
import type { AdminSession } from "./session-token";

/**
 * Guarda de autorização no servidor. Usada pelo layout admin e por qualquer operação de escrita.
 * O proxy (src/proxy.ts) faz uma primeira barreira, mas a verificação que vale é esta.
 */
export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

/** Variante para operações restritas ao papel OWNER. */
export async function requireOwnerSession(): Promise<AdminSession> {
  const session = await requireAdminSession();
  if (session.role !== "OWNER") {
    redirect("/admin/dashboard?erro=sem-permissao");
  }
  return session;
}
