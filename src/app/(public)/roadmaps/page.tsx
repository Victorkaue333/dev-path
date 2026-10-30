import type { Metadata } from "next";
import { Suspense } from "react";

import { PaperCard } from "@/components/design-system/paper-card";
import { SectionHeading } from "@/components/design-system/section-heading";
import { EmptyState } from "@/components/feedback/empty-state";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackedLink } from "@/features/analytics/components/tracked-link";
import { buildPageMetadata } from "@/lib/seo";
import { listRoadmaps } from "@/server/services/content-service";
import { skillLevelLabel } from "@/types/content";

export const metadata: Metadata = buildPageMetadata({
  title: "Roadmaps de aprendizado",
  description: "Caminhos passo a passo por carreira, com etapas, tópicos e recursos gratuitos.",
  path: "/roadmaps",
});

export default function RoadmapsPage() {
  return (
    <div className="dp-container dp-section">
      <SectionHeading
        as="h1"
        eyebrow="Roadmaps"
        title="Caminhos passo a passo"
        description="Escolha uma carreira, siga as etapas e use os cursos e projetos indicados em cada uma."
        marker
      />
      <Suspense fallback={<Skeleton className="h-64 w-full rounded-lg" />}>
        <RoadmapsList />
      </Suspense>
    </div>
  );
}

async function RoadmapsList() {
  const roadmaps = await listRoadmaps();
  if (roadmaps.length === 0) {
    return <EmptyState title="Nenhum roadmap publicado" />;
  }
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {roadmaps.map((roadmap) => (
        <li key={roadmap.slug}>
          <PaperCard as="article" interactive textured className="h-full p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{roadmap.careerTitle}</Badge>
              <Badge variant="outline">{skillLevelLabel[roadmap.level]}</Badge>
              <span className="text-xs text-dp-ink-soft">{roadmap.stepCount} etapas</span>
            </div>
            <h2 className="mt-3 text-xl font-bold">
              <TrackedLink
                href={`/roadmaps/${roadmap.slug}`}
                eventType="ROADMAP_CLICK"
                targetSlug={roadmap.slug}
                className="after:absolute after:inset-0 focus-visible:outline-none"
              >
                {roadmap.title}
              </TrackedLink>
            </h2>
            <p className="mt-2 text-sm text-dp-ink-soft">{roadmap.description}</p>
          </PaperCard>
        </li>
      ))}
    </ul>
  );
}
