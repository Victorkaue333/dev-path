import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Doodle } from "./doodle";

export interface SectionHeadingProps {
  /** Pequeno rótulo acima do título (ex.: "Roadmaps"). */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Nível semântico do título. */
  as?: "h1" | "h2" | "h3";
  /** Usa a fonte marker no título (destaques expressivos). */
  marker?: boolean;
  align?: "left" | "center";
  /** Conteúdo à direita (ação, filtro). */
  actions?: ReactNode;
  className?: string;
}

/**
 * Cabeçalho de seção padronizado: eyebrow + título (+ sublinhado desenhado) + descrição.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Tag = "h2",
  marker = false,
  align = "left",
  actions,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:flex-col sm:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-dp-green-strong uppercase">
            {eyebrow}
          </p>
        ) : null}
        <Tag
          className={cn(
            "relative inline-block text-balance text-dp-ink",
            marker
              ? "font-marker text-4xl sm:text-5xl"
              : "text-3xl font-bold tracking-tight sm:text-4xl",
          )}
        >
          {title}
          <Doodle kind="underline" className="absolute -bottom-2 left-0 h-3 w-full text-dp-green" />
        </Tag>
        {description ? (
          <p className="mt-4 text-base text-pretty text-dp-ink-soft sm:text-lg">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
