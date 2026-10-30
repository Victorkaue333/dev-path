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
import Link from "next/link";

import { PaperCard } from "@/components/design-system/paper-card";
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

const accents: Record<AccentToken, { tape: "green" | "yellow" | "coral" | "beige"; icon: string }> =
  {
    green: { tape: "green", icon: "bg-dp-green-soft text-dp-green-strong" },
    yellow: { tape: "yellow", icon: "bg-dp-yellow-soft text-dp-ink" },
    coral: { tape: "coral", icon: "bg-dp-coral-soft text-dp-ink" },
    ink: { tape: "beige", icon: "bg-dp-paper-strong text-dp-ink" },
  };

/** Cartão de carreira: papel com fita, ícone e chamada para o detalhe. */
export function CareerCard({
  career,
  tilt = "none",
}: {
  career: CareerSummary;
  tilt?: "left" | "right" | "none";
}) {
  const Icon = icons[career.icon ?? ""] ?? Sparkles;
  const accent = accents[career.accent ?? "ink"];

  return (
    <PaperCard
      as="article"
      tilt={tilt}
      interactive
      textured
      className="flex h-full flex-col p-6 pt-8"
    >
      <Tape color={accent.tape} className="absolute -top-3 left-6" />
      <div
        className={`mb-4 inline-flex size-12 items-center justify-center rounded-lg ${accent.icon}`}
      >
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-dp-ink">
        <Link
          href={`/carreiras/${career.slug}`}
          className="after:absolute after:inset-0 focus-visible:outline-none"
        >
          {career.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-dp-ink-soft">{career.shortDescription}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-dp-green-strong">
        Ver caminho
        <ArrowRight
          className="duration-fast size-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </PaperCard>
  );
}
