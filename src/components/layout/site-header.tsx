import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";
import { type NavItem, publicNav } from "@/config/site";

import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";

/** Itens do cabeçalho: "Início" + seções públicas. */
const headerNav: readonly NavItem[] = [{ label: "Início", href: "/" }, ...publicNav];

/** Chamada principal do cabeçalho. Leva à escolha de carreira (sem login: regra do produto). */
const headerCta: NavItem = { label: "Começar agora", href: "/carreiras" };

/**
 * Cabeçalho do site público no estilo do mockup: a faixa de papel rasgado OFICIAL
 * (`public/assets/objects/faixa-papel-rasgado.webp`) flutua sobre o mural verde via
 * `border-image` em 3 fatias (`.dp-paper-strip`): as pontas rasgadas mantêm a proporção e só o
 * miolo estica. Logo com coroa, navegação com marcador no item ativo e CTA verde.
 * Server Component; só a navegação e o menu mobile são client.
 * Sem campo de busca: busca global não faz parte desta onda (docs/PRD.md).
 */
export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-40 text-dp-ink">
      <div className="dp-container py-3">
        <div className="dp-paper-strip relative flex h-22 items-center justify-between gap-3 px-1 drop-shadow-[0_10px_14px_rgb(0_0_0_/_0.45)] sm:px-3">
          <Logo size="sm" />

          <MainNav items={headerNav} className="hidden xl:block" />

          <div className="flex items-center gap-2">
            <Button
              asChild
              className="hidden h-9 rounded-full bg-dp-green px-4 text-sm font-semibold text-dp-ink shadow-[0_0_0_3px_rgb(34_197_94_/_0.25)] hover:bg-dp-green/90 md:inline-flex"
            >
              <Link href={headerCta.href}>
                {headerCta.label}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <MobileNav items={headerNav} cta={headerCta} />
          </div>
        </div>
      </div>
    </header>
  );
}
