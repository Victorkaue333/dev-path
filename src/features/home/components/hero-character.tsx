import Image from "next/image";

import { Tape } from "@/components/design-system/tape";
import { cn } from "@/lib/utils";

interface HeroCharacterProps {
  name: string;
  role: string;
  /** PNG com fundo transparente em /public/assets/characters. */
  imageSrc: string;
  width: number;
  height: number;
  /** Lado da composição; muda rotação e alinhamento das etiquetas. */
  side: "left" | "right";
  className?: string;
}

/**
 * Personagem em recorte de adesivo com etiquetas de papel (nome e papel histórico).
 * Largura limitada pela altura da tela (`svh`) para a hero caber inteira. LCP candidata: prioridade.
 */
export function HeroCharacter({
  name,
  role,
  imageSrc,
  width,
  height,
  side,
  className,
}: HeroCharacterProps) {
  const left = side === "left";
  return (
    <figure
      className={cn(
        "relative mx-auto w-full max-w-[150px] sm:max-w-[200px] lg:max-w-[clamp(8rem,26svh,20rem)]",
        className,
      )}
    >
      <div
        className={cn(
          "relative drop-shadow-[0_14px_18px_rgb(0_0_0_/_0.45)]",
          left ? "rotate-[var(--dp-tilt-1)]" : "rotate-[var(--dp-tilt-2)]",
        )}
      >
        <Image
          src={imageSrc}
          alt={`Ilustração de ${name}`}
          width={width}
          height={height}
          priority
          sizes="(min-width: 1024px) 320px, 200px"
          className="h-auto w-full"
        />
        <Tape
          color="beige"
          angle={left ? -14 : 12}
          className={cn("absolute -top-2", left ? "right-6" : "left-6")}
        />
      </div>
      <figcaption
        className={cn(
          "mt-[1svh] flex flex-col gap-1",
          left ? "items-start pl-2" : "items-end pr-2",
        )}
      >
        <span className="inline-block -rotate-2 bg-dp-paper px-3 py-1 font-marker text-[clamp(0.7rem,1.5svh,1rem)] tracking-wider text-dp-ink uppercase shadow-sticky">
          {name}
        </span>
        <span className="inline-block rotate-1 bg-dp-paper-strong px-3 py-1 font-marker text-[clamp(0.6rem,1.3svh,0.875rem)] tracking-wide text-dp-ink-soft uppercase shadow-sticky">
          {role}
        </span>
      </figcaption>
    </figure>
  );
}
