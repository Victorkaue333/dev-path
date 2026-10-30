import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { PaperCard } from "@/components/design-system/paper-card";
import { SectionHeading } from "@/components/design-system/section-heading";
import { EmptyState } from "@/components/feedback/empty-state";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackedLink } from "@/features/analytics/components/tracked-link";
import { buildPageMetadata } from "@/lib/seo";
import { listCourses } from "@/server/services/content-service";
import { skillLevelLabel } from "@/types/content";

export const metadata: Metadata = buildPageMetadata({
  title: "Cursos gratuitos e documentação oficial",
  description:
    "Seleção de cursos gratuitos, documentações oficiais e plataformas para aprender sem pagar nada.",
  path: "/cursos",
});

export default function CoursesPage() {
  return (
    <div className="dp-container dp-section">
      <SectionHeading
        as="h1"
        eyebrow="Cursos"
        title="Cursos gratuitos e documentação oficial"
        description="Tudo listado aqui é gratuito. Filtros por carreira, nível e idioma chegam na próxima onda."
      />
      <Suspense fallback={<Skeleton className="h-64 w-full rounded-lg" />}>
        <CoursesList />
      </Suspense>
    </div>
  );
}

async function CoursesList() {
  const courses = await listCourses();
  if (courses.length === 0) return <EmptyState title="Nenhum curso publicado" />;
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {courses.map((course) => (
        <li key={course.slug}>
          <PaperCard as="article" interactive className="flex h-full flex-col p-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{skillLevelLabel[course.level]}</Badge>
              <Badge variant="secondary">
                {course.language === "pt-BR" ? "Português" : "Inglês"}
              </Badge>
              {course.isOfficialDocs ? (
                <Badge className="bg-dp-green-soft text-dp-ink">Documentação oficial</Badge>
              ) : null}
            </div>
            <h2 className="mt-3 text-lg font-bold">
              <TrackedLink
                href={course.url}
                eventType="COURSE_CLICK"
                targetSlug={course.slug}
                className="inline-flex items-center gap-1 after:absolute after:inset-0 focus-visible:outline-none"
              >
                {course.title}
                <ExternalLink className="size-4 text-dp-ink-soft" aria-hidden="true" />
                <span className="sr-only">(abre em nova aba)</span>
              </TrackedLink>
            </h2>
            <p className="mt-1 flex-1 text-sm text-dp-ink-soft">{course.description}</p>
            <p className="mt-3 text-xs text-dp-ink-soft">{course.provider}</p>
          </PaperCard>
        </li>
      ))}
    </ul>
  );
}
