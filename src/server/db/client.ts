import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { isProduction, serverEnv } from "@/config/env";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Cliente Prisma (singleton por processo). Só pode ser importado em src/server/**.
 * Lança erro claro quando DATABASE_URL não está definida: nenhuma rota pública depende dele
 * em modo demo (docs/DATABASE.md).
 */
export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("Banco de dados não configurado: defina DATABASE_URL (docs/ENVIRONMENT.md).");
    this.name = "DatabaseNotConfiguredError";
  }
}

const globalForPrisma = globalThis as unknown as { __devpathPrisma?: PrismaClient };

export function getPrismaClient(): PrismaClient {
  if (!serverEnv.DATABASE_URL) {
    throw new DatabaseNotConfiguredError();
  }
  if (!globalForPrisma.__devpathPrisma) {
    const adapter = new PrismaPg({ connectionString: serverEnv.DATABASE_URL });
    globalForPrisma.__devpathPrisma = new PrismaClient({
      adapter,
      log: isProduction ? ["error"] : ["warn", "error"],
    });
  }
  return globalForPrisma.__devpathPrisma;
}
