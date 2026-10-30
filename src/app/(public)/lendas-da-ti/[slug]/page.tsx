import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CharacterSticker } from "@/components/design-system/character-sticker";
import { PaperCard } from "@/components/design-system/paper-card";
import { SectionHeading } from "@/components/design-system/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { buildPageMetadata } from "@/lib/seo";
import { getLegend, listLegends } from "@/server/services/content-service";

export async function generateStaticParams() {
  const legends = await listLegends();
  return legends.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/lendas-da-ti/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const legend = await getLegend(slug);
  if (!legend) return { title: "Figura não encontrada" };
  return buildPageMetadata({
    title: legend.name,
    description: legend.summary,
    path: `/lendas-da-ti/${legend.slug}`,
  });
}

export default function LegendPage({ params }: PageProps<"/lendas-da-ti/[slug]">) {
  return (
    <div className="dp-container dp-section">
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
        <LegendContent params={params} />
      </Suspense>
    </div>
  );
}

async function LegendContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const legend = await getLegend(slug);
  if (!legend) notFound();

  const years = legend.bornYear ? `${legend.bornYear}–${legend.diedYear ?? ""}` : undefined;

  return (
    <article className="grid gap-10 lg:grid-cols-[1fr_2fr]">
      <div className="flex justify-center lg:justify-start">
        <CharacterSticker
          name={legend.name}
          imageSrc={legend.imagePath}
          size="lg"
          caption={years ?? legend.name}
        />
      </div>
      <div>
        <SectionHeading
          as="h1"
          eyebrow="Lendas da TI"
          title={legend.name}
          description={legend.summary}
          marker
        />
        <PaperCard textured className="p-6">
          <p className="leading-relaxed text-pretty text-dp-ink">{legend.biography}</p>
        </PaperCard>
        <h2 className="mt-8 mb-3 text-lg font-bold">Contribuições</h2>
        <ul className="list-disc space-y-1 pl-5 text-dp-ink-soft">
          {legend.contributions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
