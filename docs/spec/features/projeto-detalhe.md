# Projeto (detalhe) — spec

> Criado: 30/out/2026 · Autor: bootstrap (agente), a ratificar · Status: **proposta** (rota nova)
> Origem: mockup 06 (cartões com "Ver detalhes"); PRD RF-05 ("detalhe com critérios de conclusão")
> Contrato: [SDD](../README.md) · Guarda-chuva: [`paginas-publicas-v1.md`](paginas-publicas-v1.md) · Decisões: ADR 0006; **possível ADR nova** (Markdown)
> Milestone: [M1](../../milestones/M1-hero-e-paginas-publicas.md)

Página de um projeto prático: o que construir, para qual carreira e nível, com quais tecnologias, e os critérios de conclusão (lista de verificação em Markdown simples). Sem entrega, sem nota, sem conta.

---

## 0. Constituição

| Decisão fixa | Respeita? | Nota |
|---|---|---|
| Dependência nova → ADR | **depende** | Opção A (sem dependência) vs B (`react-markdown` + `remark-gfm`): ver §13. |
| Segurança | sim | Nunca `dangerouslySetInnerHTML` com conteúdo do banco; sem HTML bruto. |
| Só `PUBLISHED` | sim | |

## 1. Rota, arquivos e dados

| Item | Valor |
|---|---|
| Rota | `/projetos/[slug]` (**nova**) |
| Página | `src/app/(public)/projetos/[slug]/page.tsx` com `generateStaticParams` (slugs publicados), `generateMetadata`, `ProjectContent` em `<Suspense>`, `notFound()` |
| Dados | **novo** `getProjectBySlug(slug)` → `ProjectDetail extends ProjectSummary { acceptance?: string; careerTitle?: string; technologies: TechnologySummary[] }` |
| Modelo | `Project.acceptance String?` **já existe** (**FATO**: schema e demo-data com bullets Markdown) |
| Sitemap | adicionar projetos publicados em `src/app/sitemap.ts` |
| Componentes | `Breadcrumbs`, `PaperPanel`, `LevelBadge`, `TechChip`, `MarkdownContent` (novo), `ObjectSticker` |

## 2. Objetivos e não-objetivos

**Objetivos:** entender o projeto em 30 s; saber quando está "pronto" (critérios); voltar à carreira/roadmap.
**Não-objetivos:** upload, avaliação, fórum, template de repositório (pode virar link externo curado no futuro).

### 2.1 Produto
- **Para quem:** Estudante de TI; Em transição (portfólio).
- **Como se mede:** `PROJECT_CLICK` de origem (lista/roadmap/carreira) + `PAGE_VIEW` do detalhe.

## 3. Requisitos (EARS)

| ID | Requisito | Prioridade |
|---|---|---|
| FR-PRD-01 | QUANDO o slug existe e está publicado O SISTEMA DEVE exibir título, `LevelBadge`, carreira (link), tecnologias (nome + link externo quando houver) e descrição | obrigatório |
| FR-PRD-02 | QUANDO `acceptance` existir O SISTEMA DEVE renderizá-lo como lista de verificação **estática** (sem checkbox interativo) a partir de Markdown restrito | obrigatório |
| FR-PRD-03 | QUANDO `acceptance` contiver HTML ou sintaxe fora do subconjunto O SISTEMA DEVE exibir como texto escapado (nunca executar) | obrigatório |
| FR-PRD-04 | QUANDO a carreira tiver roadmap publicado O SISTEMA DEVE sugerir "Estude antes: <roadmap>" | desejável |
| FR-PRD-05 | QUANDO houver outros projetos da mesma carreira O SISTEMA DEVE listar até 3 em "Continue praticando" | desejável |
| FR-PRD-06 | QUANDO o slug não existe/não publicado O SISTEMA DEVE renderizar 404 | obrigatório |

## 4. Wireframe

### Desktop

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Início › Projetos › API de tarefas com banco de dados                    │ ①
├──────────────────────────────────────────────┬───────────────────────────┤
│ PROJETO · Desenvolvimento Back-end (link)    │ FICHA (PaperCard)         │ ② / ③
│ API de tarefas com banco de dados (h1)       │ Nível: Intermediário      │
│ [Intermediário]                              │ Carreira: Back-end →      │
│ descrição                                    │ Tecnologias: Node.js ↗    │
│                                              │  SQL · PostgreSQL · Docker│
│ CRITÉRIOS DE CONCLUSÃO (PaperPanel)          │ Estude antes:             │
│  ☐ Rotas documentadas (GET/POST/PUT/DELETE)  │  Fundamentos do Back-end →│
│  ☐ Erros retornam JSON padronizado           │ objeto: placa-de-circuito │
│  ☐ Banco sobe com Docker Compose             │                           │
│  (caixas decorativas, não interativas)       │                           │
├──────────────────────────────────────────────┴───────────────────────────┤
│ CONTINUE PRATICANDO  [PaperCard][PaperCard]                              │ ④
└──────────────────────────────────────────────────────────────────────────┘
```

### Mobile

```
┌────────────────────┐
│ Início › Projetos  │ ①
│ PROJETO · Back-end │ ②
│ Título (h1)        │
│ [Intermediário]    │
│ descrição          │
│ FICHA              │ ③ (abaixo)
│ CRITÉRIOS          │
│  ☐ …               │
│ CONTINUE PRATICANDO│ ④ 1 col
└────────────────────┘
```

## 5. Seções

| nº | Seção | Componentes | Dados | Assets | Vazio |
|---|---|---|---|---|---|
| ① | Trilha | `Breadcrumbs` | — | — | — |
| ② | Cabeçalho + critérios | `SectionHeading as="h1"`, `LevelBadge`, `PaperPanel` "Critérios de conclusão" com `MarkdownContent` | `ProjectDetail` | `decorations/chaves-codigo.svg` | critérios ausentes → painel omitido |
| ③ | Ficha | `PaperCard` com `dl` (nível, carreira, tecnologias com `TechChip`, "Estude antes") | `ProjectDetail`, `listRoadmaps({ careerSlug })` | `objects/placa-de-circuito.webp` | linhas omitidas |
| ④ | Relacionados | `PaperCard` ×≤3 | `listProjects({ careerSlug })` menos o atual | — | omitida |

## 6. Metadata

`generateMetadata`: `title: project.title`, `description: project.description`, canonical `/projetos/<slug>`. Sem JSON-LD.

## 7. Acessibilidade

`h1` único; critérios como `ul` com ícone decorativo de caixa (`aria-hidden`) — **não** `input type=checkbox` (evita sugerir estado salvo); `dl` na ficha; links externos com `rel`/`target` + `sr-only`.

## 8. Movimento

`Reveal` em ② e ④.

## 9. Estados

Carregando: skeleton h-96. 404: `notFound()`. Sem `acceptance`: painel omitido. Erro: `error.tsx`.

## 10. Do mockup: o que não entra

Thumbnails prontos; "Ver detalhes" vira a própria página; avatar.

## 11. Critérios de aceite

| # | Given / When / Then | Prova |
|---|---|---|
| 1 | Dado `/projetos/api-de-tarefas-com-banco`, então `h1` é o título e os 3 critérios aparecem como itens de lista | e2e |
| 2 | Dado `acceptance = "- item <img src=x onerror=alert(1)>"`, então o texto aparece escapado e nenhum script roda | unitário de `MarkdownContent` (jsdom) |
| 3 | Dado `/projetos/analise-de-um-csv-publico` (rascunho), então 404 na 2ª visita | e2e |
| 4 | Dado o sitemap, então inclui `/projetos/<slug>` dos publicados e não dos rascunhos | unitário de `sitemap()` com repositório demo |
| e2e sugerido | `tests/e2e/projeto-detalhe.spec.ts` | — |

## 12. Fora de escopo

Envio/avaliação, comentários, repositório-modelo, badges de conclusão.

## 13. Decisão pendente: renderização de Markdown

| Opção | Prós | Contras |
|---|---|---|
| **A — Subconjunto próprio** (`MarkdownContent` parseia linhas `- `, `1. `, parágrafos, `` `código` `` e `**negrito**`; tudo escapado pelo React) | zero dependência; superfície de ataque mínima; suficiente para critérios | sem links/tabelas; precisa documentar o subconjunto no painel (ajuda de edição) |
| B — `react-markdown` + `remark-gfm` (sem `rehype-raw`) | Markdown completo, padrão de mercado | dependência nova → ADR; mais bundle no servidor (RSC, aceitável) |

PROPOSTA: **A** agora (critérios são listas curtas); reavaliar para B quando o painel editar conteúdo editorial longo (`EditorialContent.body`), com ADR. `[PRECISA ESCLARECER: aprovar opção A]`
