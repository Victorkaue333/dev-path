import { z } from "zod";

/**
 * Contrato do evento de navegação (cliente -> POST /api/analytics/events).
 * Por desenho, NÃO existe campo para identificador de visitante, IP, user-agent ou e-mail.
 * Qualquer campo extra é rejeitado (`strict`).
 */
export const analyticsEventTypes = [
  "PAGE_VIEW",
  "ROADMAP_CLICK",
  "COURSE_CLICK",
  "PROJECT_CLICK",
  "CAREER_NAVIGATION",
  "EXTERNAL_LINK_CLICK",
] as const;

export type AnalyticsEventType = (typeof analyticsEventTypes)[number];

const internalPath = z
  .string()
  .min(1)
  .max(512)
  .regex(/^\/[^?#\s]*$/, "path deve ser um caminho interno sem query string");

export const analyticsEventSchema = z
  .object({
    type: z.enum(analyticsEventTypes),
    path: internalPath,
    targetSlug: z
      .string()
      .max(120)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
    /** Somente o host (ex.: "developer.mozilla.org"); o cliente já remove o path. */
    externalHost: z
      .string()
      .max(253)
      .regex(/^[a-z0-9.-]+$/i)
      .optional(),
  })
  .strict();

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;

/** Reduz uma URL externa ao host, descartando path, query e credenciais. */
export function toExternalHost(href: string): string | undefined {
  try {
    const url = new URL(href);
    return url.hostname || undefined;
  } catch {
    return undefined;
  }
}
