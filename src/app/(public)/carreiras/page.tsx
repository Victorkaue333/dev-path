import type { Metadata } from "next";
import { Suspense } from "react";

import { SectionHeading } from "@/components/design-system/section-heading";
import { EmptyState } from "@/components/feedback/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { CareerCard } from "@/features/careers/components/career-card";
import { buildPageMetadata } from "@/lib/seo";
import { listCareers } from "@/server/services/content-service";

export const metadata: Metadata = buildPageMetadata({
  title: "Carreiras em tecnologia",
  description:
    "Conheça as áreas para começar em tecnologia e escolha o roadmap que combina com você.",
  path: "/carreiras",
});

export default function CareersPage() {
  return (
    <div className="dp-container dp-section">
      <SectionHeading
        as="h1"
        eyebrow="Carreiras"
        title="Áreas para começar em tecnologia"
        description="Cada área tem um caminho próprio. Explore, compare e siga o roadmap da carreira escolhida."
      />
      <Suspense fallback={<Skeleton className="h-64 w-full rounded-lg" />}>
        <CareersList />
      </Suspense>
    </div>
  );
}

async function CareersList() {
  const careers = await listCareers();
  if (careers.length === 0) {
    return <EmptyState title="Nenhuma carreira publicada" description="Conteúdo em preparação." />;
  }
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {careers.map((career) => (
        <li key={career.slug} className="group">
          <CareerCard career={career} />
        </li>
      ))}
    </ul>
  );
}
