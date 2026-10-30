import Image from "next/image";

import { cn } from "@/lib/utils";

import { Tape } from "./tape";

export interface CharacterStickerProps {
  name: string;
  /**
   * Caminho em /public (ex.: "/assets/characters/ada-lovelace.png").
   * Os PNGs oficiais já vêm recortados em formato de adesivo (fundo transparente + halo creme),
   * por isso a imagem é exibida inteira, sem recorte adicional. Ausente = asset pendente.
   */
  imageSrc?: string;
  caption?: string;
  size?: "sm" | "md" | "lg";
  tilt?: "left" | "right" | "none";
  className?: string;
}

const sizes = {
  sm: "size-28",
  md: "size-40",
  lg: "size-64",
} as const;

const imageSizes = {
  sm: "112px",
  md: "160px",
  lg: "256px",
} as const;

/**
 * "Adesivo" recortado de personagem histórico. Enquanto o asset não existir, mostra um
 * marcador honesto (iniciais + "ilustração pendente"), nunca uma imagem falsa.
 * Inventário: docs/assets/README.md.
 */
export function CharacterSticker({
  name,
  imageSrc,
  caption,
  size = "md",
  tilt = "left",
  className,
}: CharacterStickerProps) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <figure
      className={cn(
        "relative inline-flex flex-col items-center",
        tilt === "left" && "rotate-[var(--dp-tilt-1)]",
        tilt === "right" && "rotate-[var(--dp-tilt-2)]",
        className,
      )}
    >
      {imageSrc ? (
        <div className={cn("relative drop-shadow-[0_6px_10px_rgb(15_23_42_/_0.25)]", sizes[size])}>
          <Image
            src={imageSrc}
            alt={`Ilustração de ${name}`}
            fill
            sizes={imageSizes[size]}
            className="object-contain"
          />
        </div>
      ) : (
        <div
          role="img"
          aria-label={`${name}: ilustração pendente`}
          className={cn(
            "flex flex-col items-center justify-center gap-1 rounded-[40%_60%_55%_45%/55%_45%_55%_45%] border-4 border-white bg-dp-paper-strong text-dp-ink-soft shadow-paper",
            sizes[size],
          )}
        >
          <span className="font-marker text-3xl">{initials}</span>
          <span className="px-2 text-center text-[10px] leading-tight tracking-wide uppercase">
            ilustração pendente
          </span>
        </div>
      )}
      <Tape className="absolute -top-2 left-2" angle={-12} />
      <figcaption className="mt-3 bg-dp-paper px-3 py-1 font-marker text-sm shadow-sticky">
        {caption ?? name}
      </figcaption>
    </figure>
  );
}
