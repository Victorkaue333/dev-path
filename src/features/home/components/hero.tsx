import { ArrowRight, BookOpen, Map } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { StickyNote } from "@/components/design-system/sticky-note";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

import { HeroCharacter } from "./hero-character";
import { HeroWordmark } from "./hero-wordmark";

interface HeroProps {
  /** Linha de carreiras (assíncrona, já embrulhada em <Suspense> pela página). */
  careers: ReactNode;
}

/** Fundo oficial da hero (mural verde com rabiscos), entregue pelo mantenedor. 1672×941. */
const HERO_BACKGROUND = "/assets/textures/hero-background.png";

/** Post-its somem em telas baixas para a hero caber na altura visível (o de baixo some primeiro). */
const NOTE_TOP = "hidden max-w-[11rem] text-base xl:block [@media(max-height:840px)]:hidden";
const NOTE_BOTTOM = "hidden max-w-[11rem] text-base xl:block [@media(max-height:1000px)]:hidden";

/**
 * Hero de tela inteira no estilo colagem editorial (docs/DESIGN.md), composta como o mockup:
 * coluna esquerda (post-it, Ada Lovelace, etiquetas), centro (logotipo, tagline, texto, CTAs),
 * coluna direita (post-it, Alan Turing, etiquetas), computador e Tux nos cantos, linha de carreiras.
 *
 * Dimensionamento: logo, personagens, textos e cartões usam `svh` com `clamp()` para que a hero
 * inteira (até a linha "Disciplina + Prática…") caiba na altura visível em 1080p e em telas
 * menores, sem cortar o rodapé. O cabeçalho flutua por cima (`pt-[5.5rem]` reserva o espaço).
 * Elementos dos mockups fora do escopo do produto (busca, contador de pessoas, login) não existem.
 */
export function Hero({ careers }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="dp-hero dp-hero-bg relative isolate flex min-h-svh flex-col overflow-hidden pt-[6.5rem] text-dp-paper"
    >
      {/* Fundo: imagem oficial sobre o fallback em CSS (.dp-hero-bg) */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image
          src={HERO_BACKGROUND}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(6_28_20_/_0.5),transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[110rem] flex-1 flex-col justify-center gap-[3svh] px-4 py-[2svh] sm:px-6 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2.2fr)_minmax(0,0.9fr)] lg:items-center lg:gap-6 lg:px-10">
        {/* Centro: marca, texto e ações */}
        <Reveal className="order-1 flex flex-col items-center text-center lg:col-start-2 lg:row-start-1">
          <HeroWordmark />

          <p className="mt-[2.5svh] max-w-2xl font-mono text-[clamp(0.8rem,1.7svh,1.1rem)] leading-relaxed text-dp-paper/90">
            Um guia completo e <Highlight>gratuito</Highlight> para quem quer começar na programação
            e construir uma carreira em tecnologia, com roadmaps, cursos, projetos e o que o mercado
            pede, tudo <Highlight>em um só lugar</Highlight>.
          </p>

          <div className="mt-[2.5svh] flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-[clamp(2.5rem,5svh,3rem)] rounded-full bg-dp-green px-6 text-[clamp(0.875rem,1.7svh,1rem)] font-semibold text-dp-ink shadow-[0_0_0_4px_rgb(34_197_94_/_0.2)] hover:bg-dp-green/90"
            >
              <Link href="/roadmaps">
                <Map aria-hidden="true" />
                Explorar roadmaps
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-[clamp(2.5rem,5svh,3rem)] rounded-full border-dp-paper/40 bg-transparent px-6 text-[clamp(0.875rem,1.7svh,1rem)] text-dp-paper hover:bg-dp-paper/10 hover:text-dp-paper"
            >
              <Link href="/carreiras">
                <BookOpen aria-hidden="true" />
                Ver carreiras
              </Link>
            </Button>
          </div>
        </Reveal>

        {/* Personagens: no mobile ficam lado a lado abaixo do texto; no desktop viram colunas laterais */}
        <div className="order-2 flex items-start justify-center gap-4 sm:gap-8 lg:contents">
          <Reveal
            delay={0.1}
            className="flex flex-col items-start gap-[1.5svh] lg:col-start-1 lg:row-start-1 lg:self-center"
          >
            <StickyNote tilt="left" color="yellow" className={NOTE_TOP}>
              Conhecimento transforma realidades.
            </StickyNote>
            <HeroCharacter
              name="Ada Lovelace"
              role="Pioneira da programação"
              imageSrc="/assets/characters/ada-lovelace.png"
              width={1145}
              height={1373}
              side="left"
            />
            <StickyNote tilt="right" color="paper" taped={false} className={NOTE_BOTTOM}>
              Ideias também programam o futuro.
            </StickyNote>
          </Reveal>

          <Reveal
            delay={0.2}
            className="flex flex-col items-end gap-[1.5svh] lg:col-start-3 lg:row-start-1 lg:self-center"
          >
            <StickyNote tilt="right" color="paper" className={NOTE_TOP}>
              Lógica também muda o mundo.
            </StickyNote>
            <HeroCharacter
              name="Alan Turing"
              role="Fundamentos da computação"
              imageSrc="/assets/characters/alan-turing.png"
              width={1167}
              height={1347}
              side="right"
            />
            <StickyNote tilt="left" color="yellow" taped={false} className={NOTE_BOTTOM}>
              Pessoas incríveis também começaram do zero.
            </StickyNote>
          </Reveal>
        </div>
      </div>

      {/* Computador retrô (PNG oficial com fundo transparente), canto inferior esquerdo como no mockup */}
      <Image
        src="/assets/objects/terminal-retro-v320.png"
        alt="Computador retrô exibindo no terminal: devpath, estudar, construir, evoluir, conquistar"
        width={1305}
        height={1205}
        sizes="(min-width: 1536px) 340px, 240px"
        className="absolute bottom-[1svh] -left-2 z-0 hidden w-[clamp(10rem,24svh,21rem)] -rotate-3 drop-shadow-[0_14px_18px_rgb(0_0_0_/_0.5)] xl:block"
      />

      {/* Tux e livros (WebP com fundo transparente), canto inferior direito como no mockup */}
      <Image
        src="/assets/objects/tux-e-livros-sticker.webp"
        alt="Tux, o pinguim do Linux, ao lado de uma pilha de livros de computação"
        width={1536}
        height={1024}
        sizes="(min-width: 1536px) 360px, 260px"
        className="absolute -right-4 bottom-[0.5svh] z-0 hidden w-[clamp(12rem,26svh,22rem)] rotate-2 drop-shadow-[0_14px_18px_rgb(0_0_0_/_0.5)] xl:block"
      />

      {/* Linha de carreiras */}
      <div className="dp-container relative z-10 pb-[1.5svh]">{careers}</div>
    </section>
  );
}

function Highlight({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-dp-green">{children}</strong>;
}
