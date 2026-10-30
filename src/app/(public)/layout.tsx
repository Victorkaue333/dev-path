import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { PageViewTracker } from "@/features/analytics/components/page-view-tracker";

/**
 * Layout público: sem autenticação, renderizado no servidor.
 * O cabeçalho flutua (absoluto) sobre o mural verde: na home, sobre o fundo da hero;
 * nas demais páginas, sobre a faixa `.dp-mural-band` renderizada aqui atrás dele.
 * Páginas sem hero recebem espaço no topo via `main`; a hero (classe `dp-hero`) cuida do próprio espaço.
 */
export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <SkipLink />
      <div aria-hidden="true" className="dp-mural-band absolute inset-x-0 top-0 -z-10 h-40" />
      <SiteHeader />
      <main id="conteudo" className="flex flex-1 flex-col pt-32 [&:has(>.dp-hero)]:pt-0">
        {children}
      </main>
      <SiteFooter />
      <PageViewTracker />
    </div>
  );
}
