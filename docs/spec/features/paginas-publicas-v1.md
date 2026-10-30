# Páginas públicas v1 — spec guarda-chuva

> Criado: 30/out/2026 · Autor: bootstrap (agente), a ratificar pelo mantenedor · Status: **proposta** (hero da home já **implementada**)
> Origem: briefing do bootstrap ("Próxima onda"), mockups de referência (01 Home, 02 Roadmaps, 03 Roadmap detalhe, 04 Cursos, 05 Mercado, 06 Projetos, 07 Lendas, 08 Sobre, 09 Perfil — este último fora do produto), PRD RF-01 a RF-09
> Contrato: [SDD](../README.md) · Decisões relacionadas: [ADR 0005](../../DECISIONS.md#0005--conteúdo-demonstrativo-como-fonte-transitória-única), [ADR 0006](../../DECISIONS.md#0006--cache-components-ligado-suspense-para-cookies-e-banco), [ADR 0010](../../DECISIONS.md#0010--design-system-tailwind-v4--shadcnui-fontes-google), [ADR 0012](../../DECISIONS.md#0012--sem-cadastro-público-em-qualquer-forma), [ADR 0014](../../DECISIONS.md#0014--estrutura-modular-por-features-com-camada-server-only)
> Milestone: [M1](../../milestones/M1-hero-e-paginas-publicas.md)

Este documento fixa as regras comuns a todas as telas públicas do DevPath e aponta para a spec de cada tela. Quem for implementar lê este arquivo uma vez e depois só a spec da tela. As telas do painel têm specs próprias listadas no fim.

---

## 0. Constituição

| Decisão fixa | Respeita? | Nota |
|---|---|---|
| Sem cadastro, perfil, progresso em conta ou pagamento (ADR 0012) | sim | Mockups trazem avatar, "Meu progresso", checkboxes de etapa: **não entram** (ver §6). |
| Nenhum número sem fonte real | sim | "+10.000 pessoas", percentuais de vagas e faixas salariais dos mockups **não entram**. |
| Prisma só em `src/server/**` (ADR 0014) | sim | Páginas usam `src/server/services/content-service.ts`. |
| `cookies()`/`headers()`/banco/`searchParams` dentro de `<Suspense>` (ADR 0006) | sim | Padrão obrigatório em toda seção que lê conteúdo. |
| Site público lê só `PUBLISHED` | sim | Garantido pelos repositórios; as telas não filtram por status. |
| Zod em toda entrada | sim | Única entrada pública nova: `searchParams` de filtros (schema em `src/features/courses/schemas.ts`). |
| pt-BR na interface | sim | |
| Nenhum segredo no cliente | sim | |
| Dependência nova → ADR | **atenção** | Renderização de Markdown nos projetos pode exigir dependência; ver [`projeto-detalhe.md`](projeto-detalhe.md) §13. |

## 1. Contexto (FATOS)

- Layout público: `src/app/(public)/layout.tsx` — cabeçalho flutuante (`SiteHeader`, faixa de papel oficial via `.dp-paper-strip`), faixa do mural `.dp-mural-band` atrás do cabeçalho nas páginas sem hero, `main#conteudo` com `pt-32` (zerado quando o primeiro filho tem classe `dp-hero`), `SiteFooter`, `PageViewTracker`.
- Hero da home: `src/features/home/components/{hero,hero-wordmark,hero-character,hero-careers,hero-career-card}.tsx` — **implementada** (logo oficial, fundo do mural, Ada e Turing, 6 cartões de carreira em papel rasgado, computador retrô e Tux, dimensionada por `svh`).
- Design System: `src/components/design-system/` (`PaperCard`, `StickyNote`, `Tape`, `Doodle`, `CharacterSticker`, `RetroTerminal`, `SectionHeading`), `src/components/feedback/` (`EmptyState`, `StatusBadge`, `DevNotice` — não montado), `src/components/motion/reveal.tsx`, `src/features/careers/components/career-card.tsx`, `src/features/roadmaps/components/roadmap-step.tsx`, `src/features/analytics/components/tracked-link.tsx`.
- Tokens: `src/app/globals.css` (`--dp-*`, `font-marker`, `shadow-paper`, `.dp-container`, `.dp-section`, `.dp-torn-edge`, `.dp-paper-texture`, `.dp-hero-bg`, `.dp-mural-band`, `.dp-paper-strip`).
- Dados: `src/server/services/content-service.ts` expõe `listCareers`, `getCareer`, `listRoadmaps`, `getRoadmap`, `listCourses`, `listProjects`, `listTechnologies`, `listLegends`, `getLegend`, `getHomeHighlights`, `getContentSource`. DTOs em `src/types/content.ts`.
- Metadata: `buildPageMetadata({ title, description, path })` em `src/lib/seo.ts` (título, descrição, canonical, Open Graph).
- Assets reais (inventário em [`../../assets/README.md`](../../assets/README.md)): personagens (`characters/*.png|webp`), objetos (`objects/*.webp`, incluindo os 12 recortados da folha retrô), papéis (`objects/nota-papel-rasgado.webp`, `objects/faixa-papel-rasgado.webp`), fundo (`textures/hero-background.{png,webp}`), decorações SVG (`decorations/*.svg`).

## 2. Princípios de layout

1. **Mural + papéis.** Fundo verde-escuro do mural (`.dp-hero-bg` ou `hero-background.webp`) em seções de abertura e de destaque; conteúdo de leitura longa em superfície de papel (`bg-dp-paper`, `PaperCard`, `.dp-paper-texture`). Nunca texto corrido longo direto sobre o mural.
2. **Cabeçalho flutuante.** O cabeçalho é `absolute` e transparente; toda página sem hero começa com a faixa do mural (`.dp-mural-band`, 10rem) e o `main` com `pt-32`. Páginas com hero usam a classe `dp-hero` no primeiro filho e reservam o espaço (`pt-[6.5rem]`).
3. **Largura.** `.dp-container` (72rem) para leitura; a hero e seções "mural" podem usar até `max-w-[110rem]`.
4. **Hierarquia tipográfica.** Um `h1` por página (via `SectionHeading as="h1"` ou na hero). `font-marker` só em títulos de seção marcados com `marker`, etiquetas, post-its e tagline. Corpo em Inter; trechos "de terminal" em `font-mono`.
5. **Colagem com moderação.** No máximo 2 post-its e 2–3 objetos/rabiscos por seção; todos `aria-hidden` quando decorativos; nunca cobrem texto; somem em `xl` para baixo quando competem com conteúdo.
6. **Cartões de papel.** Listas de conteúdo usam `PaperCard` (interativo quando o item tem página própria) ou o cartão de papel rasgado (`nota-papel-rasgado.webp`, como em `HeroCareerCard`) quando houver até 6 itens em destaque.

## 3. Grade de breakpoints

| Largura | Alvo | Colunas de cartões | Observações |
|---|---|---|---|
| 390 | celular | 1 (2 para cartões compactos) | menu via `MobileNav`; post-its ocultos; sem rolagem horizontal |
| 768 | tablet | 2 | CTA do cabeçalho visível |
| 1024 | notebook pequeno | 3 | navegação ainda no menu (xl mostra a barra) |
| 1280 | notebook/desktop | 3–4 | `MainNav` visível; post-its laterais |
| 1536 | desktop largo | 4–6 | objetos de canto (computador, Tux) |
| 1920 | monitor FHD | 6 | hero inteira em 937 px de altura útil (verificado) |

Altura: a hero e qualquer seção "de tela inteira" dimensionam por `svh` com `clamp()`; demais seções fluem.

## 4. Padrões compartilhados

| Padrão | Como |
|---|---|
| Leitura de conteúdo | Componente `async` por seção, dentro de `<Suspense fallback={<Skeleton …/>}>`. A página em si é síncrona e só compõe. |
| Cabeçalho de seção | `SectionHeading` (`eyebrow`, `title`, `description`, `as`, `marker`, `actions`). |
| Vazio | `EmptyState` com texto honesto ("Nenhum curso publicado para estes filtros"). |
| Carregando | `Skeleton` com a mesma silhueta da lista (altura e colunas). |
| Erro | `error.tsx` da rota (público: `src/app/(public)/error.tsx`, já existe) — ver `erro.md` (a escrever). |
| 404 | `notFound()` dentro do componente async; página em `nao-encontrado.md` (a escrever). |
| Links rastreáveis | `TrackedLink` com `eventType` `ROADMAP_CLICK`, `COURSE_CLICK`, `PROJECT_CLICK`, `CAREER_NAVIGATION`, `EXTERNAL_LINK_CLICK`; externos com `rel="noopener noreferrer" target="_blank"` e texto "(abre em nova aba)" em `sr-only`. |
| Badges | `Badge` do shadcn: nível (`skillLevelLabel`), idioma ("Português"/"Inglês"), **"Documentação oficial"** quando `isOfficialDocs`. |
| Movimento | `Reveal` (fade + 16 px) por bloco; nada em loop; `useReducedMotion` já tratado no componente; CSS global zera transições com `prefers-reduced-motion`. |
| Metadata | `export const metadata = buildPageMetadata(...)` em páginas estáticas; `generateMetadata` nas dinâmicas (aguarda `params`). |
| Filtros por URL | `searchParams` lidos dentro de `<Suspense>`, validados com Zod, aplicados no repositório; formulário `GET` nativo (funciona sem JS). |

### 4.1 Componentes novos propostos (contratos)

| Componente | Local | Contrato |
|---|---|---|
| `ResourceCard` | `src/features/courses/components/resource-card.tsx` | `{ course: CourseSummary }` → `PaperCard` com badges (nível, idioma, oficial), título como `TrackedLink` externo (`COURSE_CLICK`), provedor, tópicos como `TopicChip[]`. |
| `TopicChip` | `src/components/design-system/topic-chip.tsx` | `{ topic: TopicSummary; href?: string }` → `Badge variant="secondary"`; com `href`, vira link para `/cursos?topico=<slug>`. |
| `LevelBadge` | `src/components/design-system/level-badge.tsx` | `{ level: SkillLevel }` → badge com cor por nível (iniciante verde, intermediário amarelo, avançado coral) e rótulo de `skillLevelLabel`. |
| `FilterBar` | `src/components/design-system/filter-bar.tsx` | `{ action: string; fields: Array<{ name; label; options; value? }>; resetHref }` → `<form method="get">` com `<select>` nativos e botões "Filtrar"/"Limpar"; Server Component. |
| `PaperPanel` | `src/components/design-system/paper-panel.tsx` | `{ title?; children }` → superfície grande de papel (`.dp-paper-texture`, raio irregular) para blocos de leitura (detalhe de roadmap/etapa). |
| `StepTimeline` | `src/features/roadmaps/components/step-timeline.tsx` | `{ steps: RoadmapStepItem[]; coursesByTopic?: Record<string, CourseSummary[]>; project?: ProjectSummary }` → `ol` com `RoadmapStep` + bloco de recursos por etapa. |
| `StepSideNav` | `src/features/roadmaps/components/step-side-nav.tsx` | `{ steps: Pick<RoadmapStepItem,"order"\|"title">[] }` → lista numerada de âncoras `#etapa-N`, `sticky` em `lg`. Client? Não: âncoras puras. |
| `MarkdownContent` | `src/components/design-system/markdown-content.tsx` | `{ source: string }` → renderização **segura** de subconjunto Markdown; decisão em [`projeto-detalhe.md`](projeto-detalhe.md) §13. |
| `Breadcrumbs` | `src/components/layout/breadcrumbs.tsx` | `{ items: Array<{ label; href? }> }` → `nav aria-label="Trilha"` + `ol`. |
| `MuralSection` | `src/components/design-system/mural-section.tsx` | `{ children; className? }` → `section` com fundo do mural (`hero-background.webp` via `next/image fill` + vinheta) e texto claro. |
| `ComingSoonBlock` | `src/components/feedback/coming-soon-block.tsx` | `{ title; reason; reference }` → bloco honesto "em breve" (usado em Mercado/estatísticas). |
| `ObjectSticker` | `src/components/design-system/object-sticker.tsx` | `{ src; alt?; width; height; className }` → `next/image` de um objeto recortado (`objects/*.webp`), `aria-hidden` quando `alt` vazio, sombra de adesivo. |

### 4.2 Métodos de dados novos propostos (`ContentRepository` + `content-service`)

| Método | Contrato | Usado em |
|---|---|---|
| `listCourses(filter?: CourseFilter)` | `CourseFilter = { level?: SkillLevel; language?: string; careerSlug?: string; topicSlug?: string }`; filtro aplicado no repositório (demo: em memória; Prisma: `where`). Sem filtro, comportamento atual. | Cursos (lista), Roadmap detalhe |
| `listCoursesForTopics(topicSlugs: string[])` | `Promise<Record<string, CourseSummary[]>>` (chave = slug do tópico; só publicados). | Roadmap detalhe |
| `getProjectBySlug(slug)` | `Promise<ProjectDetail \| null>`; `ProjectDetail extends ProjectSummary { acceptance?: string; careerTitle?: string; technologies: TechnologySummary[] }`. | Projeto detalhe |
| `listProjects(filter?: { level?; careerSlug? })` | Como cursos. | Projetos (lista) |
| `listTechnologiesWithCareers()` | `Promise<TechnologyWithCareers[]>`, `TechnologyWithCareers extends TechnologySummary { careers: Array<{ slug; title; importance }> }`. | Mercado |
| `listRoadmaps(filter?: { careerSlug? })` | Como cursos. | Roadmaps (lista), Carreira detalhe |

Os tipos entram em `src/types/content.ts`; a implementação demo filtra os arrays; a Prisma traduz para `where`/`include`. Testes unitários do repositório demo cobrem cada filtro.

## 5. Regras de conteúdo

- Nenhum contador ou estatística sem fonte e data visíveis ao lado do número.
- Cursos: só gratuitos; "Documentação oficial" aparece como badge quando `isOfficialDocs`; idioma sempre sinalizado.
- Figuras históricas: fatos datados; citações só com fonte (hoje **não há** citações com fonte no conteúdo demo → não exibir).
- Tecnologias: catálogo, sem ranking.
- Texto de interface em pt-BR; nomes de tecnologias no original.
- Imagens de personagens e objetos com `alt` descritivo quando carregam significado; `alt=""` + `aria-hidden` quando decorativas.

## 6. Do mockup, o que NÃO entra (e o substituto honesto)

| Elemento do mockup | Por que não | Substituto |
|---|---|---|
| Busca global no cabeçalho | RF-12 fora do MVP | Navegação por seções; filtros por URL em Cursos e Projetos |
| Avatar / "Entrar" / "Meu progresso" / perfil (tela 09) | ADR 0012 | Nenhum; a tela 09 não existe |
| Checkbox de conclusão, barra "0 de 6 concluídos", "0%" | Progresso em conta é cadastro disfarçado | Etapa numerada + "Próxima etapa" como link |
| "+10.000 pessoas já estão evoluindo", avatares | RNF-02 | Nada |
| Percentuais de habilidades, faixas salariais, "vagas reais" | RF-06/RNF-02 | `ComingSoonBlock` com critério de entrada (fonte + data) |
| "Assistir apresentação" | Não há vídeo | "Ver carreiras" |
| "Baixar roadmap (PDF)" | Fora do MVP | Nenhum (página é imprimível com `@media print` simples) |
| "Começar agora" como login | — | CTA leva a `/carreiras` |

## 7. Ordem de implementação recomendada

1. Infra comum: `LevelBadge`, `TopicChip`, `Breadcrumbs`, `PaperPanel`, `ObjectSticker`, `MuralSection`, filtros no repositório + testes.
2. [`roadmap-detalhe.md`](roadmap-detalhe.md) (tela mais rica; define `StepTimeline`).
3. [`roadmaps-lista.md`](roadmaps-lista.md) e [`carreira-detalhe.md`](carreira-detalhe.md) (reutilizam cartões).
4. [`cursos-lista.md`](cursos-lista.md) (`FilterBar`, `ResourceCard`).
5. [`projetos-lista.md`](projetos-lista.md) + [`projeto-detalhe.md`](projeto-detalhe.md) (decidir Markdown).
6. [`carreiras-lista.md`](carreiras-lista.md), `mercado.md` (a escrever), `lendas-galeria.md` (a escrever), `lenda-detalhe.md` (a escrever).
7. [`home.md`](home.md) seções abaixo da hero; `sobre.md` (a escrever); `nao-encontrado.md` (a escrever); `erro.md` (a escrever).
8. Atualizar `sitemap.ts` (projetos), `CHECKLIST-E2E-STAGING.md`, `DESIGN.md`, `CHANGELOG.md`.

## 8. Telas → specs

| # mockup | Tela | Rota | Spec | Status |
|---|---|---|---|---|
| 01 | Home | `/` | [`home.md`](home.md) | hero implementada; seções abaixo propostas |
| 02 | Carreiras (lista) | `/carreiras` | [`carreiras-lista.md`](carreiras-lista.md) | proposta |
| 02/03 | Carreira (detalhe) | `/carreiras/[slug]` | [`carreira-detalhe.md`](carreira-detalhe.md) | proposta |
| 02 | Roadmaps (lista) | `/roadmaps` | [`roadmaps-lista.md`](roadmaps-lista.md) | proposta |
| 03 | Roadmap (detalhe) | `/roadmaps/[slug]` | [`roadmap-detalhe.md`](roadmap-detalhe.md) | proposta |
| 04 | Cursos | `/cursos` | [`cursos-lista.md`](cursos-lista.md) | proposta |
| 06 | Projetos (lista) | `/projetos` | [`projetos-lista.md`](projetos-lista.md) | proposta |
| 06 | Projeto (detalhe) | `/projetos/[slug]` | [`projeto-detalhe.md`](projeto-detalhe.md) | proposta (rota nova) |
| 05 | Mercado | `/mercado` | `mercado.md` (a escrever) | **spec a escrever** |
| 07 | Lendas (galeria) | `/lendas-da-ti` | `lendas-galeria.md` (a escrever) | **spec a escrever** |
| 07 | Lenda (detalhe) | `/lendas-da-ti/[slug]` | `lenda-detalhe.md` (a escrever) | **spec a escrever** |
| 08 | Sobre | `/sobre` | `sobre.md` (a escrever) | **spec a escrever** |
| — | 404 | `not-found` | `nao-encontrado.md` (a escrever) | **spec a escrever** |
| — | Erro | `error.tsx` | `erro.md` (a escrever) | **spec a escrever** |
| 09 | Perfil do usuário | — | **não existe** (ADR 0012) | — |

Painel: [`painel-admin-autenticacao.md`](painel-admin-autenticacao.md) (implementada), `admin-dashboard.md` (a escrever), `admin-crud-conteudo.md` (a escrever), `admin-analytics.md` (a escrever).

## 9. Critérios de aceite transversais

| # | Given / When / Then | Prova |
|---|---|---|
| 1 | Dado qualquer rota pública, quando carregada sem JS, então o conteúdo principal e os links funcionam | e2e com `javaScriptEnabled: false` na home e em `/cursos?nivel=BEGINNER` |
| 2 | Dado 390 px de largura, quando qualquer página pública abre, então não há rolagem horizontal | e2e: `document.documentElement.scrollWidth <= 390` |
| 3 | Dado `prefers-reduced-motion: reduce`, quando a página carrega, então nenhum elemento anima | e2e com `reducedMotion: "reduce"` + checagem de `transition-duration` |
| 4 | Dado conteúdo em rascunho, quando qualquer lista/detalhe/sitemap é requisitado, então ele não aparece | testes do repositório demo + e2e `/carreiras/seguranca-da-informacao` → 404 na 2ª visita |
| 5 | Dado uma página pública, então existe exatamente um `h1` e landmarks `header/nav/main/footer` | e2e por página (axe opcional) |

## 10. Impacto em documentação

`DESIGN.md` (componentes novos), `ARCHITECTURE.md` (métodos novos do repositório), `DATABASE.md` (sem tabela nova; `Project.acceptance` já existe), `API.md` (nenhum endpoint novo), `CHECKLIST-E2E-STAGING.md` (cenários PUB-*), `CHANGELOG.md`.

## 11. Pendências

- `[PRECISA ESCLARECER: renderização de Markdown nos critérios de projeto — subconjunto próprio ou dependência com ADR? ver projeto-detalhe.md]`
- `[PRECISA ESCLARECER: citações de figuras históricas — haverá curadoria com fonte? até lá, não exibir]`
- `[PRECISA ESCLARECER: fonte oficial para estatísticas de mercado (ex.: pesquisa pública com data) — sem isso o bloco fica "em breve"]`
