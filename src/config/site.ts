/**
 * Configuração pública do site. Pode ser importada em Server e Client Components.
 * Nunca colocar segredos aqui.
 */

const DEFAULT_SITE_URL = "http://localhost:3000";

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;
  try {
    return new URL(raw).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const siteConfig = {
  name: "DevPath",
  tagline: "Seu caminho no mundo da tecnologia",
  description:
    "Plataforma educacional pública e gratuita para iniciar e desenvolver uma carreira em tecnologia: roadmaps por carreira, cursos gratuitos, projetos práticos e história da computação.",
  url: resolveSiteUrl(),
  locale: "pt-BR",
  /** Repositório público do projeto (sem URL privada). */
  repositoryUrl: "https://github.com/Victorkaue333/dev-path",
} as const;

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

/** Navegação principal do site público. */
export const publicNav: readonly NavItem[] = [
  { label: "Carreiras", href: "/carreiras", description: "Áreas para começar em tecnologia" },
  { label: "Roadmaps", href: "/roadmaps", description: "Passo a passo por carreira" },
  { label: "Cursos", href: "/cursos", description: "Cursos gratuitos e documentação oficial" },
  { label: "Projetos", href: "/projetos", description: "Prática por nível" },
  { label: "Mercado", href: "/mercado", description: "Tecnologias e habilidades" },
  { label: "Lendas da TI", href: "/lendas-da-ti", description: "História da computação" },
  { label: "Sobre", href: "/sobre" },
] as const;

/** Navegação do painel administrativo. */
export const adminNav: readonly NavItem[] = [
  { label: "Visão geral", href: "/admin/dashboard" },
  { label: "Carreiras", href: "/admin/carreiras" },
  { label: "Roadmaps", href: "/admin/roadmaps" },
  { label: "Cursos", href: "/admin/cursos" },
  { label: "Projetos", href: "/admin/projetos" },
  { label: "Conteúdos", href: "/admin/conteudos" },
  { label: "Analytics", href: "/admin/analytics" },
] as const;

/** Rotas públicas estáticas usadas pelo sitemap. */
export const publicStaticRoutes = ["/", ...publicNav.map((item) => item.href)] as const;
