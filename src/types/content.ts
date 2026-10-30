/**
 * Tipos de domínio expostos à camada pública (DTOs).
 * São independentes do Prisma para que páginas e componentes não dependam do ORM.
 * A fonte pode ser o conteúdo demonstrativo local ou o banco (docs/ARCHITECTURE.md).
 */

export type PublicationStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type TechnologyCategory =
  "LANGUAGE" | "FRAMEWORK" | "LIBRARY" | "DATABASE" | "TOOL" | "PLATFORM" | "CONCEPT";

/** Token de cor do Design System aceito por cartões e etiquetas. */
export type AccentToken = "green" | "yellow" | "coral" | "ink";

export const skillLevelLabel: Record<SkillLevel, string> = {
  BEGINNER: "Iniciante",
  INTERMEDIATE: "Intermediário",
  ADVANCED: "Avançado",
};

export const technologyCategoryLabel: Record<TechnologyCategory, string> = {
  LANGUAGE: "Linguagem",
  FRAMEWORK: "Framework",
  LIBRARY: "Biblioteca",
  DATABASE: "Banco de dados",
  TOOL: "Ferramenta",
  PLATFORM: "Plataforma",
  CONCEPT: "Conceito",
};

export interface CareerSummary {
  slug: string;
  title: string;
  /** Nome curto para cartões compactos (ex.: "Frontend"); ausente = usar `title`. */
  shortTitle?: string;
  /** Frase de impacto curta (ex.: "Interfaces que inspiram."). */
  tagline?: string;
  shortDescription: string;
  icon?: string;
  accent?: AccentToken;
  order: number;
}

export interface CareerDetail extends CareerSummary {
  description: string;
  roadmaps: RoadmapSummary[];
  technologies: TechnologySummary[];
  projects: ProjectSummary[];
}

export interface TopicSummary {
  slug: string;
  title: string;
  description?: string;
}

export interface RoadmapStepItem {
  order: number;
  title: string;
  description: string;
  topics: TopicSummary[];
}

export interface RoadmapSummary {
  slug: string;
  title: string;
  description: string;
  level: SkillLevel;
  careerSlug: string;
  careerTitle: string;
  stepCount: number;
}

export interface RoadmapDetail extends RoadmapSummary {
  steps: RoadmapStepItem[];
}

export interface CourseSummary {
  slug: string;
  title: string;
  description: string;
  provider: string;
  url: string;
  language: string;
  level: SkillLevel;
  isFree: boolean;
  isOfficialDocs: boolean;
  durationMinutes?: number;
  topicSlugs: string[];
}

export interface ProjectSummary {
  slug: string;
  title: string;
  description: string;
  level: SkillLevel;
  estimatedHours?: number;
  careerSlug?: string;
  technologySlugs: string[];
}

export interface TechnologySummary {
  slug: string;
  name: string;
  category: TechnologyCategory;
  description?: string;
  website?: string;
}

export interface LegendSummary {
  slug: string;
  name: string;
  bornYear?: number;
  diedYear?: number;
  summary: string;
  contributions: string[];
  /** Caminho em /public; ausente enquanto o asset não existir. */
  imagePath?: string;
}

export interface LegendDetail extends LegendSummary {
  biography: string;
}

/** Origem efetiva do conteúdo em tempo de execução. */
export type ContentSource = "demo" | "database";
