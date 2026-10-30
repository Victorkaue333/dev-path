import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { listCareers } from "@/server/services/content-service";

import { HeroCareerCard } from "./hero-career-card";

const TILTS = [-1.5, 1, -0.75, 1.25, -1, 0.75];

/**
 * Linha de carreiras no rodapé da hero: seis cartões de papel rasgado centralizados, como no
 * mockup. Só carreiras publicadas; sem números inventados.
 */
export async function HeroCareers() {
  const careers = await listCareers();
  if (careers.length === 0) return null;

  return (
    <div>
      <ul className="mx-auto grid max-w-[min(100%,115svh)] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-[1.5svh]">
        {careers.slice(0, 6).map((career, index) => (
          <li key={career.slug}>
            <HeroCareerCard career={career} tilt={TILTS[index % TILTS.length]} />
          </li>
        ))}
      </ul>
      <p className="mt-[1.5svh] flex flex-wrap items-center justify-center gap-x-2 text-center font-marker text-[clamp(0.7rem,1.6svh,1rem)] tracking-[0.18em] text-dp-paper/85 uppercase">
        <span>Disciplina + Prática + Comunidade =</span>
        <Link
          href="/carreiras"
          className="dp-marker-underline inline-flex items-center gap-1 text-dp-green hover:text-dp-paper"
        >
          Resultados
          <ArrowRight className="size-4" aria-hidden="true" />
          <span className="sr-only">(ver todas as carreiras)</span>
        </Link>
      </p>
    </div>
  );
}

export function HeroCareersSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6"
      aria-busy="true"
      aria-label="Carregando carreiras"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[0.94] w-full rounded-lg bg-white/10" />
      ))}
    </div>
  );
}
