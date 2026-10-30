# Cursos (lista) — spec

> Criado: 30/out/2026 · Autor: bootstrap (agente), a ratificar · Status: **proposta** (página-base implementada)
> Origem: mockup 04 ("Cursos gratuitos"); PRD RF-04, RNF-10
> Contrato: [SDD](../README.md) · Guarda-chuva: [`paginas-publicas-v1.md`](paginas-publicas-v1.md) · Decisões: ADR 0006 (searchParams em Suspense)
> Milestone: [M1](../../milestones/M1-hero-e-paginas-publicas.md)

Catálogo de cursos gratuitos e documentação oficial, com filtros por carreira, nível, idioma e tópico via URL (funcionam sem JavaScript). Cada cartão deixa claro provedor, idioma, nível e se é documentação oficial; o link abre o recurso em nova aba e é rastreado.

---

## 0. Constituição

| Decisão fixa | Respeita? | Nota |
|---|---|---|
| Zod em toda entrada | sim | `searchParams` validados por `courseFilterSchema`; valores inválidos são descartados, nunca erro 500. |
| Suspense para `searchParams` | sim | Leitura dentro de `<Suspense>`; a página em si é estática (shell). |
| Sem números sem fonte | sim | "N cursos encontrados" é contagem real da lista filtrada (permitido). |
| Só gratuitos | sim | `isFree` é sempre `true` no catálogo; cartão não precisa dizer "100% gratuito" (regra do produto), basta a badge "Gratuito" discreta. |

## 1. Rota, arquivos e dados

| Item | Valor |
|---|---|
| Rota | `/cursos?carreira=<slug>&nivel=<BEGINNER\|INTERMEDIATE\|ADVANCED>&idioma=<pt-BR\|en>&topico=<slug>&oficial=1` |
| Página | `src/app/(public)/cursos/page.tsx` (**FATO**: lista sem filtros) |
| Dados | **novo** `listCourses(filter?: CourseFilter)` (PROPOSTA, ver guarda-chuva §4.2); `listCareers()` para as opções do filtro; tópicos para o `<select>`: derivar dos roadmaps publicados (`listRoadmaps` + `getRoadmap`) **ou** novo `listTopics()` → `TopicSummary[]` (PROPOSTA; preferir `listTopics`) |
| Schema | `src/features/courses/schemas.ts`: `courseFilterSchema = z.object({ carreira: slug.optional(), nivel: z.enum([...]).optional(), idioma: z.enum(["pt-BR","en"]).optional(), topico: slug.optional(), oficial: z.literal("1").optional() })` com `.catch({})` por campo para ignorar inválidos |
| Filtro por carreira | cursos cujos tópicos aparecem em etapas de roadmaps publicados da carreira (demo: calcular; Prisma: `topics.some.topic.steps.some.step.roadmap.careerId`) |

## 2. Objetivos e não-objetivos

**Objetivos:** encontrar um curso gratuito por carreira/nível/idioma em ≤ 2 interações; confiar no rótulo "Documentação oficial"; voltar do roadmap com o filtro certo.
**Não-objetivos:** busca por texto; avaliações; "N aulas"/duração sem dado; vídeos embutidos.

### 2.1 Produto
- **Para quem:** Em transição de carreira; Estudante de TI.
- **Como se mede:** `COURSE_CLICK` com `path: "/cursos"`.

## 3. Requisitos (EARS)

| ID | Requisito | Prioridade |
|---|---|---|
| FR-CUR-01 | QUANDO a página carrega sem filtros O SISTEMA DEVE listar todos os cursos publicados ordenados por documentação oficial, idioma pt-BR, nível, título | obrigatório |
| FR-CUR-02 | QUANDO há filtros válidos na URL O SISTEMA DEVE aplicar todos (AND) e refletir a seleção nos controles | obrigatório |
| FR-CUR-03 | QUANDO um filtro é inválido O SISTEMA DEVE ignorá-lo silenciosamente | obrigatório |
| FR-CUR-04 | QUANDO o formulário é enviado O SISTEMA DEVE navegar via `GET` para a URL com os parâmetros (sem JS) | obrigatório |
| FR-CUR-05 | QUANDO cada curso é exibido O SISTEMA DEVE mostrar título (link externo rastreado), provedor, `LevelBadge`, idioma, badge "Documentação oficial" quando aplicável e tópicos como chips | obrigatório |
| FR-CUR-06 | QUANDO um chip de tópico é ativado O SISTEMA DEVE filtrar por esse tópico (`?topico=`) | desejável |
| FR-CUR-07 | QUANDO nenhum curso atende aos filtros O SISTEMA DEVE exibir `EmptyState` com botão "Limpar filtros" | obrigatório |
| FR-CUR-08 | QUANDO houver resultados O SISTEMA DEVE mostrar "N cursos" e os filtros ativos como chips removíveis (links) | desejável |

## 4. Wireframe

### Desktop

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [cabeçalho] (faixa do mural)                                             │
│ CURSOS (h1)  Cursos gratuitos e documentação oficial                     │ ①
│ Tudo listado aqui é gratuito…          post-it: "Conhecimento de        │
│                                         qualidade ao alcance de todos."  │
├──────────────┬───────────────────────────────────────────────────────────┤
│ FILTROS      │ 8 cursos · filtros ativos: [Iniciante ×] [Português ×]    │ ② / ③
│ (PaperCard)  │ [ResourceCard] [ResourceCard]                             │ ④ 2 col
│ Carreira ▾   │  [Documentação oficial][Iniciante][Português]             │
│ Nível ▾      │  Aprenda desenvolvimento web (MDN) ↗                      │
│ Idioma ▾     │  descrição · MDN Web Docs                                 │
│ Tópico ▾     │  chips: HTML semântico · CSS · JavaScript                 │
│ ☐ Só docs    │ [ResourceCard] [ResourceCard]                             │
│ (Filtrar)    │ …                                                         │
│ Limpar       │                                                           │
│ objeto:      │                                                           │
│ disquetes    │                                                           │
└──────────────┴───────────────────────────────────────────────────────────┘
```

### Mobile

```
┌────────────────────┐
│ CURSOS             │ ①
│ [FILTROS ▾] detalhe│ ② <details> nativo recolhido
│   Carreira ▾ …     │
│   (Filtrar) Limpar │
│ 8 cursos · chips   │ ③
│ [ResourceCard]     │ ④ 1 col
│ [ResourceCard]     │
└────────────────────┘
```

## 5. Seções

| nº | Seção | Componentes | Dados | Assets | Vazio |
|---|---|---|---|---|---|
| ① | Cabeçalho | `SectionHeading as="h1"`, `StickyNote` (xl) | — | `decorations/post-it-amarelo.svg` | — |
| ② | Filtros | `FilterBar` (`form method="get" action="/cursos"`, `select` nativos, `checkbox` "Só documentação oficial", `Button` "Filtrar", link "Limpar"); no mobile dentro de `<details><summary>` | `listCareers()`, `listTopics()`, enums | `objects/disquetes.webp` (decorativo, lg) | — |
| ③ | Resumo | contagem + chips de filtros ativos (links que removem o parâmetro) | lista filtrada | — | — |
| ④ | Lista | `ResourceCard` ×N (`PaperCard interactive`, badges, `TrackedLink COURSE_CLICK` externo, `TopicChip href`) | `listCourses(filter)` | — | `EmptyState` + "Limpar filtros" |

Componentes ②–④ dentro de um único componente async `CoursesCatalog({ searchParams })` em `<Suspense>`; o fallback mostra filtros desabilitados + 4 skeletons.

## 6. Metadata

`buildPageMetadata({ title: "Cursos gratuitos e documentação oficial", description, path: "/cursos" })` (**FATO**). Canonical fixo em `/cursos` (variações de filtro não são canônicas). Sem JSON-LD `Course` (não somos o provedor).

## 7. Acessibilidade

Formulário com `label` por controle; `fieldset`/`legend` "Filtros"; botão "Filtrar" visível (sem auto-submit); chips removíveis são links com `aria-label="Remover filtro X"`; cartões: nome acessível do link = título do curso; badges em texto; `details/summary` nativo no mobile; resultado anuncia contagem em `p aria-live="polite"`.

## 8. Movimento

`Reveal` na lista (uma vez); sem animação ao filtrar (navegação completa).

## 9. Estados

Carregando: filtros + 4 skeletons. Vazio: `EmptyState`. Inválido: ignorado. Erro: `error.tsx`.

## 10. Do mockup: o que não entra

"100% gratuito" repetido (badge discreta "Gratuito" basta — todo o catálogo é gratuito), "40 aulas"/"50 aulas" (sem dado), abas "Vídeos/Plataformas" (categorias não existem no modelo; `provider` cobre), busca por texto, avatar.

## 11. Critérios de aceite

| # | Given / When / Then | Prova |
|---|---|---|
| 1 | Dado `/cursos`, então 7 cursos publicados aparecem e o rascunho "Docker — Get started" não | e2e |
| 2 | Dado `/cursos?nivel=BEGINNER&idioma=pt-BR`, então só cursos iniciantes em português aparecem e os selects refletem a seleção | e2e |
| 3 | Dado `/cursos?nivel=XYZ`, então a lista completa aparece (filtro ignorado) | unitário do schema + e2e |
| 4 | Dado JS desabilitado, quando o formulário é enviado, então a URL muda e a lista filtra | e2e `javaScriptEnabled: false` |
| 5 | Dado `/cursos?topico=git-basico`, então "Pro Git" aparece e "Tutorial oficial do Python" não | unitário de `listCourses(filter)` (demo) |
| 6 | Dado um cartão de documentação oficial, então a badge "Documentação oficial" está presente e o link tem `rel="noopener noreferrer"` | e2e |
| e2e sugerido | `tests/e2e/cursos.spec.ts` | — |

## 12. Fora de escopo

Busca textual, favoritos, avaliações, paginação (até ~60 itens: lista completa; paginação entra quando passar disso — `[PRECISA ESCLARECER limiar]`).

## 13. Pendências

- `[PRECISA ESCLARECER: novo método listTopics() vs derivar tópicos dos roadmaps]`
- Definir mapeamento curso→carreira via tópicos (proposta acima) ou campo direto `Course.careerIds` (migration) — PROPOSTA: via tópicos, sem migration.
