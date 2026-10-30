"use client";

import { type AnalyticsEventInput, analyticsEventSchema } from "./schemas";

const ENDPOINT = "/api/analytics/events";

/** Habilitado apenas com NEXT_PUBLIC_ANALYTICS_ENABLED=true (avaliado no build). */
export const analyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";

/**
 * Envia um evento sem bloquear a navegação. Valida localmente para nunca enviar
 * um payload fora do contrato. Falhas são ignoradas: analytics nunca quebra a experiência.
 */
export function trackEvent(event: AnalyticsEventInput): void {
  if (!analyticsEnabled || typeof window === "undefined") return;
  const parsed = analyticsEventSchema.safeParse(event);
  if (!parsed.success) return;

  const body = JSON.stringify(parsed.data);
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(ENDPOINT, blob);
      return;
    }
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // intencionalmente silencioso
  }
}
