import Link from "next/link";

import { Logo } from "@/components/branding/logo";
import { publicNav, siteConfig } from "@/config/site";

/** Rodapé do site público. */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-dp-paper-line bg-dp-ink text-dp-paper">
      <div className="dp-container grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo size="sm" onDark />
          <p className="max-w-sm text-sm text-dp-paper/80">{siteConfig.description}</p>
        </div>

        <nav aria-label="Seções do site">
          <h2 className="mb-3 font-marker text-lg text-dp-green">Explorar</h2>
          <ul className="space-y-2 text-sm">
            {publicNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-dp-paper/85 hover:text-dp-green hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 font-marker text-lg text-dp-green">Projeto</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={siteConfig.repositoryUrl}
                rel="noopener noreferrer"
                target="_blank"
                className="text-dp-paper/85 hover:text-dp-green hover:underline"
              >
                Código-fonte no GitHub
              </a>
            </li>
            <li>
              <Link href="/sobre" className="text-dp-paper/85 hover:text-dp-green hover:underline">
                Sobre o DevPath
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="dp-container flex flex-col gap-2 py-4 text-xs text-dp-paper/60 sm:flex-row sm:justify-between">
          <p>
            {siteConfig.name} — {siteConfig.tagline}. Conteúdo público e gratuito.
          </p>
          <p>Sem cadastro, sem rastreamento de visitantes.</p>
        </div>
      </div>
    </footer>
  );
}
