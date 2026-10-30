import type { ContentSource } from "@/types/content";

/** Módulo puro (sem `server-only`) para ser testável em Vitest. */
export class ContentSourceConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentSourceConfigurationError";
  }
}

/**
 * Regra de seleção da fonte de conteúdo:
 *  - CONTENT_SOURCE explícito vence;
 *  - senão, "database" se houver DATABASE_URL, "demo" caso contrário.
 * Pedir "database" sem DATABASE_URL é erro de configuração (falha alto, nunca silenciosa).
 */
export function resolveContentSource(env: {
  CONTENT_SOURCE?: ContentSource;
  DATABASE_URL?: string;
}): ContentSource {
  if (env.CONTENT_SOURCE === "database") {
    if (!env.DATABASE_URL) {
      throw new ContentSourceConfigurationError(
        'CONTENT_SOURCE="database" exige DATABASE_URL definida (docs/ENVIRONMENT.md).',
      );
    }
    return "database";
  }
  if (env.CONTENT_SOURCE === "demo") return "demo";
  return env.DATABASE_URL ? "database" : "demo";
}
