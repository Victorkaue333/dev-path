import type { Metadata } from "next";
import { Suspense } from "react";

import { SectionHeading } from "@/components/design-system/section-heading";
import { StickyNote } from "@/components/design-system/sticky-note";
import { EmptyState } from "@/components/feedback/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { buildPageMetadata } from "@/lib/seo";
import { listTechnologies } from "@/server/services/content-service";
import {
  technologyCategoryLabel,
  type TechnologyCategory,
  type TechnologySummary,
} from "@/types/content";

export const metadata: Metadata = buildPageMetadata({
  title: "Mercado: tecnologias e habilidades",
  description:
    "Tecnologias e habilidades pedidas pelo mercado de tecnologia, organizadas por categoria.",
  path: "/mercado",
});

export default function MarketPage() {
  return (
    <div className="dp-container dp-section">
      <SectionHeading
        as="h1"
        eyebrow="Mercado"
        title="O que o mercado pede"
        description="Catálogo de tecnologias e habilidades por categoria. Dados de vagas e salários só entram com fonte e data citadas."
      />
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <Suspense fallback={<Skeleton className="h-64 w-full rounded-lg" />}>
          <TechnologyCatalog />
        </Suspense>
        <StickyNote tilt="right" color="yellow" className="justify-self-center lg:justify-self-end">
          Nenhuma estatística de mercado será exibida sem fonte verificável.
        </StickyNote>
      </div>
    </div>
  );
}

async function TechnologyCatalog() {
  const technologies = await listTechnologies();
  if (technologies.length === 0) return <EmptyState title="Catálogo vazio" />;

  const groups = new Map<TechnologyCategory, TechnologySummary[]>();
  for (const tech of technologies) {
    const list = groups.get(tech.category) ?? [];
    list.push(tech);
    groups.set(tech.category, list);
  }

  return (
    <div className="space-y-8">
      {[...groups.entries()].map(([category, items]) => (
        <section key={category} aria-labelledby={`cat-${category}`}>
          <h2 id={`cat-${category}`} className="mb-3 text-lg font-bold">
            {technologyCategoryLabel[category]}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {items.map((tech) => (
              <li key={tech.slug}>
                {tech.website ? (
                  <a
                    href={tech.website}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="inline-flex rounded-md border border-dp-paper-line bg-white px-3 py-1.5 text-sm font-medium shadow-paper hover:border-dp-green"
                  >
                    {tech.name}
                  </a>
                ) : (
                  <span className="inline-flex rounded-md border border-dp-paper-line bg-white px-3 py-1.5 text-sm font-medium shadow-paper">
                    {tech.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
