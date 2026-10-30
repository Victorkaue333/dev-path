import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PaperCard } from "@/components/design-system/paper-card";
import { SectionHeading } from "@/components/design-system/section-heading";
import { EmptyState } from "@/components/feedback/empty-state";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackedLink } from "@/features/analytics/components/tracked-link";
import { buildPageMetadata } from "@/lib/seo";
import { getCareer, listCareers } from "@/server/services/content-service";
import { skillLevelLabel, technologyCategoryLabel } from "@/types/content";

export async function generateStaticParams() {
  const careers = await listCareers();
  return careers.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/carreiras/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const career = await getCareer(slug);
  if (!career) return { title: "Carreira não encontrada" };
  return buildPageMetadata({
    title: career.title,
    description: career.shortDescription,
    path: `/carreiras/${career.slug}`,
  });
}

export default function CareerPage({ params }: PageProps<"/carreiras/[slug]">) {
  return (
    <div className="dp-container dp-section">
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
        <CareerContent params={params} />
      </Suspense>
    </div>
  );
}

async function CareerContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const career = await getCareer(slug);
  if (!career) notFound();

  return (
    <article>
      <SectionHeading
        as="h1"
        eyebrow="Carreira"
        title={career.title}
        description={career.description}
      />

      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-10">
          <section aria-labelledby="roadmaps-heading">
            <h2 id="roadmaps-heading" className="mb-4 text-xl font-bold">
              Roadmaps
            </h2>
            {career.roadmaps.length === 0 ? (
              <EmptyState
                title="Roadmap em preparação"
                description="Esta carreira ainda não tem roadmap publicado."
              />
            ) : (
              <ul className="grid gap-4">
                {career.roadmaps.map((roadmap) => (
                  <li key={roadmap.slug}>
                    <PaperCard as="div" interactive className="p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{skillLevelLabel[roadmap.level]}</Badge>
                        <span className="text-xs text-dp-ink-soft">{roadmap.stepCount} etapas</span>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold">
                        <TrackedLink
                          href={`/roadmaps/${roadmap.slug}`}
                          eventType="ROADMAP_CLICK"
                          targetSlug={roadmap.slug}
                          className="after:absolute after:inset-0 focus-visible:outline-none"
                        >
                          {roadmap.title}
                        </TrackedLink>
                      </h3>
                      <p className="mt-1 text-sm text-dp-ink-soft">{roadmap.description}</p>
                    </PaperCard>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="projetos-heading">
            <h2 id="projetos-heading" className="mb-4 text-xl font-bold">
              Projetos práticos
            </h2>
            {career.projects.length === 0 ? (
              <EmptyState title="Sem projetos publicados" />
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {career.projects.map((project) => (
                  <li key={project.slug}>
                    <PaperCard className="h-full p-5">
                      <Badge variant="outline">{skillLevelLabel[project.level]}</Badge>
                      <h3 className="mt-2 font-semibold">{project.title}</h3>
                      <p className="mt-1 text-sm text-dp-ink-soft">{project.description}</p>
                    </PaperCard>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside aria-labelledby="tecnologias-heading">
          <h2 id="tecnologias-heading" className="mb-4 text-xl font-bold">
            Tecnologias essenciais
          </h2>
          <ul className="space-y-2">
            {career.technologies.map((tech) => (
              <li
                key={tech.slug}
                className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm shadow-paper"
              >
                <span className="font-medium">{tech.name}</span>
                <span className="text-xs text-dp-ink-soft">
                  {technologyCategoryLabel[tech.category]}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-dp-ink-soft">
            <Link href="/mercado" className="underline underline-offset-2 hover:text-dp-ink">
              Ver todas as tecnologias
            </Link>
          </p>
        </aside>
      </div>
    </article>
  );
}
