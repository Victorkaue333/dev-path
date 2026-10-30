import Link from "next/link";
import { Suspense } from "react";

import { CharacterSticker } from "@/components/design-system/character-sticker";
import { SectionHeading } from "@/components/design-system/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroCareers, HeroCareersSkeleton } from "@/features/home/components/hero-careers";
import { Hero } from "@/features/home/components/hero";
import { getHomeHighlights } from "@/server/services/content-service";

/**
 * PÁGINA INICIAL — base de desenvolvimento.
 * Hero de tela inteira (estilo colagem) + destaques. Seções editoriais seguintes: docs/milestones.
 */
export default function HomePage() {
  return (
    <>
      <Hero
        careers={
          <Suspense fallback={<HeroCareersSkeleton />}>
            <HeroCareers />
          </Suspense>
        }
      />

      <section className="border-y border-dp-paper-line bg-dp-paper-strong/60">
        <div className="dp-container dp-section">
          <SectionHeading
            eyebrow="Lendas da TI"
            title="Pessoas que construíram a computação"
            description="Histórias reais de quem abriu caminho — sem elas, nada disso existiria."
            marker
          />
          <Suspense fallback={<LegendsSkeleton />}>
            <HomeLegends />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function HomeLegends() {
  const { legends } = await getHomeHighlights();
  return (
    <ul className="flex flex-wrap justify-center gap-8">
      {legends.map((legend, index) => (
        <li key={legend.slug}>
          <Link
            href={`/lendas-da-ti/${legend.slug}`}
            className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <CharacterSticker
              name={legend.name}
              imageSrc={legend.imagePath}
              tilt={index % 2 === 0 ? "left" : "right"}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function LegendsSkeleton() {
  return (
    <div
      className="flex flex-wrap justify-center gap-8"
      aria-busy="true"
      aria-label="Carregando lendas"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="size-40 rounded-full" />
      ))}
    </div>
  );
}
