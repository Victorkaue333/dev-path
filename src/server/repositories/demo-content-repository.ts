import { demoCareers } from "@/features/careers/demo-data";
import { demoCourses } from "@/features/courses/demo-data";
import { demoLegends } from "@/features/legends/demo-data";
import { demoTechnologies } from "@/features/market/demo-data";
import { demoProjects } from "@/features/projects/demo-data";
import { demoRoadmaps } from "@/features/roadmaps/demo-data";
import type {
  CareerDetail,
  CareerSummary,
  CourseSummary,
  LegendDetail,
  LegendSummary,
  ProjectSummary,
  RoadmapDetail,
  RoadmapSummary,
  TechnologySummary,
} from "@/types/content";

import type { ContentRepository } from "./content-repository";

/**
 * Implementação sem banco: lê os arquivos demo-data.ts e aplica as mesmas regras
 * de publicação da implementação Prisma (somente PUBLISHED).
 * Não usa `server-only` para poder ser exercitada em testes unitários.
 */
export class DemoContentRepository implements ContentRepository {
  readonly source = "demo" as const;

  private get publishedCareers() {
    return demoCareers.filter((c) => c.status === "PUBLISHED").sort((a, b) => a.order - b.order);
  }

  private get publishedRoadmaps() {
    return demoRoadmaps.filter((r) => r.status === "PUBLISHED").sort((a, b) => a.order - b.order);
  }

  private toRoadmapSummary(roadmap: (typeof demoRoadmaps)[number]): RoadmapSummary {
    const career = demoCareers.find((c) => c.slug === roadmap.careerSlug);
    return {
      slug: roadmap.slug,
      title: roadmap.title,
      description: roadmap.description,
      level: roadmap.level,
      careerSlug: roadmap.careerSlug,
      careerTitle: career?.title ?? roadmap.careerSlug,
      stepCount: roadmap.steps.length,
    };
  }

  private toTechnology(slug: string): TechnologySummary | undefined {
    const tech = demoTechnologies.find((t) => t.slug === slug);
    return tech ? { ...tech } : undefined;
  }

  private toProjectSummary(project: (typeof demoProjects)[number]): ProjectSummary {
    return {
      slug: project.slug,
      title: project.title,
      description: project.description,
      level: project.level,
      estimatedHours: project.estimatedHours,
      careerSlug: project.careerSlug,
      technologySlugs: [...project.technologySlugs],
    };
  }

  async listCareers(): Promise<CareerSummary[]> {
    return this.publishedCareers.map((c) => ({
      slug: c.slug,
      title: c.title,
      shortTitle: c.shortTitle,
      tagline: c.tagline,
      shortDescription: c.shortDescription,
      icon: c.icon,
      accent: c.accent,
      order: c.order,
    }));
  }

  async getCareerBySlug(slug: string): Promise<CareerDetail | null> {
    const career = this.publishedCareers.find((c) => c.slug === slug);
    if (!career) return null;
    return {
      slug: career.slug,
      title: career.title,
      shortTitle: career.shortTitle,
      tagline: career.tagline,
      shortDescription: career.shortDescription,
      description: career.description,
      icon: career.icon,
      accent: career.accent,
      order: career.order,
      roadmaps: this.publishedRoadmaps
        .filter((r) => r.careerSlug === career.slug)
        .map((r) => this.toRoadmapSummary(r)),
      technologies: career.technologies
        .slice()
        .sort((a, b) => a.importance - b.importance)
        .map((t) => this.toTechnology(t.slug))
        .filter((t): t is TechnologySummary => Boolean(t)),
      projects: demoProjects
        .filter((p) => p.status === "PUBLISHED" && p.careerSlug === career.slug)
        .map((p) => this.toProjectSummary(p)),
    };
  }

  async listRoadmaps(): Promise<RoadmapSummary[]> {
    return this.publishedRoadmaps.map((r) => this.toRoadmapSummary(r));
  }

  async getRoadmapBySlug(slug: string): Promise<RoadmapDetail | null> {
    const roadmap = this.publishedRoadmaps.find((r) => r.slug === slug);
    if (!roadmap) return null;
    return {
      ...this.toRoadmapSummary(roadmap),
      steps: roadmap.steps
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((s) => ({
          order: s.order,
          title: s.title,
          description: s.description,
          topics: s.topics.map((t) => ({ ...t })),
        })),
    };
  }

  async listCourses(): Promise<CourseSummary[]> {
    return demoCourses
      .filter((c) => c.status === "PUBLISHED")
      .map((c) => ({
        slug: c.slug,
        title: c.title,
        description: c.description,
        provider: c.provider,
        url: c.url,
        language: c.language,
        level: c.level,
        isFree: c.isFree,
        isOfficialDocs: c.isOfficialDocs,
        durationMinutes: c.durationMinutes,
        topicSlugs: [...c.topicSlugs],
      }));
  }

  async listProjects(): Promise<ProjectSummary[]> {
    return demoProjects
      .filter((p) => p.status === "PUBLISHED")
      .map((p) => this.toProjectSummary(p));
  }

  async listTechnologies(): Promise<TechnologySummary[]> {
    return demoTechnologies
      .map((t) => ({ ...t }))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }

  async listLegends(): Promise<LegendSummary[]> {
    return demoLegends
      .filter((l) => l.status === "PUBLISHED")
      .map((l) => ({
        slug: l.slug,
        name: l.name,
        bornYear: l.bornYear,
        diedYear: l.diedYear,
        summary: l.summary,
        contributions: [...l.contributions],
        imagePath: l.imagePath,
      }));
  }

  async getLegendBySlug(slug: string): Promise<LegendDetail | null> {
    const legend = demoLegends.find((l) => l.status === "PUBLISHED" && l.slug === slug);
    if (!legend) return null;
    return {
      slug: legend.slug,
      name: legend.name,
      bornYear: legend.bornYear,
      diedYear: legend.diedYear,
      summary: legend.summary,
      biography: legend.biography,
      contributions: [...legend.contributions],
      imagePath: legend.imagePath,
    };
  }
}
