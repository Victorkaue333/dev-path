import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { CharacterSticker } from "@/components/design-system/character-sticker";
import { PaperCard } from "@/components/design-system/paper-card";
import { SectionHeading } from "@/components/design-system/section-heading";
import { EmptyState } from "@/components/feedback/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { buildPageMetadata } from "@/lib/seo";
import { listLegends } from "@/server/services/content-service";

export const metadata: Metadata = buildPageMetadata({
  title: "Lendas da TI",
  description: "Figuras importantes da história da computação e suas contribuições.",
  path: "/lendas-da-ti",
});

function lifespan(born?: number, died?: number) {
  if (!born) return null;
  return died ? `${born}–${died}` : `${born}–`;
}

export default function LegendsPage() {
  return (
    <div className="dp-container dp-section">
      <SectionHeading
        as="h1"
        eyebrow="Lendas da TI"
        title="Quem construiu a computação"
        description="Pessoas cujas ideias e trabalho moldaram a tecnologia que usamos hoje."
        marker
      />
      <Suspense fallback={<Skeleton className="h-64 w-full rounded-lg" />}>
        <LegendsList />
      </Suspense>
    </div>
  );
}

async function LegendsList() {
  const legends = await listLegends();
  if (legends.length === 0) return <EmptyState title="Nenhuma figura publicada" />;
  return (
    <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {legends.map((legend, index) => (
        <li key={legend.slug}>
          <PaperCard
            as="article"
            interactive
            className="flex h-full flex-col items-center p-6 text-center"
          >
            <CharacterSticker
              name={legend.name}
              imageSrc={legend.imagePath}
              size="sm"
              tilt={index % 2 ? "right" : "left"}
              caption={lifespan(legend.bornYear, legend.diedYear) ?? legend.name}
            />
            <h2 className="mt-4 text-lg font-bold">
              <Link
                href={`/lendas-da-ti/${legend.slug}`}
                className="after:absolute after:inset-0 focus-visible:outline-none"
              >
                {legend.name}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-dp-ink-soft">{legend.summary}</p>
          </PaperCard>
        </li>
      ))}
    </ul>
  );
}
