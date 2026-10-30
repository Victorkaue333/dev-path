# M1 — Home com hero da identidade e as sete seções públicas com layout final

> Doc-pai da fase **M1**. **Status: em andamento** — o item 1 (hero da home, primeira versão) foi entregue ainda no bootstrap a pedido do mantenedor, com Ada Lovelace e Alan Turing nos PNGs oficiais; itens 2 a 7 seguem planejados.
> Spec: [`../spec/features/paginas-publicas-v1.md`](../spec/features/paginas-publicas-v1.md) (guarda-chuva) + uma spec por tela em [`../spec/features/README.md`](../spec/features/README.md); 9 escritas, 6 públicas a escrever (processo: [`../spec/README.md`](../spec/README.md)).
> Origem: briefing do bootstrap, seção "Próxima onda"; mockups de referência (home/hero, roadmaps, detalhe de roadmap, brand board).
> Relação com ADRs: estende [0010](../DECISIONS.md#0010--design-system-tailwind-v4--shadcnui-fontes-google) e [0012](../DECISIONS.md#0012--sem-cadastro-público-em-qualquer-forma) sem contrariá-las; pode abrir ADR sobre assets/self-hosting de fontes.

---

## O problema, na tela

As páginas públicas são páginas-base: listam o conteúdo demo com os componentes do Design System, mas sem a composição de colagem (hero com stickers, papéis sobre o mural, rabiscos), sem hierarquia visual final e sem os assets. A home não comunica o posicionamento.

---

## Escopo

### Entra

1. **Hero da home**: logotipo (wordmark em texto até o SVG existir), tagline "Seu caminho no mundo da tecnologia", parágrafo de posicionamento, CTA "Explorar roadmaps" e "Ver carreiras", `CharacterSticker` de Ada Lovelace e Alan Turing com placeholder explícito, `RetroTerminal`, `StickyNote`s, `Doodle`s. **Sem** contador de pessoas, **sem** "assistir apresentação", **sem** busca.
2. **Grade de carreiras** na home (`CareerCard`) e destaques de roadmaps/lendas.
3. **Listagens finais** de carreiras, roadmaps, cursos (com filtros simples por nível/idioma via `searchParams` dentro de `<Suspense>`), projetos, mercado (tecnologias por categoria, **sem** percentuais), lendas (galeria) e sobre.
4. **Detalhes finais**: carreira (roadmaps, tecnologias, projetos), roadmap (linha de etapas + `RoadmapStep` com tópicos e cursos relacionados), lenda (biografia, contribuições).
5. **Estados**: `Skeleton` por seção, `EmptyState`, `error.tsx` nas rotas de detalhe.
6. **Motion**: `Reveal` com `useReducedMotion`.
7. **Acessibilidade e SEO** validados pelo checklist (A11Y-*, SEO-*, RESP-*).

### Não entra

Progresso/checkboxes, perfil, busca global, PDF de roadmap, estatísticas de mercado, CRUD, banco real (continua demo ou banco local já validado na M2).

---

## Pré-requisitos

- Decisão sobre assets: produzir ilustrações próprias ou usar domínio público ([`../assets/README.md`](../assets/README.md)). Sem assets, a M1 fecha com placeholders explícitos.
- Spec aprovada com wireframes (mermaid ou descrição por seção) para hero, listagem e detalhe.

---

## Tarefas previstas

| # | Tarefa | RF |
|---|---|---|
| T1 | Hero e grade de carreiras na home | RF-01 |
| T2 | Listagem e detalhe de carreiras | RF-02 |
| T3 | Listagem e detalhe de roadmaps (linha de etapas) | RF-03 |
| T4 | Cursos com filtros por nível/idioma e `TrackedLink` | RF-04 |
| T5 | Projetos (lista + detalhe com critérios) | RF-05 |
| T6 | Mercado por categoria, sem estatísticas | RF-06 |
| T7 | Lendas (galeria + detalhe) | RF-07 |
| T8 | Sobre, 404, `error.tsx`, `Reveal` | RF-08, RF-09 |
| T9 | Checklist A11Y/SEO/RESP + testes e2e por página | RNF-04, RNF-05, RNF-09 |

---

## Como verificar

| # | Critério de aceite | Onde se prova |
|---|---|---|
| 1 | DADO a home QUANDO carregada ENTÃO hero, carreiras publicadas e navegação aparecem sem contador, avatar ou busca | e2e |
| 2 | DADO um roadmap publicado QUANDO aberto ENTÃO etapas em ordem com tópicos e cursos relacionados | e2e + unit (repositório) |
| 3 | DADO `prefers-reduced-motion` QUANDO a home carrega ENTÃO nenhuma animação roda | manual / e2e com emulação |
| 4 | DADO viewport 320 px QUANDO qualquer página pública carrega ENTÃO não há rolagem horizontal | e2e |
| 5 | DADO qualquer página pública ENTÃO título, descrição e canonical únicos | e2e |

Comandos: `pnpm check` · `pnpm test:e2e`.

---

## Pendências previstas

1. **Assets** — a decidir antes ou durante a M1.
2. **Self-hosting de fontes** — se o build sem rede virar requisito.
3. **Renderer de Markdown sanitizado** para `Project.acceptance` — pode entrar na M1 ou M3 ([`../Security-Guide.md`](../Security-Guide.md#17-riscos-conhecidos-em-aberto)).
