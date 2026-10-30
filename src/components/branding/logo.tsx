import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Tamanho do lettering. */
  size?: "sm" | "md" | "lg";
  /** Renderiza como link para a home (padrão) ou como marca estática. */
  asLink?: boolean;
  /** Variante para fundos escuros. */
  onDark?: boolean;
  /** Coroa amarela sobre o "D" (identidade). */
  crown?: boolean;
  className?: string;
}

const sizes = {
  sm: "text-2xl",
  md: "text-3xl",
  lg: "text-5xl sm:text-6xl",
} as const;

/**
 * Logotipo provisório em texto (Permanent Marker) + coroa e seta em SVG.
 * Será substituído pelo logotipo oficial quando existir um arquivo com fundo transparente
 * (public/assets/branding — ver docs/assets/README.md).
 */
export function Logo({
  size = "md",
  asLink = true,
  onDark = false,
  crown = true,
  className,
}: LogoProps) {
  const mark = (
    <span
      className={cn(
        "relative inline-flex items-baseline pt-[0.35em] font-marker leading-none tracking-tight select-none",
        sizes[size],
        className,
      )}
    >
      {crown ? (
        <Image
          src="/assets/decorations/coroa.svg"
          alt=""
          aria-hidden="true"
          width={36}
          height={27}
          unoptimized
          className="absolute top-0 left-[0.15em] h-[0.5em] w-auto -rotate-6"
        />
      ) : null}
      <span
        className={cn(
          "[-webkit-text-stroke:0.02em_#0f172a]",
          onDark ? "text-dp-paper" : "text-dp-ink [-webkit-text-stroke:0]",
        )}
      >
        Dev
      </span>
      <span className="text-dp-green [-webkit-text-stroke:0.02em_#0f172a]">Path</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 120 14"
        className="absolute -right-1 -bottom-2 h-[0.28em] w-[1.7em] text-dp-green"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 9c30-6 60-7 108-3" />
        <path d="M101 2l9 4-8 6" />
      </svg>
    </span>
  );

  if (!asLink) return mark;

  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} — página inicial`}
      className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      {mark}
    </Link>
  );
}
