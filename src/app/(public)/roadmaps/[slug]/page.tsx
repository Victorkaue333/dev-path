import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { SectionHeading } from "@/components/design-system/section-heading";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RoadmapStep } from "@/features/roadmaps/components/roadmap-step";
import { buildPageMetadata } from "@/lib/seo";
import { getRoadmap, listRoadmaps } from "@/server/services/content-service";
import { skillLevelLabel } from "@/types/content";

export async function generateStaticParams() {
  const roadmaps = await listRoadmaps();
  return roadmaps.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/roadmaps/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = await getRoadmap(slug);
  if (!roadmap) return { title: "Roadmap não encontrado" };
  return buildPageMetadata({
    title: `Roadmap: ${roadmap.title}`,
    description: roadmap.description,
    path: `/roadmaps/${roadmap.slug}`,
  });
}

export default function RoadmapPage({ params }: PageProps<"/roadmaps/[slug]">) {
  return (
    <div className="dp-container dp-section">
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
        <RoadmapContent params={params} />
      </Suspense>
    </div>
  );
}

async function RoadmapContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const roadmap = await getRoadmap(slug);
  if (!roadmap) notFound();

  return (
    <article>
      <SectionHeading
        as="h1"
        eyebrow="Roadmap"
        title={roadmap.title}
        description={roadmap.description}
      />
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm">
        <Badge variant="secondary">
          <Link href={`/carreiras/${roadmap.careerSlug}`}>{roadmap.careerTitle}</Link>
        </Badge>
        <Badge variant="outline">{skillLevelLabel[roadmap.level]}</Badge>
        <span className="text-dp-ink-soft">{roadmap.stepCount} etapas</span>
      </div>
      <ol className="max-w-3xl" aria-label="Etapas do roadmap">
        {roadmap.steps.map((step, index) => (
          <RoadmapStep key={step.order} step={step} isLast={index === roadmap.steps.length - 1} />
        ))}
      </ol>
    </article>
  );
}
