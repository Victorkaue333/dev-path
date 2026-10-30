import "server-only";

import { isDatabaseConfigured } from "@/config/env";
import type { AnalyticsEventInput } from "@/features/analytics/schemas";
import { getPrismaClient } from "@/server/db/client";

export type RecordResult = { stored: true } | { stored: false; reason: "db_unavailable" | "error" };

/**
 * Persiste um evento de navegação já validado. Sem banco, descarta silenciosamente
 * (o endpoint continua respondendo 202 para não acoplar o site ao banco).
 * Nenhum IP, user-agent ou identificador de visitante é gravado (docs/INTEGRATION.md, LGPD).
 */
export async function recordAnalyticsEvent(event: AnalyticsEventInput): Promise<RecordResult> {
  if (!isDatabaseConfigured) return { stored: false, reason: "db_unavailable" };
  try {
    await getPrismaClient().analyticsEvent.create({
      data: {
        type: event.type,
        path: event.path,
        targetSlug: event.targetSlug,
        externalHost: event.externalHost,
      },
    });
    return { stored: true };
  } catch (error) {
    console.error("[analytics] falha ao gravar evento", error);
    return { stored: false, reason: "error" };
  }
}
