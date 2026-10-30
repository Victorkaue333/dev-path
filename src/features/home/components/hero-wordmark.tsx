import Image from "next/image";

import { siteConfig } from "@/config/site";

/** Logotipo oficial com fundo transparente (gerado a partir do PNG entregue; docs/assets/README.md). */
const LOGO = { src: "/assets/branding/logo-devpath.webp", width: 1552, height: 1041 };

/**
 * Marca principal da hero: logotipo oficial + tagline em tira de papel kraft rasgado (uma linha),
 * como no mockup. O h1 carrega nome e tagline para SEO e leitores de tela.
 * Larguras em `svh` para a hero caber na altura visível.
 */
export function HeroWordmark() {
  return (
    <h1 id="hero-title" className="relative flex flex-col items-center text-center">
      <Image
        src={LOGO.src}
        alt={siteConfig.name}
        width={LOGO.width}
        height={LOGO.height}
        priority
        sizes="(min-width: 1024px) 736px, 90vw"
        className="h-auto w-[min(90vw,24rem)] drop-shadow-[0_18px_24px_rgb(0_0_0_/_0.45)] sm:w-[min(84vw,30rem)] lg:w-[clamp(18rem,56svh,46rem)]"
      />
      <span className="dp-torn-edge relative -mt-[0.5svh] inline-block max-w-full -rotate-[1.5deg] bg-[#e8dcb8] px-6 py-2 font-marker text-[clamp(0.7rem,min(2svh,3.3vw),1.5rem)] tracking-[0.08em] whitespace-nowrap text-dp-ink uppercase shadow-sticky sm:px-8">
        {siteConfig.tagline}
      </span>
    </h1>
  );
}
