# Carreiras (lista) — spec

> Criado: 30/out/2026 · Autor: bootstrap (agente), a ratificar · Status: **proposta** (página-base implementada)
> Origem: mockup 02 ("Escolha sua trilha"); PRD RF-02
> Contrato: [SDD](../README.md) · Guarda-chuva: [`paginas-publicas-v1.md`](paginas-publicas-v1.md)
> Milestone: [M1](../../milestones/M1-hero-e-paginas-publicas.md)

Lista todas as carreiras publicadas em cartões de papel com ícone, nome curto, frase de impacto, descrição e acesso ao detalhe. É a porta de entrada de quem ainda não escolheu um caminho.

---

## 0. Constituição

Todas: **sim**. Sem contagem de "N etapas" inventada: o número de etapas vem do roadmap publicado da carreira (ou é omitido).

## 1. Rota, arquivos e dados

| Item | Valor |
|---|---|
| Rota | `/carreiras` |
| Página | `src/app/(public)/carreiras/page.tsx` (**FATO**: `SectionHeading` + grade de `CareerCard` dentro de `<Suspense>`) |
| Dados | `listCareers()` (**FATO**) + **novo** `listRoadmaps({ careerSlug })` ou, mais simples, estender `CareerSummary` com `roadmapCount?: number` e `entryLevel?: SkillLevel` (PROPOSTA; demo: calcular dos arrays; Prisma: `_count.roadmaps` com `where: { status: PUBLISHED }`) |
| Cartão | `CareerCard` (**FATO**) com acréscimo de `LevelBadge` e "N roadmaps" quando `roadmapCount > 0` |

## 2. Objetivos e não-objetivos

**Objetivos:** comparar carreiras em uma tela; chegar ao detalhe em um clique.
**Não-objetivos:** filtros (há ≤ 10 carreiras); "comparar carreiras" lado a lado (mockup menciona "Comparar carreiras" no menu lateral — fora do MVP).

### 2.1 Produto
- **Para quem:** Iniciante absoluto.
- **Dor:** não entende a diferença entre as áreas.
- **Como se mede:** `CAREER_NAVIGATION` com `path: "/carreiras"`.

## 3. Requisitos (EARS)

| ID | Requisito | Prioridade |
|---|---|---|
| FR-CAR-01 | QUANDO a página carrega O SISTEMA DEVE listar todas as carreiras publicadas em ordem `order` | obrigatório |
| FR-CAR-02 | QUANDO um cartão é ativado (clique/Enter) O SISTEMA DEVE navegar para `/carreiras/<slug>` e registrar `CAREER_NAVIGATION` | obrigatório |
| FR-CAR-03 | QUANDO a carreira tem roadmap publicado O SISTEMA DEVE mostrar a quantidade de roadmaps e o nível de entrada | desejável |
| FR-CAR-04 | QUANDO não houver carreiras publicadas O SISTEMA DEVE exibir `EmptyState` "Nenhuma carreira publicada" | obrigatório |
| FR-CAR-05 | QUANDO a página carrega O SISTEMA DEVE oferecer um bloco "Não sabe por onde começar?" com link para `/sobre#como-escolher` | desejável |

## 4. Wireframe

### Desktop

```
┌──────────────────────────────────────────────────────────────────────┐
│ [cabeçalho flutuante sobre faixa do mural]                           │
│ (faixa do mural 10rem)                                              │
├──────────────────────────────────────────────────────────────────────┤
│ CARREIRAS                                                            │ ① SectionHeading as=h1
│ Áreas para começar em tecnologia          post-it: "Mesmo ponto de   │
│ Cada área tem um caminho próprio…         partida, diferentes        │
│                                           caminhos."                 │
├──────────────────────────────────────────────────────────────────────┤
│ [tape][PaperCard]  [tape][PaperCard]  [tape][PaperCard]              │ ② grade 3 col
│  ícone  Frontend     ícone  Backend     ícone  Full Stack            │
│  "Interfaces que     "A lógica por       "Do zero ao projeto         │
│   inspiram."          trás de tudo."      completo."                 │
│  descrição curta     descrição curta     descrição curta             │
│  [Iniciante] 1 roadmap                   [Intermediário]             │
│  Ver caminho →       Ver caminho →       Ver caminho →               │
│ [DevOps]           [Dados]            [IA]                           │
├──────────────────────────────────────────────────────────────────────┤
│ nota de papel: "Não sabe por onde começar?" → Guia em /sobre         │ ③
│ objeto: objects/cartoes-perfurados.webp (canto, decorativo)          │
└──────────────────────────────────────────────────────────────────────┘
```

### Mobile

```
┌────────────────────┐
│ [faixa] Logo   [≡] │
│ CARREIRAS          │ ①
│ título / descrição │
│ [PaperCard]        │ ② 1 col (sm: 2)
│ [PaperCard]        │
│ …                  │
│ nota "Não sabe…"   │ ③
└────────────────────┘
```

## 5. Seções

| nº | Seção | Componentes | Dados | Assets | Vazio |
|---|---|---|---|---|---|
| ① | Cabeçalho | `SectionHeading as="h1" eyebrow="Carreiras"`, `StickyNote` (xl) | — | `decorations/coroa.svg` | — |
| ② | Grade | `ul` + `CareerCard` (com `LevelBadge`, contagem) | `listCareers()` | `objects/nota-papel-rasgado.webp` opcional como fundo do cartão | `EmptyState` |
| ③ | Ajuda | `PaperCard torn`, `Button variant=outline` → `/sobre#como-escolher` | — | `objects/cartoes-perfurados.webp` (`ObjectSticker`, `aria-hidden`) | — |

## 6. Metadata

`buildPageMetadata({ title: "Carreiras em tecnologia", description: "...", path: "/carreiras" })` (**FATO**). Sem JSON-LD (lista); `ItemList` só quando houver domínio e conteúdo real (pendência global).

## 7. Acessibilidade

`h1` único; cada cartão é `article` com `h3` e link que cobre o cartão; o texto "Ver caminho" não é o link (o nome acessível do link é o título da carreira); `LevelBadge` com texto, não só cor; contraste do papel: `text-dp-ink` sobre branco/creme.

## 8. Movimento

`Reveal` por cartão com `delay` escalonado (máx. 0,3 s total). Hover: elevação (`PaperCard interactive`, **FATO**).

## 9. Estados

Carregando: `Skeleton` 6 blocos (h-56). Vazio: `EmptyState`. Erro: `error.tsx`. 404: não se aplica.

## 10. Do mockup: o que não entra

Filtros "Todas / Desenvolvimento / Infraestrutura / Dados / IA / Outros" (sem taxonomia de área no modelo; adicionar `area` em `Career` é decisão futura — `[PRECISA ESCLARECER]`); "Comparar carreiras"; contagens "7 etapas" fixas (só do roadmap real); avatar.

## 11. Critérios de aceite

| # | Given / When / Then | Prova |
|---|---|---|
| 1 | Dado conteúdo demo, quando `/carreiras` abre, então há 6 cartões em ordem Frontend, Backend, Full Stack, DevOps, Dados, IA | e2e (`getByRole("article")` count + ordem dos `h3`) |
| 2 | Dado um cartão, quando Enter é pressionado com foco no título, então a URL vira `/carreiras/<slug>` | e2e teclado |
| 3 | Dado nenhuma carreira publicada (mock do repositório), então `EmptyState` aparece | unitário do componente de lista com repositório falso |
| 4 | Dado 390 px, então os cartões empilham sem rolagem horizontal | e2e |
| e2e sugerido | `tests/e2e/carreiras.spec.ts` | — |

## 12. Fora de escopo

Busca, filtros por área, comparação, favoritos.

## 13. Pendências

- `[PRECISA ESCLARECER: incluir campo `area` (Desenvolvimento/Infra/Dados/IA) em Career para filtros futuros?]`
- Decidir se o cartão da lista reutiliza o papel rasgado da hero (`HeroCareerCard`) ou mantém `CareerCard` branco; proposta: manter `CareerCard` (mais legível para descrição longa) e reservar o papel rasgado para destaques.
