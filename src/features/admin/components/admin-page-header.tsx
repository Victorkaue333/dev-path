import type { ReactNode } from "react";

import { type FeatureStatus, StatusBadge } from "@/components/feedback/status-badge";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  status?: FeatureStatus;
  actions?: ReactNode;
}

/** Cabeçalho padrão das páginas do painel, com etiqueta de estado da funcionalidade. */
export function AdminPageHeader({ title, description, status, actions }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-dp-ink">{title}</h1>
          {status ? <StatusBadge status={status} /> : null}
        </div>
        {description ? <p className="mt-1 text-sm text-dp-ink-soft">{description}</p> : null}
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
