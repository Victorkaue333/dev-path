import type { Metadata } from "next";

import { PaperCard } from "@/components/design-system/paper-card";
import { SectionHeading } from "@/components/design-system/section-heading";
import { StickyNote } from "@/components/design-system/sticky-note";
import { type FeatureStatus, StatusBadge } from "@/components/feedback/status-badge";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Sobre o DevPath",
  description: "O que é o DevPath, por que existe e como o projeto está sendo construído.",
  path: "/sobre",
});

const roadmap: Array<{ label: string; status: FeatureStatus }> = [
  {
    label:
      "Estrutura do site, carreiras, roadmaps, cursos, projetos e lendas (conteúdo demonstrativo)",
    status: "implementado",
  },
  {
    label: "Painel administrativo com login seguro (sem CRUD de conteúdo ainda)",
    status: "implementado",
  },
  { label: "Conteúdo editorial real vindo do banco de dados", status: "planejado" },
  { label: "Hero da página inicial no estilo colagem (primeira versão)", status: "implementado" },
  { label: "Demais páginas públicas com a identidade visual completa", status: "planejado" },
  { label: "Busca e filtros por carreira, nível e idioma", status: "planejado" },
  { label: "Métricas de navegação agregadas no painel (sem dados pessoais)", status: "planejado" },
  {
    label: "Ilustrações das figuras históricas (entregues) e logotipo com fundo transparente",
    status: "pendente",
  },
];

export default function AboutPage() {
  return (
    <div className="dp-container dp-section">
      <SectionHeading
        as="h1"
        eyebrow="Sobre"
        title={`${siteConfig.name}: ${siteConfig.tagline}`}
        description="Uma plataforma pública e gratuita para quem quer começar — ou avançar — em tecnologia, sem precisar criar conta."
      />

      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <PaperCard textured className="space-y-4 p-6">
            <h2 className="text-xl font-bold">O que você encontra aqui</h2>
            <ul className="list-disc space-y-1 pl-5 text-dp-ink-soft">
              <li>Roadmaps de aprendizado por carreira.</li>
              <li>Cursos gratuitos e documentação oficial, sem pegadinhas.</li>
              <li>Projetos práticos por nível, com critérios de conclusão.</li>
              <li>Tecnologias e habilidades pedidas pelo mercado.</li>
              <li>Histórias de figuras importantes da computação.</li>
            </ul>
          </PaperCard>

          <PaperCard className="space-y-4 p-6">
            <h2 className="text-xl font-bold">Princípios</h2>
            <ul className="list-disc space-y-1 pl-5 text-dp-ink-soft">
              <li>Sem cadastro, sem perfil, sem pagamentos.</li>
              <li>Sem números inventados: estatísticas só com fonte e data.</li>
              <li>Privacidade: nenhum dado pessoal de visitante é coletado.</li>
              <li>Código aberto para leitura no GitHub.</li>
            </ul>
          </PaperCard>

          <PaperCard className="p-6">
            <h2 className="text-xl font-bold">Estado do projeto</h2>
            <p className="mt-1 text-sm text-dp-ink-soft">
              O que está pronto e o que ainda vem. Atualizado a cada onda de desenvolvimento.
            </p>
            <ul className="mt-4 space-y-2">
              {roadmap.map((item) => (
                <li key={item.label} className="flex items-start justify-between gap-4 text-sm">
                  <span>{item.label}</span>
                  <StatusBadge status={item.status} />
                </li>
              ))}
            </ul>
          </PaperCard>
        </div>

        <StickyNote tilt="left" className="justify-self-center lg:justify-self-end">
          Pessoas incríveis também começaram do zero.
        </StickyNote>
      </div>
    </div>
  );
}
