/**
 * SEED DE DESENVOLVIMENTO — nunca roda automaticamente em produção.
 *
 * O que faz:
 *  1. (Opcional) cria um administrador a partir de SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD.
 *  2. (Opcional, SEED_DEMO_CONTENT=true) popula o conteúdo demonstrativo lendo EXATAMENTE
 *     os mesmos módulos usados pelo site em modo demo (src/features/*\/demo-data.ts).
 *     Isso garante uma única fonte para o conteúdo de demonstração.
 *
 * Execução: `pnpm db:seed` (exige DATABASE_URL e migrations aplicadas).
 * Documentação: docs/DATABASE.md (seção Seeds).
 */
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

import { demoCareers } from "../src/features/careers/demo-data";
import { demoCourses } from "../src/features/courses/demo-data";
import { demoLegends } from "../src/features/legends/demo-data";
import { demoTechnologies } from "../src/features/market/demo-data";
import { demoProjects } from "../src/features/projects/demo-data";
import { demoRoadmaps } from "../src/features/roadmaps/demo-data";
import { PrismaClient } from "../src/generated/prisma/client";

const BCRYPT_ROUNDS = 12;

function requireNonProduction() {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Seed bloqueado: NODE_ENV=production. Este script é apenas para desenvolvimento.",
    );
  }
}

function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida. Veja docs/ENVIRONMENT.md.");
  return url;
}

async function seedAdmin(db: PrismaClient) {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    console.log(
      "[seed] SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD ausentes: nenhum administrador criado.",
    );
    return;
  }
  if (password.length < 12) {
    throw new Error("[seed] SEED_ADMIN_PASSWORD precisa ter pelo menos 12 caracteres.");
  }
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  await db.adminUser.upsert({
    where: { email },
    update: { passwordHash, isActive: true },
    create: { email, name: "Administrador", passwordHash, role: "OWNER" },
  });
  console.log(`[seed] administrador garantido: ${email}`);
}

async function seedDemoContent(db: PrismaClient) {
  if (process.env.SEED_DEMO_CONTENT !== "true") {
    console.log("[seed] SEED_DEMO_CONTENT != true: conteúdo demonstrativo não inserido.");
    return;
  }

  const publishedAt = (status: string) => (status === "PUBLISHED" ? new Date() : null);

  for (const tech of demoTechnologies) {
    await db.technology.upsert({
      where: { slug: tech.slug },
      update: {
        name: tech.name,
        category: tech.category,
        description: tech.description,
        website: tech.website,
      },
      create: {
        slug: tech.slug,
        name: tech.name,
        category: tech.category,
        description: tech.description,
        website: tech.website,
      },
    });
  }

  for (const career of demoCareers) {
    const record = await db.career.upsert({
      where: { slug: career.slug },
      update: {
        title: career.title,
        shortTitle: career.shortTitle,
        tagline: career.tagline,
        shortDescription: career.shortDescription,
        description: career.description,
        icon: career.icon,
        accent: career.accent,
        order: career.order,
        status: career.status,
        publishedAt: publishedAt(career.status),
      },
      create: {
        slug: career.slug,
        title: career.title,
        shortTitle: career.shortTitle,
        tagline: career.tagline,
        shortDescription: career.shortDescription,
        description: career.description,
        icon: career.icon,
        accent: career.accent,
        order: career.order,
        status: career.status,
        publishedAt: publishedAt(career.status),
      },
    });
    for (const link of career.technologies) {
      const tech = await db.technology.findUniqueOrThrow({ where: { slug: link.slug } });
      await db.careerTechnology.upsert({
        where: { careerId_technologyId: { careerId: record.id, technologyId: tech.id } },
        update: { importance: link.importance },
        create: { careerId: record.id, technologyId: tech.id, importance: link.importance },
      });
    }
  }

  for (const roadmap of demoRoadmaps) {
    const career = await db.career.findUniqueOrThrow({ where: { slug: roadmap.careerSlug } });
    const record = await db.roadmap.upsert({
      where: { slug: roadmap.slug },
      update: {
        title: roadmap.title,
        description: roadmap.description,
        level: roadmap.level,
        order: roadmap.order,
        status: roadmap.status,
        publishedAt: publishedAt(roadmap.status),
        careerId: career.id,
      },
      create: {
        slug: roadmap.slug,
        title: roadmap.title,
        description: roadmap.description,
        level: roadmap.level,
        order: roadmap.order,
        status: roadmap.status,
        publishedAt: publishedAt(roadmap.status),
        careerId: career.id,
      },
    });
    for (const step of roadmap.steps) {
      const stepRecord = await db.roadmapStep.upsert({
        where: { roadmapId_order: { roadmapId: record.id, order: step.order } },
        update: { title: step.title, description: step.description },
        create: {
          roadmapId: record.id,
          order: step.order,
          title: step.title,
          description: step.description,
        },
      });
      for (const [index, topic] of step.topics.entries()) {
        const topicRecord = await db.topic.upsert({
          where: { slug: topic.slug },
          update: { title: topic.title, description: topic.description },
          create: { slug: topic.slug, title: topic.title, description: topic.description },
        });
        await db.roadmapStepTopic.upsert({
          where: { stepId_topicId: { stepId: stepRecord.id, topicId: topicRecord.id } },
          update: { order: index },
          create: { stepId: stepRecord.id, topicId: topicRecord.id, order: index },
        });
      }
    }
  }

  for (const course of demoCourses) {
    const record = await db.course.upsert({
      where: { slug: course.slug },
      update: {
        title: course.title,
        description: course.description,
        provider: course.provider,
        url: course.url,
        language: course.language,
        level: course.level,
        isFree: course.isFree,
        isOfficialDocs: course.isOfficialDocs,
        durationMinutes: course.durationMinutes,
        status: course.status,
        publishedAt: publishedAt(course.status),
      },
      create: {
        slug: course.slug,
        title: course.title,
        description: course.description,
        provider: course.provider,
        url: course.url,
        language: course.language,
        level: course.level,
        isFree: course.isFree,
        isOfficialDocs: course.isOfficialDocs,
        durationMinutes: course.durationMinutes,
        status: course.status,
        publishedAt: publishedAt(course.status),
      },
    });
    for (const topicSlug of course.topicSlugs) {
      const topic = await db.topic.findUnique({ where: { slug: topicSlug } });
      if (!topic) {
        console.warn(
          `[seed] tópico "${topicSlug}" do curso "${course.slug}" não existe; ignorado.`,
        );
        continue;
      }
      await db.courseTopic.upsert({
        where: { courseId_topicId: { courseId: record.id, topicId: topic.id } },
        update: {},
        create: { courseId: record.id, topicId: topic.id },
      });
    }
  }

  for (const project of demoProjects) {
    const career = project.careerSlug
      ? await db.career.findUnique({ where: { slug: project.careerSlug } })
      : null;
    const record = await db.project.upsert({
      where: { slug: project.slug },
      update: {
        title: project.title,
        description: project.description,
        level: project.level,
        estimatedHours: project.estimatedHours,
        acceptance: project.acceptance,
        status: project.status,
        publishedAt: publishedAt(project.status),
        careerId: career?.id ?? null,
      },
      create: {
        slug: project.slug,
        title: project.title,
        description: project.description,
        level: project.level,
        estimatedHours: project.estimatedHours,
        acceptance: project.acceptance,
        status: project.status,
        publishedAt: publishedAt(project.status),
        careerId: career?.id ?? null,
      },
    });
    for (const techSlug of project.technologySlugs) {
      const tech = await db.technology.findUnique({ where: { slug: techSlug } });
      if (!tech) continue;
      await db.projectTechnology.upsert({
        where: { projectId_technologyId: { projectId: record.id, technologyId: tech.id } },
        update: {},
        create: { projectId: record.id, technologyId: tech.id },
      });
    }
  }

  for (const legend of demoLegends) {
    await db.historicalFigure.upsert({
      where: { slug: legend.slug },
      update: {
        name: legend.name,
        bornYear: legend.bornYear,
        diedYear: legend.diedYear,
        summary: legend.summary,
        biography: legend.biography,
        contributions: legend.contributions,
        imagePath: legend.imagePath,
        status: legend.status,
        publishedAt: publishedAt(legend.status),
      },
      create: {
        slug: legend.slug,
        name: legend.name,
        bornYear: legend.bornYear,
        diedYear: legend.diedYear,
        summary: legend.summary,
        biography: legend.biography,
        contributions: legend.contributions,
        imagePath: legend.imagePath,
        status: legend.status,
        publishedAt: publishedAt(legend.status),
      },
    });
  }

  console.log("[seed] conteúdo demonstrativo inserido/atualizado.");
}

async function main() {
  requireNonProduction();
  const adapter = new PrismaPg({ connectionString: requireDatabaseUrl() });
  const db = new PrismaClient({ adapter });
  try {
    await seedAdmin(db);
    await seedDemoContent(db);
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error("[seed] falhou:", error);
  process.exitCode = 1;
});
