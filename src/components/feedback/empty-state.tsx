import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}

/** Estado vazio padrão (listas sem itens publicados, painéis sem dados). */
export function EmptyState({ title, description, icon: Icon = Inbox, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-dp-paper-line bg-white/60 px-6 py-12 text-center">
      <Icon className="mb-3 size-8 text-dp-ink-soft/60" aria-hidden="true" />
      <h3 className="text-base font-semibold text-dp-ink">{title}</h3>
      {description ? <p className="mt-1 max-w-md text-sm text-dp-ink-soft">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
