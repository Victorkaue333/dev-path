import "server-only";

import { getContentRepository } from "@/server/repositories/content-repository";
import type { ContentSource } from "@/types/content";

/**
 * Fachada usada pelas páginas públicas. Mantém as páginas desacopladas do repositório
 * e concentra regras de composição (ex.: destaques da home).
 */

export function getContentSource(): ContentSource {
  return getContentRepository().source;
}

export async function listCareers() {
  return getContentRepository().listCareers();
}

export async function getCareer(slug: string) {
  return getContentRepository().getCareerBySlug(slug);
}

export async function listRoadmaps() {
  return getContentRepository().listRoadmaps();
}

export async function getRoadmap(slug: string) {
  return getContentRepository().getRoadmapBySlug(slug);
}

export async function listCourses() {
  return getContentRepository().listCourses();
}

export async function listProjects() {
  return getContentRepository().listProjects();
}

export async function listTechnologies() {
  return getContentRepository().listTechnologies();
}

export async function listLegends() {
  return getContentRepository().listLegends();
}

export async function getLegend(slug: string) {
  return getContentRepository().getLegendBySlug(slug);
}

/** Destaques da página inicial: carreiras publicadas e algumas lendas. */
export async function getHomeHighlights() {
  const repo = getContentRepository();
  const [careers, legends, roadmaps] = await Promise.all([
    repo.listCareers(),
    repo.listLegends(),
    repo.listRoadmaps(),
  ]);
  return {
    source: repo.source,
    careers,
    legends: legends.slice(0, 4),
    roadmaps: roadmaps.slice(0, 3),
  };
}
