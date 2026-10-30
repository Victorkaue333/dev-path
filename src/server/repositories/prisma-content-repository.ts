import "server-only";

import { getPrismaClient } from "@/server/db/client";
import type {
  AccentToken,
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

const PUBLISHED = "PUBLISHED" as const;
const ACCENTS: ReadonlySet<string> = new Set(["green", "yellow", "coral", "ink"]);

function toAccent(value: string | null): AccentToken | undefined {
  return value && ACCENTS.has(value) ? (value as AccentToken) : undefined;
}

/**
 * Implementação com PostgreSQL via Prisma. Exige DATABASE_URL e migrations aplicadas.
 * Toda consulta filtra `status = PUBLISHED`; rascunhos e arquivados nunca chegam ao site.
 */
export class PrismaContentRepository implements ContentRepository {
  readonly source = "database" as const;

  private get db() {
    return getPrismaClient();
  }

  async listCareers(): Promise<CareerSummary[]> {
    const rows = await this.db.career.findMany({
      where: { status: PUBLISHED },
      orderBy: { order: "asc" },
      select: {
        slug: true,
        title: true,
        shortTitle: true,
        tagline: true,
        shortDescription: true,
        icon: true,
        accent: true,
        order: true,
      },
    });
    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      shortTitle: r.shortTitle ?? undefined,
      tagline: r.tagline ?? undefined,
      shortDescription: r.shortDescription,
      icon: r.icon ?? undefined,
      accent: toAccent(r.accent),
      order: r.order,
    }));
  }

  async getCareerBySlug(slug: string): Promise<CareerDetail | null> {
    const career = await this.db.career.findFirst({
      where: { slug, status: PUBLISHED },
      include: {
        roadmaps: {
          where: { status: PUBLISHED },
          orderBy: { order: "asc" },
          include: { _count: { select: { steps: true } } },
        },
        technologies: { orderBy: { importance: "asc" }, include: { technology: true } },
        projects: {
          where: { status: PUBLISHED },
          orderBy: { createdAt: "asc" },
          include: { technologies: { select: { technology: { select: { slug: true } } } } },
        },
      },
    });
    if (!career) return null;
    return {
      slug: career.slug,
      title: career.title,
      shortTitle: career.shortTitle ?? undefined,
      tagline: career.tagline ?? undefined,
      shortDescription: career.shortDescription,
      description: career.description,
      icon: career.icon ?? undefined,
      accent: toAccent(career.accent),
      order: career.order,
      roadmaps: career.roadmaps.map((r) => ({
        slug: r.slug,
        title: r.title,
        description: r.description,
        level: r.level,
        careerSlug: career.slug,
        careerTitle: career.title,
        stepCount: r._count.steps,
      })),
      technologies: career.technologies.map(({ technology }) => ({
        slug: technology.slug,
        name: technology.name,
        category: technology.category,
        description: technology.description ?? undefined,
        website: technology.website ?? undefined,
      })),
      projects: career.projects.map((p) => ({
        slug: p.slug,
        title: p.title,
        description: p.description,
        level: p.level,
        estimatedHours: p.estimatedHours ?? undefined,
        careerSlug: career.slug,
        technologySlugs: p.technologies.map((t) => t.technology.slug),
      })),
    };
  }

  async listRoadmaps(): Promise<RoadmapSummary[]> {
    const rows = await this.db.roadmap.findMany({
      where: { status: PUBLISHED, career: { status: PUBLISHED } },
      orderBy: [{ career: { order: "asc" } }, { order: "asc" }],
      include: {
        career: { select: { slug: true, title: true } },
        _count: { select: { steps: true } },
      },
    });
    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      description: r.description,
      level: r.level,
      careerSlug: r.career.slug,
      careerTitle: r.career.title,
      stepCount: r._count.steps,
    }));
  }

  async getRoadmapBySlug(slug: string): Promise<RoadmapDetail | null> {
    const roadmap = await this.db.roadmap.findFirst({
      where: { slug, status: PUBLISHED },
      include: {
        career: { select: { slug: true, title: true } },
        steps: {
          orderBy: { order: "asc" },
          include: { topics: { orderBy: { order: "asc" }, include: { topic: true } } },
        },
      },
    });
    if (!roadmap) return null;
    return {
      slug: roadmap.slug,
      title: roadmap.title,
      description: roadmap.description,
      level: roadmap.level,
      careerSlug: roadmap.career.slug,
      careerTitle: roadmap.career.title,
      stepCount: roadmap.steps.length,
      steps: roadmap.steps.map((s) => ({
        order: s.order,
        title: s.title,
        description: s.description,
        topics: s.topics.map(({ topic }) => ({
          slug: topic.slug,
          title: topic.title,
          description: topic.description ?? undefined,
        })),
      })),
    };
  }

  async listCourses(): Promise<CourseSummary[]> {
    const rows = await this.db.course.findMany({
      where: { status: PUBLISHED },
      orderBy: [{ level: "asc" }, { title: "asc" }],
      include: { topics: { select: { topic: { select: { slug: true } } } } },
    });
    return rows.map((c) => ({
      slug: c.slug,
      title: c.title,
      description: c.description,
      provider: c.provider,
      url: c.url,
      language: c.language,
      level: c.level,
      isFree: c.isFree,
      isOfficialDocs: c.isOfficialDocs,
      durationMinutes: c.durationMinutes ?? undefined,
      topicSlugs: c.topics.map((t) => t.topic.slug),
    }));
  }

  async listProjects(): Promise<ProjectSummary[]> {
    const rows = await this.db.project.findMany({
      where: { status: PUBLISHED },
      orderBy: [{ level: "asc" }, { title: "asc" }],
      include: {
        career: { select: { slug: true } },
        technologies: { select: { technology: { select: { slug: true } } } },
      },
    });
    return rows.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      level: p.level,
      estimatedHours: p.estimatedHours ?? undefined,
      careerSlug: p.career?.slug,
      technologySlugs: p.technologies.map((t) => t.technology.slug),
    }));
  }

  async listTechnologies(): Promise<TechnologySummary[]> {
    const rows = await this.db.technology.findMany({ orderBy: { name: "asc" } });
    return rows.map((t) => ({
      slug: t.slug,
      name: t.name,
      category: t.category,
      description: t.description ?? undefined,
      website: t.website ?? undefined,
    }));
  }

  async listLegends(): Promise<LegendSummary[]> {
    const rows = await this.db.historicalFigure.findMany({
      where: { status: PUBLISHED },
      orderBy: { bornYear: "asc" },
    });
    return rows.map((l) => ({
      slug: l.slug,
      name: l.name,
      bornYear: l.bornYear ?? undefined,
      diedYear: l.diedYear ?? undefined,
      summary: l.summary,
      contributions: l.contributions,
      imagePath: l.imagePath ?? undefined,
    }));
  }

  async getLegendBySlug(slug: string): Promise<LegendDetail | null> {
    const l = await this.db.historicalFigure.findFirst({ where: { slug, status: PUBLISHED } });
    if (!l) return null;
    return {
      slug: l.slug,
      name: l.name,
      bornYear: l.bornYear ?? undefined,
      diedYear: l.diedYear ?? undefined,
      summary: l.summary,
      biography: l.biography,
      contributions: l.contributions,
      imagePath: l.imagePath ?? undefined,
    };
  }
}
