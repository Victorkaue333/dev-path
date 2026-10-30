import "server-only";

import { z } from "zod";

/**
 * Variáveis de ambiente do servidor, validadas uma única vez.
 * Tudo aqui é opcional por design: a aplicação precisa iniciar em modo de
 * desenvolvimento sem banco e sem segredo de autenticação (fluxo admin fica bloqueado).
 * Referência: docs/ENVIRONMENT.md
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z
    .string()
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  CONTENT_SOURCE: z
    .enum(["demo", "database"])
    .optional()
    .or(z.literal("").transform(() => undefined)),
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET precisa ter pelo menos 32 caracteres")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  AUTH_SESSION_TTL_HOURS: z.coerce.number().int().min(1).max(72).default(8),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function loadServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    CONTENT_SOURCE: process.env.CONTENT_SOURCE,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_SESSION_TTL_HOURS: process.env.AUTH_SESSION_TTL_HOURS,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Variáveis de ambiente inválidas: ${issues}`);
  }

  return parsed.data;
}

/** Carregado no escopo do módulo: valor previsível por processo, compatível com Cache Components. */
export const serverEnv: ServerEnv = loadServerEnv();

export const isProduction = serverEnv.NODE_ENV === "production";

/** Banco configurado = há uma URL. Não garante que o banco esteja acessível. */
export const isDatabaseConfigured = Boolean(serverEnv.DATABASE_URL);

/** Autenticação do painel só funciona com segredo definido. */
export const isAuthConfigured = Boolean(serverEnv.AUTH_SECRET);
