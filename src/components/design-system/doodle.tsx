import { cn } from "@/lib/utils";

export type DoodleKind = "arrow" | "crown" | "underline" | "smiley" | "asterisk" | "circle";

const paths: Record<DoodleKind, { viewBox: string; d: string[] }> = {
  arrow: { viewBox: "0 0 120 40", d: ["M4 30c28-18 60-22 110-10", "M100 10l14 10-12 12"] },
  crown: {
    viewBox: "0 0 64 48",
    d: ["M6 40L4 14l16 12L32 6l12 20 16-12-2 26z", "M8 44h48"],
  },
  underline: { viewBox: "0 0 200 16", d: ["M3 10c50-8 100-6 194-2", "M20 13c40-4 80-4 160-1"] },
  smiley: {
    viewBox: "0 0 48 48",
    d: ["M24 4a20 20 0 1 0 0 40 20 20 0 0 0 0-40z", "M16 19h.5M32 19h.5", "M15 29c5 6 13 6 18 0"],
  },
  asterisk: { viewBox: "0 0 40 40", d: ["M20 4v32", "M6 12l28 16", "M34 12L6 28"] },
  circle: {
    viewBox: "0 0 120 60",
    d: ["M60 6C20 6 6 20 8 32c2 14 30 22 56 22s54-8 52-24C114 16 90 6 60 6z"],
  },
};

export interface DoodleProps {
  kind: DoodleKind;
  /** Cor via utilitário Tailwind (ex.: "text-dp-yellow"). */
  className?: string;
  strokeWidth?: number;
  /** Rótulo acessível quando o rabisco carregar significado; por padrão é decorativo. */
  title?: string;
}

/**
 * Rabiscos "à mão" em SVG inline (sem dependência de asset).
 * Contrato: decorativo por padrão (`aria-hidden`), cor por `currentColor`.
 */
export function Doodle({ kind, className, strokeWidth = 3, title }: DoodleProps) {
  const { viewBox, d } = paths[kind];
  return (
    <svg
      viewBox={viewBox}
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
      className={cn("inline-block h-6 w-auto text-dp-yellow", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {title ? <title>{title}</title> : null}
      {d.map((segment) => (
        <path key={segment} d={segment} />
      ))}
    </svg>
  );
}
