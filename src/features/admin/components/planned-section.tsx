import { Hammer } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";

interface PlannedSectionProps {
  /** Nome do recurso (ex.: "Edição de carreiras"). */
  feature: string;
  /** Referência de documentação (ex.: "docs/milestones/M1-...md"). */
  reference?: string;
}

/** Estado padrão para áreas do painel ainda não implementadas. Nunca mostra dados fictícios. */
export function PlannedSection({ feature, reference }: PlannedSectionProps) {
  return (
    <EmptyState
      icon={Hammer}
      title={`${feature}: planejado`}
      description={
        reference
          ? `Esta área ainda não foi implementada. Escopo e critérios em ${reference}.`
          : "Esta área ainda não foi implementada."
      }
    />
  );
}
