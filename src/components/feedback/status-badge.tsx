import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type FeatureStatus = "implementado" | "planejado" | "pendente";

const styles: Record<FeatureStatus, string> = {
  implementado: "border-dp-green-strong/40 bg-dp-green-soft text-dp-ink",
  planejado: "border-dp-yellow/60 bg-dp-yellow-soft text-dp-ink",
  pendente: "border-dp-coral/50 bg-dp-coral-soft text-dp-ink",
};

const labels: Record<FeatureStatus, string> = {
  implementado: "Implementado",
  planejado: "Planejado",
  pendente: "Pendente",
};

/** Etiqueta de estado usada no painel e na página "Sobre" para não confundir planejado com pronto. */
export function StatusBadge({ status, className }: { status: FeatureStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn(styles[status], className)}>
      {labels[status]}
    </Badge>
  );
}
