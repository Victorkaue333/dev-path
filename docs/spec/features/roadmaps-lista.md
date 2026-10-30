# Roadmaps (lista) — spec

> Criado: 30/out/2026 · Autor: bootstrap (agente), a ratificar · Status: **proposta** (página-base implementada)
> Origem: mockup "Roadmaps" (página inteira) e 02; PRD RF-03
> Contrato: [SDD](../README.md) · Guarda-chuva: [`paginas-publicas-v1.md`](paginas-publicas-v1.md)
> Milestone: [M1](../../milestones/M1-hero-e-paginas-publicas.md)

Lista os roadmaps publicados agrupados por carreira, com nível e número de etapas, e dá um atalho por carreira no topo (cartões de papel rasgado, como no mockup). Quem já sabe a carreira vai direto ao roadmap.

---

## 0. Constituição

Todas: **sim**. Sem "seu progresso" e sem PDF.

## 1. Rota, arquivos e dados

| Item | Valor |
|---|---|
| Rota | `/roadmaps` (+ `?carreira=<slug>` para pré-selecionar o grupo) |
| Página | `src/app/(public)/roadmaps/page.tsx` (**FATO**: grade simples de `PaperCard`) |
| Dados | `listRoadmaps()` (**FATO**, ordenado por carreira e `order`) + `listCareers()`; **novo** `listRoadmaps({ careerSlug })` opcional |
| Filtro | `searchParams.carreira` lido em componente async dentro de `<Suspense>`; schema Zod `z.object({ carreira: slug.optional() })` em `src/features/roadmaps/schemas.ts` |

## 2. Objetivos e não-objetivos

**Objetivos:** escolher carreira → ver seus roadmaps; entender nível e tamanho antes de abrir.
**Não-objetivos:** progresso; download; comparação.

### 2.1 Produto
- **Para quem:** Em transição de carreira.
- **Como se mede:** `ROADMAP_CLICK` com `path: "/roadmaps"`.

## 3. Requisitos (EARS)

| ID | Requisito | Prioridade |
|---|---|---|
| FR-RML-01 | QUANDO a página carrega O SISTEMA DEVE exibir a faixa de carreiras publicadas (papel rasgado) com link âncora para o grupo correspondente | obrigatório |
| FR-RML-02 | QUANDO a página carrega O SISTEMA DEVE listar roadmaps publicados agrupados por carreira (ordem da carreira, depois `order`) | obrigatório |
| FR-RML-03 | QUANDO `?carreira=<slug>` é válido O SISTEMA DEVE mostrar só esse grupo e um link "Ver todos" | obrigatório |
| FR-RML-04 | QUANDO `?carreira` é inválido O SISTEMA DEVE ignorar o filtro (sem erro) | obrigatório |
| FR-RML-05 | QUANDO cada cartão é exibido O SISTEMA DEVE mostrar carreira, `LevelBadge`, "N etapas" (real) e descrição | obrigatório |
| FR-RML-06 | QUANDO não houver roadmaps O SISTEMA DEVE exibir `EmptyState` | obrigatório |

## 4. Wireframe

### Desktop

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [cabeçalho] (faixa do mural)                                             │
│ ROADMAPS (h1, marker)      post-it: "Disciplina hoje, liberdade amanhã." │ ①
│ Escolha uma carreira, siga um caminho…                                   │
├──────────────────────────────────────────────────────────────────────────┤
│ [Frontend][Backend][Full Stack][DevOps][Dados][IA]  ← HeroCareerCard     │ ② faixa de carreiras
│  "1 roadmap"  "1 roadmap"  "—"  …  (âncora #carreira-<slug>)             │   (papel rasgado)
├──────────────────────────────────────────────────────────────────────────┤
│ ## Desenvolvimento Front-end                               (Ver carreira)│ ③ grupo
│ [PaperCard] Fundamentos do Front-end  [Iniciante] 5 etapas               │
│   descrição…                                                  Abrir →    │
│ ## Desenvolvimento Back-end                                              │
│ [PaperCard] Fundamentos do Back-end   [Iniciante] 4 etapas               │
│ ## Full Stack  — EmptyState compacto "Roadmap em preparação"             │
├──────────────────────────────────────────────────────────────────────────┤
│ objeto decorativo: objects/fita-perfurada.webp (canto inferior direito)  │
└──────────────────────────────────────────────────────────────────────────┘
```

### Mobile

```
┌────────────────────┐
│ ROADMAPS           │ ①
│ [card][card]       │ ② grade 2 col
│ [card][card]       │
│ [card][card]       │
│ ## Front-end       │ ③ 1 col
│ [PaperCard]        │
│ ## Back-end        │
│ [PaperCard]        │
└────────────────────┘
```

## 5. Seções

| nº | Seção | Componentes | Dados | Assets | Vazio |
|---|---|---|---|---|---|
| ① | Cabeçalho | `SectionHeading as="h1" marker`, `StickyNote` (xl) | — | `decorations/coroa.svg` | — |
| ② | Faixa de carreiras | `ul` de `HeroCareerCard` (reuso) com `href="#carreira-<slug>"`; contagem de roadmaps publicados ou "—" | `listCareers()` + contagem de `listRoadmaps()` | `objects/nota-papel-rasgado.webp` | omitida |
| ③ | Grupos | por carreira: `h2` com `id="carreira-<slug>"`, link "Ver carreira", lista de `PaperCard interactive` com `LevelBadge`, "N etapas", `TrackedLink ROADMAP_CLICK` | `listRoadmaps(filter)` | — | `EmptyState` compacto por grupo; `EmptyState` geral se nada |

`HeroCareerCard` precisa aceitar `href` opcional (hoje fixo em `/carreiras/<slug>`) — PROPOSTA: prop `href?: string`.

## 6. Metadata

`buildPageMetadata({ title: "Roadmaps de aprendizado", description: "...", path: "/roadmaps" })` (**FATO**). Com `?carreira=`, canonical continua `/roadmaps` (filtro não indexável; adicionar `robots: { index: false }` quando houver `searchParams`? **Não**: manter indexável só a versão sem filtro via canonical).

## 7. Acessibilidade

Âncoras da faixa levam o foco ao `h2` (`tabIndex={-1}` no `h2` + `scroll-margin-top` para o cabeçalho flutuante); "N etapas" em texto; `LevelBadge` com texto; `h1` único.

## 8. Movimento

`Reveal` por grupo; faixa sem animação (acima da dobra).

## 9. Estados

Carregando: `Skeleton` 6 cartões + 2 grupos. Vazio: `EmptyState`. Filtro inválido: ignorado. Erro: `error.tsx`.

## 10. Do mockup: o que não entra

"Seu progresso 0 de 7 etapas", "Baixar roadmap (PDF)", "Mercado de trabalho" com percentuais (HTML 92% etc.), "Duração estimada 2–4 semanas" (sem campo curado), citações de Ada/Turing/Hopper (sem fonte), busca.

## 11. Critérios de aceite

| # | Given / When / Then | Prova |
|---|---|---|
| 1 | Dado conteúdo demo, então há 2 grupos com roadmaps (Front-end, Back-end) e o grupo "Dados" mostra "Roadmap em preparação" (rascunho não aparece) | e2e |
| 2 | Dado `/roadmaps?carreira=desenvolvimento-back-end`, então só o grupo Back-end aparece e há link "Ver todos" | e2e |
| 3 | Dado `/roadmaps?carreira=<invalido>`, então todos os grupos aparecem (sem erro) | e2e + unitário do schema |
| 4 | Dado um cartão de carreira na faixa, quando ativado, então o `h2` do grupo recebe foco | e2e (`toBeFocused`) |
| e2e sugerido | `tests/e2e/roadmaps.spec.ts` | — |

## 12. Fora de escopo

Progresso, PDF, ordenação customizada, estatísticas.

## 13. Pendências

- Confirmar reuso de `HeroCareerCard` fora da hero (renomear para `CareerPaperCard` em `src/features/careers/components/` — PROPOSTA de refactor sem mudança visual).
