import { Badge } from "@/components/ui/badge";
import type { RoadmapStepItem } from "@/types/content";

interface RoadmapStepProps {
  step: RoadmapStepItem;
  isLast?: boolean;
}

/**
 * Etapa de roadmap em linha do tempo vertical: número em círculo, título, descrição e tópicos.
 * Sem estado de progresso: o DevPath não persiste progresso por visitante (regra de produto).
 */
export function RoadmapStep({ step, isLast = false }: RoadmapStepProps) {
  return (
    <li className="relative flex gap-5">
      <div className="flex flex-col items-center">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-dp-green bg-dp-green-soft font-marker text-lg text-dp-ink shadow-sticky"
        >
          {step.order}
        </span>
        {!isLast ? (
          <span
            aria-hidden="true"
            className="mt-1 w-0.5 flex-1 border-l-2 border-dashed border-dp-green/50"
          />
        ) : null}
      </div>
      <div className="pb-10">
        <h3 className="text-lg font-bold text-dp-ink">
          <span className="sr-only">Etapa {step.order}: </span>
          {step.title}
        </h3>
        <p className="mt-1 text-sm text-dp-ink-soft">{step.description}</p>
        {step.topics.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label={`Tópicos da etapa ${step.order}`}>
            {step.topics.map((topic) => (
              <li key={topic.slug}>
                <Badge variant="secondary">{topic.title}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}
