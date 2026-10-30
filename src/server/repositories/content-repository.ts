import "server-only";

import { serverEnv } from "@/config/env";
import type {
  CareerDetail,
  CareerSummary,
  ContentSource,
  CourseSummary,
  LegendDetail,
  LegendSummary,
  ProjectSummary,
  RoadmapDetail,
  RoadmapSummary,
  TechnologySummary,
} from "@/types/content";

import { resolveContentSource } from "./content-source";
import { DemoContentRepository } from "./demo-content-repository";
import { PrismaContentRepository } from "./prisma-content-repository";

export { ContentSourceConfigurationError, resolveContentSource } from "./content-source";

/**
 * Contrato de leitura do conteúdo público. Só retorna itens PUBLICADOS.
 * Implementações: DemoContentRepository (arquivos locais) e PrismaContentRepository (PostgreSQL).
 * Páginas e componentes dependem apenas desta interface (docs/ARCHITECTURE.md).
 */
export interface ContentRepository {
  readonly source: ContentSource;
  listCareers(): Promise<CareerSummary[]>;
  getCareerBySlug(slug: string): Promise<CareerDetail | null>;
  listRoadmaps(): Promise<RoadmapSummary[]>;
  getRoadmapBySlug(slug: string): Promise<RoadmapDetail | null>;
  listCourses(): Promise<CourseSummary[]>;
  listProjects(): Promise<ProjectSummary[]>;
  listTechnologies(): Promise<TechnologySummary[]>;
  listLegends(): Promise<LegendSummary[]>;
  getLegendBySlug(slug: string): Promise<LegendDetail | null>;
}

let repository: ContentRepository | undefined;

/** Resolvido uma vez por processo: valor previsível, compatível com Cache Components. */
export function getContentRepository(): ContentRepository {
  if (!repository) {
    const source = resolveContentSource(serverEnv);
    repository =
      source === "database" ? new PrismaContentRepository() : new DemoContentRepository();
  }
  return repository;
}
