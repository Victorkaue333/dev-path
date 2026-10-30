# Carreira (detalhe) — spec

> Criado: 30/out/2026 · Autor: bootstrap (agente), a ratificar · Status: **proposta** (página-base implementada)
> Origem: mockups 02/03; PRD RF-02
> Contrato: [SDD](../README.md) · Guarda-chuva: [`paginas-publicas-v1.md`](paginas-publicas-v1.md)
> Milestone: [M1](../../milestones/M1-hero-e-paginas-publicas.md)

Página de uma carreira: o que é, por onde começar (roadmaps), o que o mercado pede (tecnologias essenciais) e projetos para praticar. É o "hub" que liga os demais conteúdos.

---

## 0. Constituição

Todas: **sim**. Tecnologias mostram importância (1–3) como rótulo ("essencial", "importante", "complementar"), não como percentual.

## 1. Rota, arquivos e dados

| Item | Valor |
|---|---|
| Rota | `/carreiras/[slug]` |
| Página | `src/app/(public)/carreiras/[slug]/page.tsx` (**FATO**: `generateStaticParams`, `generateMetadata`, `CareerContent` em `<Suspense>`, `notFound()`) |
| Dados | `getCareer(slug)` → `CareerDetail { description, roadmaps, technologies, projects }` (**FATO**) |
| Novo | `CareerTechnology.importance` precisa chegar ao DTO: estender `TechnologySummary` com `importance?: 1\|2\|3` quando vier de uma carreira (PROPOSTA) |
| Comportamento conhecido | slug desconhecido: `200` com 404 na 1ª visita, `404` depois (ADR 0006 / README) |

## 2. Objetivos e não-objetivos

**Objetivos:** da carreira ao roadmap em um clique; visão rápida das tecnologias; projetos relacionados.
**Não-objetivos:** estatísticas de vagas; "comparar".

### 2.1 Produto
- **Para quem:** Iniciante absoluto; Em transição.
- **Como se mede:** `ROADMAP_CLICK`/`PROJECT_CLICK` com `path: "/carreiras/<slug>"`.

## 3. Requisitos (EARS)

| ID | Requisito | Prioridade |
|---|---|---|
| FR-CARD-01 | QUANDO o slug existe e está publicado O SISTEMA DEVE exibir título, descrição completa, nível de entrada e ícone | obrigatório |
| FR-CARD-02 | QUANDO houver roadmaps publicados O SISTEMA DEVE listá-los com nível, nº de etapas e link rastreado | obrigatório |
| FR-CARD-03 | QUANDO houver tecnologias O SISTEMA DEVE agrupá-las por importância (essenciais primeiro) com link ao site oficial quando existir | obrigatório |
| FR-CARD-04 | QUANDO houver projetos publicados O SISTEMA DEVE listá-los com nível e link para `/projetos/<slug>` | obrigatório |
| FR-CARD-05 | QUANDO o slug não existe ou não está publicado O SISTEMA DEVE renderizar a página 404 | obrigatório |
| FR-CARD-06 | QUANDO a página carrega O SISTEMA DEVE exibir `Breadcrumbs` Início › Carreiras › <título> | desejável |

## 4. Wireframe

### Desktop

```
┌────────────────────────────────────────────────────────────────────────┐
│ [cabeçalho] (faixa do mural)                                           │
│ Início › Carreiras › Desenvolvimento Front-end                         │ ① Breadcrumbs
├────────────────────────────────────────────────────────────────────────┤
│ [ícone grande]  CARREIRA                                               │ ② cabeçalho
│                 Desenvolvimento Front-end        [Iniciante]           │
│                 descrição completa (2–4 linhas)                        │
│                 (Começar pelo roadmap →)  (Ver projetos)               │
├──────────────────────────────────────────┬─────────────────────────────┤
│ ROADMAPS                                 │ TECNOLOGIAS ESSENCIAIS      │ ③ / ④
│ [PaperCard] Fundamentos do Front-end     │ ESSENCIAIS                  │
│  [Iniciante] 5 etapas · descrição  →     │  HTML · CSS · JavaScript    │
│                                          │  Git                        │
│ PROJETOS PRÁTICOS                        │ IMPORTANTES                 │ ⑤
│ [PaperCard] Página de perfil pessoal     │  TypeScript · React         │
│  [Iniciante] descrição  →                │ COMPLEMENTARES              │
│ [PaperCard] Lista de tarefas no navegador│  —                          │
│                                          │ Ver todas no Mercado →      │
│                                          │ post-it: "Todo especialista │
│                                          │ já foi iniciante."          │
├──────────────────────────────────────────┴─────────────────────────────┤
│ OUTRAS CARREIRAS  [Backend] [Full Stack] [Dados]  (cartões compactos)  │ ⑥
└────────────────────────────────────────────────────────────────────────┘
```

### Mobile

```
┌────────────────────┐
│ Início › Carreiras │ ①
│ [ícone] Front-end  │ ②
│ [Iniciante]        │
│ descrição          │
│ (Começar →)        │
│ ROADMAPS           │ ③
│ [card]             │
│ TECNOLOGIAS        │ ④ chips em linha, quebram
│ ESSENCIAIS: chips  │
│ PROJETOS           │ ⑤
│ [card][card]       │
│ OUTRAS CARREIRAS   │ ⑥ carrossel horizontal com scroll-snap (CSS)
└────────────────────┘
```

## 5. Seções

| nº | Seção | Componentes | Dados | Assets | Vazio |
|---|---|---|---|---|---|
| ① | Trilha | `Breadcrumbs` | slug/título | — | — |
| ② | Cabeçalho | `SectionHeading as="h1"`, ícone Lucide do `icon`, `LevelBadge`, 2 `Button` | `CareerDetail` | `decorations/sublinhado-marker.svg` | — |
| ③ | Roadmaps | `PaperCard interactive` + `LevelBadge` + `TrackedLink ROADMAP_CLICK` | `career.roadmaps` | — | `EmptyState` "Roadmap em preparação" (**FATO**) |
| ④ | Tecnologias | `h2`, 3 grupos (`importance`), `TopicChip`-like `TechChip` com link externo (`EXTERNAL_LINK_CLICK`) | `career.technologies` | `objects/placa-de-circuito.webp` decorativa | grupo omitido |
| ⑤ | Projetos | `PaperCard` + `LevelBadge` + link `/projetos/<slug>` (`PROJECT_CLICK`) | `career.projects` | — | `EmptyState` "Sem projetos publicados" |
| ⑥ | Outras carreiras | `HeroCareerCard` (papel rasgado) ×3, exceto a atual | `listCareers()` | `objects/nota-papel-rasgado.webp` | omitida se < 2 |

Implementação: ②–⑤ no mesmo componente async (`CareerContent`, **FATO**); ⑥ em segundo componente async com `Suspense` próprio.

## 6. Metadata

`generateMetadata` (**FATO**) com `buildPageMetadata({ title: career.title, description: career.shortDescription, path })`; título do documento "Desenvolvimento Front-end | DevPath". Sem JSON-LD até haver domínio.

## 7. Acessibilidade

`h1` = título da carreira; `h2` por seção; grupos de tecnologia com `h3`; chips externos com `rel`/`target` e `sr-only` "(abre em nova aba)"; carrossel mobile navegável por teclado (links normais em `ul` com `overflow-x-auto`); contraste AA.

## 8. Movimento

`Reveal` nas seções ③–⑥; sem animação no cabeçalho (LCP).

## 9. Estados

Carregando: `Skeleton` h-96 (**FATO**). Vazio parcial por seção. 404: `notFound()` (**FATO**). Erro: `error.tsx`.

## 10. Do mockup: o que não entra

Barra lateral com "Todos os roadmaps / Comparar carreiras / Guia de estudos" (o guia vira seção em `/sobre`); "7 etapas / 6–12 meses" com duração inventada — duração só se o roadmap tiver campo `estimatedWeeks` com curadoria (não existe hoje); avatar/login.

## 11. Critérios de aceite

| # | Given / When / Then | Prova |
|---|---|---|
| 1 | Dado `/carreiras/desenvolvimento-front-end`, então `h1` contém o título, há 1 roadmap listado e tecnologias essenciais começam por HTML | e2e |
| 2 | Dado `/carreiras/seguranca-da-informacao` (rascunho), então a 2ª visita responde 404 com a página personalizada | e2e (duas requisições) |
| 3 | Dado o link do roadmap, quando clicado, então `trackEvent` envia `ROADMAP_CLICK` com `targetSlug` (com analytics habilitado em teste) | integração do `TrackedLink` (jsdom) |
| 4 | Dado 390 px, então "Outras carreiras" rola horizontalmente sem rolagem da página | e2e |
| e2e sugerido | `tests/e2e/carreira-detalhe.spec.ts` | — |

## 12. Fora de escopo

Estatísticas de vagas; salários; "comparar"; favoritar.

## 13. Pendências

- `[PRECISA ESCLARECER: expor `importance` no DTO de tecnologias da carreira (proposta: sim, campo opcional)]`
- `[PRECISA ESCLARECER: duração estimada por roadmap — adicionar campo curado ou nunca exibir?]`
