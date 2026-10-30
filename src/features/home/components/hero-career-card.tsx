import {
  ArrowRight,
  BarChart3,
  Brain,
  Cloud,
  Layers,
  type LucideIcon,
  Monitor,
  Server,
  Shield,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Tape } from "@/components/design-system/tape";
import type { AccentToken, CareerSummary } from "@/types/content";

const icons: Record<string, LucideIcon> = {
  monitor: Monitor,
  server: Server,
  "bar-chart-3": BarChart3,
  cloud: Cloud,
  layers: Layers,
  brain: Brain,
  shield: Shield,
};

const tapeByAccent: Record<AccentToken, "green" | "yellow" | "coral" | "beige"> = {
  green: "green",
  yellow: "yellow",
  coral: "coral",
  ink: "beige",
};

/** Papel rasgado oficial (WebP com alfa gerado a partir do PNG do mantenedor). */
const PAPER = { src: "/assets/objects/nota-papel-rasgado.webp", width: 1275, height: 1234 };

/**
 * Cartão compacto de carreira para a hero, como no mockup: papel rasgado ao fundo, fita colorida,
 * ícone, nome curto, frase de impacto e seta. O cartão inteiro é o link.
 */
export function HeroCareerCard({ career, tilt = 0 }: { career: CareerSummary; tilt?: number }) {
  const Icon = icons[career.icon ?? ""] ?? Sparkles;
  return (
    <article
      className="group duration-base relative aspect-[0.94] w-full transition-transform ease-out-soft focus-within:-translate-y-1 hover:-translate-y-1"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <Image
        src={PAPER.src}
        alt=""
        aria-hidden="true"
        fill
        sizes="(min-width: 1280px) 200px, (min-width: 640px) 180px, 45vw"
        className="object-fill drop-shadow-[0_10px_14px_rgb(0_0_0_/_0.45)]"
      />
      <Tape
        color={tapeByAccent[career.accent ?? "ink"]}
        className="absolute -top-2 left-1/2 z-10 h-5 w-16 -translate-x-1/2"
      />
      <div className="relative z-10 flex h-full flex-col items-start px-[12%] pt-[16%] pb-[12%] text-dp-ink">
        <Icon
          className="size-[clamp(1.25rem,3.4svh,2rem)] text-dp-green-strong"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <h3 className="mt-[1svh] text-[clamp(0.9rem,2svh,1.125rem)] leading-tight font-bold">
          <Link
            href={`/carreiras/${career.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {career.shortTitle ?? career.title}
          </Link>
        </h3>
        <p className="mt-1 text-[clamp(0.65rem,1.45svh,0.8125rem)] leading-snug text-dp-ink-soft">
          {career.tagline ?? career.shortDescription}
        </p>
        <ArrowRight
          className="duration-fast mt-auto ml-auto size-5 text-dp-green-strong transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
    </article>
  );
}
