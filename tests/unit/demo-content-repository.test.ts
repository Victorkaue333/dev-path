import { describe, expect, it } from "vitest";

import { demoCareers } from "@/features/careers/demo-data";
import { demoCourses } from "@/features/courses/demo-data";
import { demoLegends } from "@/features/legends/demo-data";
import { demoTechnologies } from "@/features/market/demo-data";
import { demoProjects } from "@/features/projects/demo-data";
import { demoRoadmaps } from "@/features/roadmaps/demo-data";
import { findDuplicateSlugs, isValidSlug } from "@/lib/slug";
import { DemoContentRepository } from "@/server/repositories/demo-content-repository";

const repo = new DemoContentRepository();

describe("conteúdo demonstrativo: integridade", () => {
  it("slugs são válidos e únicos em cada coleção", () => {
    for (const collection of [
      demoCareers,
      demoRoadmaps,
      demoCourses,
      demoProjects,
      demoTechnologies,
      demoLegends,
    ]) {
      expect(findDuplicateSlugs(collection)).toEqual([]);
      for (const item of collection) expect(isValidSlug(item.slug), item.slug).toBe(true);
    }
  });

  it("referências cruzadas apontam para registros existentes", () => {
    const careerSlugs = new Set(demoCareers.map((c) => c.slug));
    const techSlugs = new Set(demoTechnologies.map((t) => t.slug));
    const topicSlugs = new Set(
      demoRoadmaps.flatMap((r) => r.steps.flatMap((s) => s.topics.map((t) => t.slug))),
    );

    for (const roadmap of demoRoadmaps)
      expect(careerSlugs.has(roadmap.careerSlug), roadmap.slug).toBe(true);
    for (const career of demoCareers)
      for (const t of career.technologies) expect(techSlugs.has(t.slug), t.slug).toBe(true);
    for (const project of demoProjects) {
      if (project.careerSlug) expect(careerSlugs.has(project.careerSlug), project.slug).toBe(true);
      for (const slug of project.technologySlugs) expect(techSlugs.has(slug), slug).toBe(true);
    }
    for (const course of demoCourses)
      for (const slug of course.topicSlugs) expect(topicSlugs.has(slug), slug).toBe(true);
  });

  it("etapas de cada roadmap têm ordem única e sequencial", () => {
    for (const roadmap of demoRoadmaps) {
      const orders = roadmap.steps.map((s) => s.order).sort((a, b) => a - b);
      expect(orders).toEqual(orders.map((_, i) => i + 1));
    }
  });
});

describe("DemoContentRepository", () => {
  it("expõe apenas itens publicados", async () => {
    const careers = await repo.listCareers();
    expect(careers.map((c) => c.slug)).not.toContain("seguranca-da-informacao");
    expect(careers.length).toBe(demoCareers.filter((c) => c.status === "PUBLISHED").length);

    const roadmaps = await repo.listRoadmaps();
    expect(
      roadmaps.every((r) => demoRoadmaps.find((d) => d.slug === r.slug)?.status === "PUBLISHED"),
    ).toBe(true);

    expect(await repo.getCareerBySlug("seguranca-da-informacao")).toBeNull();
    expect(await repo.getRoadmapBySlug("analise-de-dados-com-sql-e-python")).toBeNull();
  });

  it("monta o detalhe da carreira com roadmaps, tecnologias e projetos publicados", async () => {
    const career = await repo.getCareerBySlug("desenvolvimento-front-end");
    expect(career).not.toBeNull();
    expect(career?.roadmaps.map((r) => r.slug)).toEqual(["fundamentos-do-front-end"]);
    expect(career?.technologies[0]?.slug).toBe("html");
    expect(career?.projects.every((p) => p.careerSlug === "desenvolvimento-front-end")).toBe(true);
  });

  it("retorna etapas ordenadas com tópicos", async () => {
    const roadmap = await repo.getRoadmapBySlug("fundamentos-do-front-end");
    expect(roadmap?.steps.map((s) => s.order)).toEqual([1, 2, 3, 4, 5]);
    expect(roadmap?.steps[0]?.topics.length).toBeGreaterThan(0);
  });
});
