import type { Metadata } from "next";
import { Suspense } from "react";

import { PaperCard } from "@/components/design-system/paper-card";
import { SectionHeading } from "@/components/design-system/section-heading";
import { EmptyState } from "@/components/feedback/empty-state";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { buildPageMetadata } from "@/lib/seo";
import { listProjects } from "@/server/services/content-service";
import { skillLevelLabel } from "@/types/content";

export const metadata: Metadata = buildPageMetadata({
  title: "Projetos práticos",
  description: "Ideias de projetos por nível para praticar o que você aprendeu e montar portfólio.",
  path: "/projetos",
});

export default function ProjectsPage() {
  return (
    <div className="dp-container dp-section">
      <SectionHeading
        as="h1"
        eyebrow="Projetos"
        title="Aprender fazendo"
        description="Projetos por nível, com critérios claros de conclusão. Páginas de detalhe chegam na próxima onda."
      />
      <Suspense fallback={<Skeleton className="h-64 w-full rounded-lg" />}>
        <ProjectsList />
      </Suspense>
    </div>
  );
}

async function ProjectsList() {
  const projects = await listProjects();
  if (projects.length === 0) return <EmptyState title="Nenhum projeto publicado" />;
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <li key={project.slug}>
          <PaperCard as="article" textured className="flex h-full flex-col p-5">
            <Badge variant="outline">{skillLevelLabel[project.level]}</Badge>
            <h2 className="mt-3 text-lg font-bold">{project.title}</h2>
            <p className="mt-1 flex-1 text-sm text-dp-ink-soft">{project.description}</p>
            {project.technologySlugs.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tecnologias">
                {project.technologySlugs.map((slug) => (
                  <li key={slug}>
                    <Badge variant="secondary" className="font-mono text-[11px]">
                      {slug}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </PaperCard>
        </li>
      ))}
    </ul>
  );
}
