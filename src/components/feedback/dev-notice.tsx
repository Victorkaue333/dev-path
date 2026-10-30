import { Construction } from "lucide-react";

import type { ContentSource } from "@/types/content";

/**
 * Aviso fixo de que esta é uma base de desenvolvimento. Removido quando o site
 * tiver conteúdo editorial real e fonte `database` (docs/milestones/MILESTONES.md).
 */
export function DevNotice({ source }: { source: ContentSource }) {
  return (
    <div role="status" className="border-b border-dp-yellow/60 bg-dp-yellow-soft text-dp-ink">
      <div className="dp-container flex items-center gap-2 py-2 text-xs sm:text-sm">
        <Construction className="size-4 shrink-0 text-dp-ink-soft" aria-hidden="true" />
        <p>
          <strong>Base de desenvolvimento.</strong>{" "}
          {source === "demo"
            ? "O conteúdo exibido é demonstrativo e serve apenas para validar a estrutura."
            : "Conteúdo carregado do banco de dados; interface ainda em construção."}
        </p>
      </div>
    </div>
  );
}
