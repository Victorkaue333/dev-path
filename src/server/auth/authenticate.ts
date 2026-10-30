import type { AdminRole } from "./session-token";
import type { RateLimiter } from "./rate-limit";

/**
 * Regra de autenticação do painel, pura e testável: todas as dependências são injetadas.
 * A Server Action (src/features/admin/actions/login.ts) só monta as dependências reais.
 *
 * Ordem das verificações (fail-closed):
 *  1. autenticação configurada (AUTH_SECRET)?  -> "auth_not_configured"
 *  2. banco configurado?                       -> "db_unavailable"
 *  3. limite de tentativas                     -> "rate_limited"
 *  4. credenciais                              -> "invalid_credentials" (mensagem única para e-mail e senha)
 */
export interface AdminRecord {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  passwordHash: string;
  isActive: boolean;
}

export type AuthFailureReason =
  "auth_not_configured" | "db_unavailable" | "rate_limited" | "invalid_credentials";

export type AuthResult =
  | { ok: true; admin: Pick<AdminRecord, "id" | "email" | "name" | "role"> }
  | { ok: false; reason: AuthFailureReason; retryAfterMs?: number };

export interface AuthenticateDeps {
  isAuthConfigured: boolean;
  isDatabaseConfigured: boolean;
  rateLimiter: RateLimiter;
  findAdminByEmail: (email: string) => Promise<AdminRecord | null>;
  verifyPassword: (plain: string, hash: string) => Promise<boolean>;
  onSuccess?: (adminId: string) => Promise<void>;
}

export interface AuthenticateInput {
  email: string;
  password: string;
  /** Chave do limitador (IP). Nunca persistida. */
  clientKey: string;
}

export const authFailureMessages: Record<AuthFailureReason, string> = {
  auth_not_configured:
    "Autenticação indisponível: AUTH_SECRET não configurado neste ambiente (docs/ENVIRONMENT.md).",
  db_unavailable:
    "Painel indisponível: banco de dados não configurado neste ambiente (docs/ENVIRONMENT.md).",
  rate_limited: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
  invalid_credentials: "E-mail ou senha inválidos.",
};

export async function authenticateAdmin(
  input: AuthenticateInput,
  deps: AuthenticateDeps,
): Promise<AuthResult> {
  if (!deps.isAuthConfigured) return { ok: false, reason: "auth_not_configured" };
  if (!deps.isDatabaseConfigured) return { ok: false, reason: "db_unavailable" };

  const limit = deps.rateLimiter.hit(input.clientKey);
  if (!limit.allowed) {
    return { ok: false, reason: "rate_limited", retryAfterMs: limit.retryAfterMs };
  }

  const email = input.email.trim().toLowerCase();
  const admin = await deps.findAdminByEmail(email);

  // Compara sempre contra um hash para não vazar, pelo tempo de resposta, se o e-mail existe.
  const hashToCheck = admin?.passwordHash ?? DUMMY_HASH;
  const passwordOk = await deps.verifyPassword(input.password, hashToCheck);

  if (!admin || !admin.isActive || !passwordOk) {
    return { ok: false, reason: "invalid_credentials" };
  }

  deps.rateLimiter.reset(input.clientKey);
  await deps.onSuccess?.(admin.id);

  return {
    ok: true,
    admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
  };
}

/** Hash bcrypt válido de uma string aleatória; usado apenas para igualar o tempo de resposta. */
const DUMMY_HASH = "$2a$12$C6UzMDM.H6dfI/f/IKcEeO5pn9wR6kG3c7m5Qm2Zq0Jk7u0bYcJ1e";
