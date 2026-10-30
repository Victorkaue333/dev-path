# Roadmap (detalhe) — spec

> Criado: 30/out/2026 · Autor: bootstrap (agente), a ratificar · Status: **proposta** (página-base implementada)
> Origem: mockup 03 ("Roadmap Frontend") e página "Roadmaps" (painel central da etapa); PRD RF-03, RF-04
> Contrato: [SDD](../README.md) · Guarda-chuva: [`paginas-publicas-v1.md`](paginas-publicas-v1.md) · Decisões: ADR 0006, 0012
> Milestone: [M1](../../milestones/M1-hero-e-paginas-publicas.md)

A tela mais importante do produto: a linha de etapas de um roadmap, com os tópicos de cada etapa, os cursos gratuitos relacionados a esses tópicos, o projeto sugerido e a "próxima etapa". Sem conta, sem checkbox: o visitante lê e segue; o navegador guarda a posição pela URL (`#etapa-N`).

---

## 0. Constituição

| Decisão fixa | Respeita? | Nota |
|---|---|---|
| Sem progresso em conta (ADR 0012) | sim | Mockup tem checkboxes e "0 de 6 concluídos / 0%": **não entram**. Substituto: numeração + "Próxima etapa" + âncoras. |
| Sem números sem fonte | sim | "Duração estimada 6–12 meses", "N recursos" só se reais (contagem de cursos relacionados é real). |
| Suspense em leitura | sim | |
| Só `PUBLISHED` | sim | Cursos relacionados também filtrados. |

## 1. Rota, arquivos e dados

| Item | Valor |
|---|---|
| Rota | `/roadmaps/[slug]` (+ âncora `#etapa-N`) |
| Página | `src/app/(public)/roadmaps/[slug]/page.tsx` (**FATO**: `generateStaticParams`, `generateMetadata`, `RoadmapContent` com `ol` de `RoadmapStep`) |
| Dados existentes | `getRoadmap(slug)` → `RoadmapDetail { steps[{ order, title, description, topics[] }] }` (**FATO**) |
| Dados novos | `listCoursesForTopics(topicSlugs)` → `Record<topicSlug, CourseSummary[]>` (PROPOSTA); `listProjects({ careerSlug })` para "projeto da etapa" (PROPOSTA; ver §13 sobre vínculo etapa↔projeto) |
| Componentes | `RoadmapStep` (**FATO**), novos `StepTimeline`, `StepSideNav`, `ResourceCard`, `TopicChip`, `PaperPanel`, `Breadcrumbs` |

## 2. Objetivos e não-objetivos

**Objetivos:** (a) ver todas as etapas em ordem; (b) em cada etapa, saber o que estudar (tópicos) e onde (cursos gratuitos, documentação oficial primeiro); (c) saber o que construir (projeto); (d) ir para a próxima etapa.
**Não-objetivos:** marcar concluído; PDF; estimativas de tempo sem curadoria; estatísticas de mercado.

### 2.1 Produto
- **Para quem:** Iniciante absoluto (segue a etapa 1); Em transição (pula para a etapa onde está).
- **Dor:** não saber a ordem e se perder em listas de cursos.
- **Como se mede:** `COURSE_CLICK` e `PROJECT_CLICK` com `path: "/roadmaps/<slug>"`; `targetSlug` identifica o recurso.

## 3. Requisitos (EARS)

| ID | Requisito | Prioridade |
|---|---|---|
| FR-RMD-01 | QUANDO o slug existe e está publicado O SISTEMA DEVE exibir título, carreira (link), nível, nº de etapas e descrição | obrigatório |
| FR-RMD-02 | QUANDO a página carrega O SISTEMA DEVE exibir as etapas em ordem (`order`) com número, título, descrição e tópicos | obrigatório |
| FR-RMD-03 | QUANDO uma etapa tem tópicos com cursos publicados O SISTEMA DEVE listar até 3 cursos por etapa (documentação oficial primeiro, depois idioma pt-BR, depois título) e um link "Ver todos em Cursos" com `?topico=` | obrigatório |
| FR-RMD-04 | QUANDO a carreira do roadmap tem projetos publicados O SISTEMA DEVE sugerir um projeto por etapa seguindo a regra de §13 (ou nenhum) | desejável |
| FR-RMD-05 | QUANDO há etapa seguinte O SISTEMA DEVE exibir "Próxima etapa: <título>" como âncora `#etapa-N+1` ao fim de cada etapa | obrigatório |
| FR-RMD-06 | QUANDO a largura ≥ 1024 O SISTEMA DEVE exibir uma navegação lateral fixa com as etapas (âncoras) | obrigatório |
| FR-RMD-07 | QUANDO a URL tem `#etapa-N` O SISTEMA DEVE rolar até a etapa com margem para o cabeçalho flutuante | obrigatório |
| FR-RMD-08 | QUANDO o slug não existe/não publicado O SISTEMA DEVE renderizar 404 | obrigatório |

## 4. Wireframe

### Desktop (≥ 1024)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [cabeçalho] (faixa do mural)                                                 │
│ Início › Roadmaps › Fundamentos do Front-end                                 │ ①
├──────────────────────────────────────────────────────────────────────────────┤
│ MURAL (MuralSection)                                                         │
│  [ícone monitor]  ROADMAP · Desenvolvimento Front-end (link)                 │ ② cabeçalho
│                   Fundamentos do Front-end                                   │
│                   Do primeiro arquivo HTML até uma aplicação React…          │
│                   [Iniciante] · 5 etapas            post-it: "Prática é o   │
│   ①──②──③──④──⑤  (linha de etapas horizontal, âncoras)  que transforma…"   │ ③ mini-linha
├────────────────────┬─────────────────────────────────────────────────────────┤
│ PAPEL (sticky)     │ PAPEL (PaperPanel por etapa)                            │
│ ETAPAS             │ ┌─ ① Como a web funciona ─────────────────────────────┐ │ ④ etapa
│ ● 1 Como a web…    │ │ descrição                                           │ │
│   2 HTML semântico │ │ O que você vai estudar: [HTTP básico] [DevTools]    │ │  tópicos
│   3 CSS e layout   │ │ CURSOS GRATUITOS RECOMENDADOS                       │ │  cursos
│   4 JavaScript     │ │ [ResourceCard][ResourceCard][ResourceCard]          │ │
│   5 Git e deploy   │ │  Ver todos sobre estes tópicos → /cursos?topico=…   │ │
│                    │ │ PROJETO DA ETAPA (nota de papel)                    │ │  projeto
│ (Ver carreira →)   │ │  Página de perfil pessoal [Iniciante]  Ver →        │ │
│                    │ │ Próxima etapa: HTML semântico →  (#etapa-2)         │ │
│                    │ └─────────────────────────────────────────────────────┘ │
│                    │ ┌─ ② HTML semântico … ┐ …                                │
├────────────────────┴─────────────────────────────────────────────────────────┤
│ nota de papel: "Terminou? Explore outros roadmaps" (Todos os roadmaps →)     │ ⑤
└──────────────────────────────────────────────────────────────────────────────┘
```

### Mobile

```
┌────────────────────┐
│ Início › Roadmaps  │ ①
│ MURAL              │ ②
│ Fundamentos do…    │
│ [Iniciante] 5 et.  │
│ ①─②─③─④─⑤ (scroll) │ ③ linha horizontal rolável
│ PAPEL              │
│ ① Como a web…      │ ④ etapas empilhadas
│  tópicos (chips)   │
│  cursos (1 col)    │
│  projeto (nota)    │
│  Próxima etapa →   │
│ ② …                │
│ nota final         │ ⑤
└────────────────────┘
```

## 5. Seções

| nº | Seção | Componentes | Dados | Assets | Vazio |
|---|---|---|---|---|---|
| ① | Trilha | `Breadcrumbs` | — | — | — |
| ② | Cabeçalho | `MuralSection`, `SectionHeading as="h1"` (texto claro), ícone Lucide da carreira, `Badge` carreira (link), `LevelBadge`, "N etapas", `StickyNote` (xl) | `RoadmapDetail` | `textures/hero-background.webp`, `decorations/seta-marker.svg` | — |
| ③ | Mini-linha | `ol` horizontal de círculos numerados (âncoras), conectados por linha tracejada; `overflow-x-auto` no mobile | `steps` | — | — |
| ④ | Etapas | `StepTimeline` → por etapa `PaperPanel id="etapa-N"` com `RoadmapStep` (número + título + descrição + `TopicChip[]`), bloco "Cursos gratuitos recomendados" (`ResourceCard` ×≤3 + link), bloco "Projeto da etapa" (nota de papel `objects/nota-papel-rasgado.webp` + `LevelBadge` + link `PROJECT_CLICK`), "Próxima etapa" | `getRoadmap`, `listCoursesForTopics`, `listProjects({careerSlug})` | `objects/monitor-crt-terminal.webp` (etapa 1, decorativo), `decorations/bulb-rabisco.svg` | cursos: texto "Ainda sem cursos para estes tópicos"; projeto: bloco omitido |
| ⑤ | Fechamento | `PaperCard torn` + `Button` → `/roadmaps` | — | — | — |
| lateral | `StepSideNav` (`lg:sticky top-28`) | `steps` | — | — |

Regra de ordenação dos cursos por etapa: `isOfficialDocs` desc → `language === "pt-BR"` desc → `title` asc; limite 3; link "Ver todos" aponta para `/cursos?topico=<primeiro tópico>` (ver [`cursos-lista.md`](cursos-lista.md)).

## 6. Metadata

`generateMetadata` (**FATO**): `title: "Roadmap: <título>"`, `description` do roadmap, canonical `/roadmaps/<slug>`. JSON-LD `HowTo`/`Course` **não** entra agora (pendência global: só com domínio e conteúdo curado).

## 7. Acessibilidade

- `h1` = título; cada etapa `h2` ("Etapa N: título", com `sr-only` para "Etapa N:" como já faz `RoadmapStep`); blocos internos `h3`.
- Âncoras com `scroll-margin-top: 7rem` (cabeçalho flutuante); alvo recebe `tabIndex={-1}` e foco programático só se navegação interna (CSS `:target` para destaque visual).
- Mini-linha: `nav aria-label="Etapas"`; círculos são links com texto "Etapa N".
- Lateral: `nav aria-label="Navegação das etapas"`; item atual via `aria-current="location"`? Sem JS não há "atual": omitir `aria-current` (CSS `:target` apenas).
- Cursos: título é o link externo com `rel`/`target` + `sr-only`.
- Contraste: texto claro sobre mural só no cabeçalho; etapas em papel.

## 8. Movimento

`Reveal` por `PaperPanel` (uma vez). Linha tracejada estática. Sem animação de "progresso".

## 9. Estados

| Estado | Comportamento |
|---|---|
| Carregando | `Skeleton` h-96 (**FATO**) → trocar por silhueta: cabeçalho + 2 painéis |
| Sem cursos para a etapa | frase curta + link para `/cursos` |
| Sem projeto | bloco omitido |
| Slug inválido | 404 (**FATO**: `notFound()`; comportamento 200/404 conhecido) |
| Erro | `error.tsx` |

## 10. Do mockup: o que não entra (e por quê)

| Elemento | Motivo | Substituto |
|---|---|---|
| Checkboxes por recurso, "0 de 6 concluídos", "0%" | progresso em conta (ADR 0012); progresso só no navegador seria frágil e enganoso | numeração, âncoras `#etapa-N`, "Próxima etapa" |
| "Baixar roadmap (PDF)" | fora do MVP | `@media print` simples (esconder cabeçalho/decoração) |
| "Tempo estimado 6–12 meses", "Duração 2–4 semanas" | sem curadoria/fonte | nada; `[PRECISA ESCLARECER]` campo futuro |
| "Mercado de trabalho: HTML 92%…" | sem fonte | nada (ver `mercado.md` (a escrever)) |
| Abas "Visão geral / Cursos gratuitos / Projetos / O que o mercado pede" | conteúdo cabe em uma página; abas exigem JS | seções empilhadas |
| "Recursos em destaque" com YouTube/vídeos | só cursos do catálogo (gratuitos, com `provider`) | `ResourceCard` |

## 11. Critérios de aceite

| # | Given / When / Then | Prova |
|---|---|---|
| 1 | Dado `/roadmaps/fundamentos-do-front-end`, então há 5 `h2` de etapa em ordem 1..5 | e2e (**existe** teste de contagem; estender para ordem) |
| 2 | Dado a etapa 1 (tópicos `http-basico`, `navegador-e-devtools`), então "Cursos gratuitos recomendados" lista cursos cujos `topicSlugs` incluem um deles, documentação oficial primeiro | unitário de `listCoursesForTopics` (demo) + e2e |
| 3 | Dado cada etapa exceto a última, então existe link "Próxima etapa" para `#etapa-N+1`; a última não tem | e2e |
| 4 | Dado `#etapa-3` na URL, então a etapa 3 fica visível abaixo do cabeçalho (não coberta) | e2e: `boundingBox().y >= 100` |
| 5 | Dado 1024 px, então a navegação lateral está fixa ao rolar | e2e (`position: sticky` + offset) |
| 6 | Dado nenhum curso publicado para os tópicos, então aparece "Ainda sem cursos…" e nenhum erro | unitário com repositório falso |
| e2e sugerido | `tests/e2e/roadmap-detalhe.spec.ts` | — |

## 12. Fora de escopo

Progresso, PDF, comentários, avaliação de cursos, estimativa de tempo, vídeos embutidos.

## 13. Pendências e decisões

- **Vínculo etapa ↔ projeto.** O modelo não liga `Project` a `RoadmapStep` (só a `Career`). PROPOSTA mínima: sugerir projetos da carreira por nível crescente (etapa 1 → primeiro projeto `BEGINNER`, última etapa → último), sem repetir; alternativa: nova coluna `Project.suggestedStepId` (migration) — `[PRECISA ESCLARECER]`.
- `[PRECISA ESCLARECER: campo curado de duração estimada por etapa/roadmap — incluir no schema ou nunca exibir?]`
- Método novo `listCoursesForTopics` exige testes no repositório demo e implementação Prisma (`course.findMany({ where: { status: PUBLISHED, topics: { some: { topic: { slug: { in } } } } } })`).
