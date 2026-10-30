import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/utils";

type Tilt = "none" | "left" | "right" | "subtle";

const tilts: Record<Tilt, string> = {
  none: "",
  left: "rotate-[var(--dp-tilt-1)]",
  right: "rotate-[var(--dp-tilt-2)]",
  subtle: "rotate-[var(--dp-tilt-3)]",
};

export interface PaperCardProps extends ComponentPropsWithoutRef<"div"> {
  /** Elemento raiz (article, section, li...). */
  as?: ElementType;
  /** Leve rotação para efeito de colagem. */
  tilt?: Tilt;
  /** Borda rasgada (clip-path) no topo/base. */
  torn?: boolean;
  /** Textura de papel. */
  textured?: boolean;
  /** Eleva no hover (para cards clicáveis). */
  interactive?: boolean;
}

/**
 * Cartão de papel: base visual da identidade "colagem editorial".
 * Contrato: superfície branca/papel, sombra `shadow-paper`, raio irregular, rotação opcional.
 */
export function PaperCard({
  as: Tag = "div",
  tilt = "none",
  torn = false,
  textured = false,
  interactive = false,
  className,
  children,
  ...rest
}: PaperCardProps) {
  return (
    <Tag
      className={cn(
        "relative bg-white text-dp-ink shadow-paper",
        "[border-radius:var(--dp-radius-paper)]",
        tilts[tilt],
        torn && "dp-torn-edge",
        textured && "dp-paper-texture",
        interactive &&
          "duration-base transition-[transform,box-shadow] ease-out-soft focus-within:shadow-paper-lift hover:-translate-y-0.5 hover:rotate-0 hover:shadow-paper-lift",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
