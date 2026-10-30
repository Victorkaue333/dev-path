import { NextResponse } from "next/server";

import { isDatabaseConfigured } from "@/config/env";
import { getContentSource } from "@/server/services/content-service";

/**
 * GET /api/health — verificação de vida usada por monitoramento e pelo checklist de staging.
 * Não toca no banco (não é um readiness check); informa apenas configuração.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "devpath",
      contentSource: getContentSource(),
      database: isDatabaseConfigured ? "configured" : "not_configured",
      timestamp: new Date().toISOString(),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
