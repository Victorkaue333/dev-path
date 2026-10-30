# Home — spec

> Criado: 30/out/2026 · Autor: bootstrap (agente), a ratificar · Status: **em andamento** (hero implementada em 30/out/2026; seções abaixo da hero são proposta)
> Origem: mockup 01 (Home/hero) e mockup "home completa"; PRD RF-01
> Contrato: [SDD](../README.md) · Guarda-chuva: [`paginas-publicas-v1.md`](paginas-publicas-v1.md) · Decisões: ADR 0006, 0010, 0012
> Milestone: [M1](../../milestones/M1-hero-e-paginas-publicas.md)

A home apresenta o DevPath em uma tela (hero), mostra as carreiras publicadas e convida a escolher um caminho. Abaixo da hero, explica em três passos como o site funciona, destaca roadmaps e figuras históricas e termina com uma chamada para começar. Sem contadores, sem vídeo, sem login.

---

## 0. Constituição

Todas as linhas: **sim**. Pontos de atenção: nenhum número na home (nem "N carreiras"); CTA nunca aponta para login.

## 1. Rota, arquivos e dados

| Item | Valor |
|---|---|
| Rota | `/` |
| Página | `src/app/(public)/page.tsx` (**FATO**: compõe `Hero` + seção "Lendas da TI") |
| Hero | `src/features/home/components/hero.tsx` e irmãos (**FATO**: implementada) |
| Dados | `getHomeHighlights()` → `{ source, careers, legends (4), roadmaps (3) }` (**FATO**) |
| Novo | nenhum método; seção "Roadmaps em destaque" usa `roadmaps` já devolvido |

## 2. Objetivos e não-objetivos

**Objetivos:** (a) quem chega entende o que é o DevPath em 5 segundos; (b) escolhe uma carreira ou um roadmap sem rolar mais de duas telas; (c) a hero inteira cabe em 1080p e em notebooks (**FATO**, verificado em 1920×937, 1440×900, 1366×657).

**Não-objetivos:** busca; vídeo; prova social com números; personalização.

### 2.1 Produto

- **Para quem:** Iniciante absoluto; Em transição de carreira.
- **Dor:** não saber por onde começar.
- **Hipótese:** carreiras visíveis na primeira tela + "como funciona" curto aumentam cliques em roadmaps.
- **Como se mede:** `CAREER_NAVIGATION` e `ROADMAP_CLICK` com `path: "/"` (quando analytics estiver ativo). Sem analytics: não se mede.
- **Custo de não fazer:** home sem direção; visitante sai.

## 3. Requisitos (EARS)

| ID | Requisito | Prioridade |
|---|---|---|
| FR-HOME-01 | QUANDO a home carrega O SISTEMA DEVE exibir a hero com logotipo, tagline, texto, CTAs "Explorar roadmaps" e "Ver carreiras" e os cartões das carreiras publicadas (máx. 6) | obrigatório (**implementado**) |
| FR-HOME-02 | QUANDO a home carrega O SISTEMA DEVE exibir a seção "Como funciona" com três passos fixos (escolher carreira → seguir roadmap → praticar com projetos) | obrigatório |
| FR-HOME-03 | QUANDO houver roadmaps publicados O SISTEMA DEVE destacar até 3 com nível, carreira e número de etapas | obrigatório |
| FR-HOME-04 | QUANDO houver figuras publicadas O SISTEMA DEVE exibir até 4 retratos com link para o detalhe | obrigatório (**implementado**, ajustar para `CharacterSticker` com retratos oficiais) |
| FR-HOME-05 | QUANDO a home termina O SISTEMA DEVE exibir uma chamada final com CTA para `/carreiras` e link para `/sobre` | obrigatório |
| FR-HOME-06 | QUANDO não houver roadmaps ou figuras publicadas O SISTEMA DEVE omitir a seção inteira (sem `EmptyState` na home) | obrigatório |

## 4. Wireframe

### Desktop (≥ 1280)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [faixa de papel] Logo  Início Carreiras Roadmaps Cursos … Sobre  (Começar →) │ ① cabeçalho flutuante
├──────────────────────────────────────────────────────────────────────────────┤
│ MURAL                                                                        │
│  post-it   [Ada]        LOGO OFICIAL (webp)           [Turing]   post-it     │ ② hero (implementada)
│            etiqueta     ░ SEU CAMINHO NO MUNDO DA TECNOLOGIA ░   etiqueta    │
│                         parágrafo mono · (Explorar roadmaps) (Ver carreiras) │
│  [PC retrô]   [Frontend][Backend][Full Stack][DevOps][Dados][IA]   [Tux]     │
│               DISCIPLINA + PRÁTICA + COMUNIDADE = RESULTADOS →               │
├──────────────────────────────────────────────────────────────────────────────┤
│ PAPEL                                                                        │
│  COMO FUNCIONA (SectionHeading marker)                                       │ ③
│  [1 Escolha uma carreira] [2 Siga o roadmap] [3 Pratique com projetos]       │
│   PaperCard + número em círculo + objeto recortado (disquetes/teclado/mouse) │
├──────────────────────────────────────────────────────────────────────────────┤
│ MURAL (MuralSection)                                                         │
│  ROADMAPS EM DESTAQUE                                   [Todos os roadmaps]  │ ④
│  [card papel: carreira · nível · N etapas · título · descrição → ]  ×3       │
├──────────────────────────────────────────────────────────────────────────────┤
│ PAPEL-STRONG                                                                 │
│  LENDAS DA TI — Pessoas que construíram a computação                         │ ⑤ (existe)
│  (Ada) (Turing) (Hopper) (Hamilton)  CharacterSticker com retratos oficiais  │
├──────────────────────────────────────────────────────────────────────────────┤
│ PAPEL                                                                        │
│  nota de papel rasgado grande: "Pronto para começar?"  (Ver carreiras →)     │ ⑥ chamada final
│  link secundário: Como o conteúdo é curado → /sobre                          │
├──────────────────────────────────────────────────────────────────────────────┤
│ RODAPÉ (existe)                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Mobile (390)

```
┌──────────────────────┐
│ [faixa] Logo     [≡] │ ①
│ MURAL                │
│   LOGO               │ ② (implementada: empilha)
│   tagline            │
│   parágrafo          │
│  (Explorar roadmaps) │
│  (Ver carreiras)     │
│  [Ada]   [Turing]    │
│  [card][card]        │
│  [card][card]        │
│  [card][card]        │
│  DISCIPLINA + …      │
│ PAPEL                │
│  COMO FUNCIONA       │ ③ 1 coluna
│  [1] [2] [3]         │
│ MURAL                │
│  ROADMAPS EM DESTAQUE│ ④ 1 coluna
│ PAPEL-STRONG         │
│  LENDAS (2×2)        │ ⑤
│ PAPEL                │
│  Pronto para começar?│ ⑥
│ RODAPÉ               │
└──────────────────────┘
```

## 5. Seções

| nº | Seção | Componentes | Dados | Assets | Vazio |
|---|---|---|---|---|---|
| ② | Hero | `Hero`, `HeroWordmark`, `HeroCharacter`, `HeroCareers`, `HeroCareerCard`, `StickyNote` | `listCareers()` (6 primeiros) | `branding/logo-devpath.webp`, `textures/hero-background.{png,webp}`, `characters/ada-lovelace.png`, `characters/alan-turing.png`, `objects/terminal-retro-v320.png`, `objects/tux-e-livros-sticker.webp`, `objects/nota-papel-rasgado.webp` | linha de carreiras some |
| ③ | Como funciona | `SectionHeading marker`, 3× `PaperCard` com número (`font-marker`), `ObjectSticker` | estático | `objects/disquetes.webp`, `objects/teclado-retro.webp`, `objects/mouse-retro.webp` | — |
| ④ | Roadmaps em destaque | `MuralSection`, `SectionHeading` (texto claro), 3× `PaperCard interactive` com `LevelBadge`, `TrackedLink ROADMAP_CLICK` | `getHomeHighlights().roadmaps` | `decorations/seta-marker.svg` | seção omitida |
| ⑤ | Lendas | `SectionHeading marker`, `CharacterSticker` ×4 | `getHomeHighlights().legends` | `characters/*.png` | seção omitida |
| ⑥ | Chamada final | `PaperCard torn textured` grande, `Button` → `/carreiras`, link → `/sobre`, `Doodle crown` | estático | `objects/nota-papel-rasgado.webp` (fundo) | — |

Implementação: ③ e ⑥ são estáticos (prerender); ④ e ⑤ são componentes async dentro de `<Suspense>` com `Skeleton` de 3 e 4 blocos.

## 6. Metadata

Herdada do `layout.tsx` raiz (**FATO**: `title.default`, Open Graph, `metadataBase`). Canonical: adicionar `alternates.canonical = siteConfig.url` na página. Sem JSON-LD (só com conteúdo real; `Organization` pode entrar quando houver domínio definitivo).

## 7. Acessibilidade

- `h1` único na hero (`#hero-title`, **FATO**). Seções ③–⑥ com `h2` via `SectionHeading`.
- Texto claro sobre o mural só com a vinheta (já aplicada); contraste do parágrafo mono ≥ 4,5:1 (creme sobre `#0d2b20`, verificado visualmente; confirmar com ferramenta no checklist A11Y).
- Cartões clicáveis: link ocupa o cartão via `after:absolute after:inset-0`; foco visível (`outline-ring`).
- Objetos recortados: `alt=""` + `aria-hidden` (decorativos); o computador retrô tem `alt` com o texto do terminal (**FATO**).
- Ordem de tabulação: cabeçalho → CTAs → cartões → seções.

## 8. Movimento

`Reveal` em ③ (três cartões com `delay` 0/0.1/0.2), ④ e ⑥. Nada em loop. Hero já usa `Reveal` (**FATO**).

## 9. Estados

| Estado | Comportamento |
|---|---|
| Carregando | `Skeleton` na linha de carreiras (6), roadmaps (3), lendas (4) |
| Vazio | ④/⑤ omitidas; hero sem linha de carreiras |
| Erro de dados | `error.tsx` público (ver `erro.md` (a escrever)) |

## 10. Do mockup: o que não entra

Busca no cabeçalho; "Assistir apresentação"; "+10.000 pessoas" com avatares; "Começar agora" como login (hoje vai a `/carreiras`). Substitutos em [`paginas-publicas-v1.md`](paginas-publicas-v1.md) §6.

## 11. Critérios de aceite

| # | Given / When / Then | Prova |
|---|---|---|
| 1 | Dado 1920×937, quando a home abre, então a linha "Disciplina + Prática…" está visível sem rolar | e2e: `boundingBox().y + height <= viewport.height` (**verificado manualmente**) |
| 2 | Dado conteúdo demo, quando a home abre, então há 6 cartões de carreira e nenhum deles é "Segurança da Informação" | e2e |
| 3 | Dado a seção "Como funciona", então os três passos têm `h3` e um número visível | e2e |
| 4 | Dado roadmaps publicados, então "Roadmaps em destaque" mostra até 3 com link para `/roadmaps/<slug>` | e2e |
| 5 | Dado `reducedMotion: reduce`, então nenhum `Reveal` aplica transform | e2e |
| e2e sugerido | `tests/e2e/home.spec.ts`: título, h1, 6 cartões, 3 passos, destaques, âncoras do rodapé | — |

## 12. Fora de escopo

Depoimentos, newsletter, blog, mapa de calor de atividade, tema escuro.

## 13. Pendências

- `[PRECISA ESCLARECER: texto final dos três passos de "Como funciona" — proposta acima; aprovar ou ajustar]`
- Substituir `CharacterSticker` na seção ⑤ pelos retratos oficiais já referenciados em `demo-data` (hoje a seção já usa `imagePath`): confirmar tamanhos `md` em 390 px.
