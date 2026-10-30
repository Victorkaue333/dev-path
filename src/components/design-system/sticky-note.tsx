import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

import { Tape } from "./tape";

type Color = "yellow" | "green" | "coral" | "paper";

const colors: Record<Color, string> = {
  yellow: "bg-dp-yellow text-dp-ink",
  green: "bg-dp-green-soft text-dp-ink",
  coral: "bg-dp-coral-soft text-dp-ink",
  paper: "bg-dp-paper-strong text-dp-ink",
};

export interface StickyNoteProps extends ComponentPropsWithoutRef<"aside"> {
  color?: Color;
  tilt?: "left" | "right" | "none";
  /** Mostra fita adesiva no topo. */
  taped?: boolean;
  /** Usa a fonte marker (frases curtas). */
  marker?: boolean;
}

/**
 * Post-it para frases curtas, dicas e avisos editoriais.
 * Contrato: fundo chapado, sombra `shadow-sticky`, rotação leve, texto curto.
 */
export function StickyNote({
  color = "yellow",
  tilt = "right",
  taped = true,
  marker = true,
  className,
  children,
  ...rest
}: StickyNoteProps) {
  return (
    <aside
      className={cn(
        "relative inline-block max-w-xs p-5 shadow-sticky",
        colors[color],
        tilt === "left" && "rotate-[var(--dp-tilt-1)]",
        tilt === "right" && "rotate-[var(--dp-tilt-2)]",
        marker ? "font-marker text-lg leading-snug" : "text-sm leading-relaxed",
        className,
      )}
      {...rest}
    >
      {taped ? <Tape className="absolute -top-3 left-1/2 -translate-x-1/2" /> : null}
      {children}
    </aside>
  );
}
