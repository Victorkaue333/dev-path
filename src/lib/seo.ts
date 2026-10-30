import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Caminho absoluto a partir da raiz, ex.: "/carreiras". Usado em canonical e OG url. */
  path: string;
  /** Impede indexação (usado em rotas administrativas). */
  noIndex?: boolean;
}

/**
 * Monta metadata consistente para páginas públicas (título, descrição, canonical, Open Graph).
 * Dados estruturados (JSON-LD) ficam fora daqui: só devem ser gerados quando representarem conteúdo real.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  noIndex,
}: PageMetadataInput): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${title} | ${siteConfig.name}`,
      description,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

/** Metadata padrão para qualquer rota administrativa: nunca indexar. */
export const adminMetadata: Metadata = {
  title: { default: "Painel administrativo", template: `%s | Admin ${siteConfig.name}` },
  robots: { index: false, follow: false, nocache: true },
};
