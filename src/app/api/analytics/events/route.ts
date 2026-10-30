import { type NextRequest, NextResponse } from "next/server";

import { analyticsEventSchema } from "@/features/analytics/schemas";
import { recordAnalyticsEvent } from "@/server/analytics/record-event";
import { analyticsRateLimiter, clientKeyFromHeaders } from "@/server/auth/rate-limit";

const MAX_BODY_BYTES = 2_048;

/**
 * POST /api/analytics/events — recebe um evento de navegação (docs/API.md).
 * 202 mesmo sem banco (o evento é descartado), 400 para payload inválido, 429 sob abuso.
 * Nunca lê nem grava IP/user-agent; a chave do limitador vive só em memória.
 */
export async function POST(request: NextRequest) {
  const limit = analyticsRateLimiter.hit(clientKeyFromHeaders(request.headers));
  if (!limit.allowed) {
    return NextResponse.json(
      { error: { code: "rate_limited", message: "Muitos eventos; tente mais tarde." } },
      { status: 429, headers: { "retry-after": String(Math.ceil(limit.retryAfterMs / 1000)) } },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: { code: "payload_too_large", message: "Evento excede o tamanho permitido." } },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "invalid_json", message: "Corpo da requisição não é JSON válido." } },
      { status: 400 },
    );
  }

  const parsed = analyticsEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "validation_error",
          message: "Evento inválido.",
          issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
        },
      },
      { status: 400 },
    );
  }

  await recordAnalyticsEvent(parsed.data);

  return new NextResponse(null, { status: 202 });
}
