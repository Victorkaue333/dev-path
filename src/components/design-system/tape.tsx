import { cn } from "@/lib/utils";

type TapeColor = "beige" | "green" | "yellow" | "coral";

const colors: Record<TapeColor, string> = {
  beige: "bg-[#e9e2c9]/80",
  green: "bg-dp-green/70",
  yellow: "bg-dp-yellow/70",
  coral: "bg-dp-coral/70",
};

export interface TapeProps {
  color?: TapeColor;
  /** Rotação em graus (ex.: -6, 4). */
  angle?: number;
  className?: string;
}

/**
 * Fita adesiva decorativa (sempre `aria-hidden`).
 * Contrato: elemento puramente visual, nunca carrega conteúdo.
 */
export function Tape({ color = "beige", angle = -4, className }: TapeProps) {
  return (
    <span
      aria-hidden="true"
      style={{ transform: `rotate(${angle}deg)` }}
      className={cn(
        "pointer-events-none block h-6 w-24 opacity-90 shadow-[0_1px_2px_rgb(15_23_42_/_0.15)]",
        "[clip-path:polygon(2%_0,98%_4%,100%_96%,1%_100%)]",
        colors[color],
        className,
      )}
    />
  );
}
