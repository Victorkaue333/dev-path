# Projetos (lista) — spec

> Criado: 30/out/2026 · Autor: bootstrap (agente), a ratificar · Status: **proposta** (página-base implementada)
> Origem: mockup 06 ("Projetos práticos"); PRD RF-05
> Contrato: [SDD](../README.md) · Guarda-chuva: [`paginas-publicas-v1.md`](paginas-publicas-v1.md)
> Milestone: [M1](../../milestones/M1-hero-e-paginas-publicas.md)

Galeria de projetos práticos por nível, com carreira e tecnologias, filtrável por URL. Cada cartão leva ao detalhe (nova rota) com os critérios de conclusão.

---

## 0. Constituição

Todas: **sim**. Sem "horas estimadas" (campo existe mas é `undefined` no demo; exibir só quando preenchido por curadoria).

## 1. Rota, arquivos e dados

| Item | Valor |
|---|---|
| Rota | `/projetos?carreira=<slug>&nivel=<…>` |
| Página | `src/app/(public)/projetos/page.tsx` (**FATO**: grade simples) |
| Dados | **novo** `listProjects(filter?: { level?; careerSlug? })` (PROPOSTA); `listCareers()` para filtro e nomes |
| Schema | `src/features/projects/schemas.ts`: `projectFilterSchema` (mesmo padrão de cursos) |
| Novo DTO | `ProjectSummary.careerTitle?: string` (PROPOSTA) para evitar lookup na tela |

## 2. Objetivos e não-objetivos

**Objetivos:** achar um projeto do meu nível e carreira; entender o que vou construir antes de abrir.
**Não-objetivos:** submissão de projeto; galeria de projetos de visitantes; thumbnails de telas prontas (mockup) — sem assets reais.

### 2.1 Produto
- **Para quem:** Estudante de TI.
- **Como se mede:** `PROJECT_CLICK` com `path: "/projetos"`.

## 3. Requisitos (EARS)

| ID | Requisito | Prioridade |
|---|---|---|
| FR-PRL-01 | QUANDO a página carrega O SISTEMA DEVE listar projetos publicados ordenados por nível e título | obrigatório |
| FR-PRL-02 | QUANDO há filtros válidos O SISTEMA DEVE aplicá-los (AND) e refletir nos controles | obrigatório |
| FR-PRL-03 | QUANDO cada projeto é exibido O SISTEMA DEVE mostrar título (link), `LevelBadge`, carreira, até 4 tecnologias como chips e descrição | obrigatório |
| FR-PRL-04 | QUANDO `estimatedHours` existir O SISTEMA DEVE exibir "~N h"; caso contrário, nada | obrigatório |
| FR-PRL-05 | QUANDO não houver resultados O SISTEMA DEVE exibir `EmptyState` com "Limpar filtros" | obrigatório |

## 4. Wireframe

### Desktop

```
┌──────────────────────────────────────────────────────────────────────────┐
│ PROJETOS (h1)  Aprender fazendo             post-it: "Aprender fazendo   │ ①
│ Projetos por nível, com critérios claros…    é outro nível."             │
├──────────────────────────────────────────────────────────────────────────┤
│ [Todos] [Frontend] [Backend] [Dados] …   Nível: [Todos][Iniciante][…]    │ ② chips-link (GET)
├──────────────────────────────────────────────────────────────────────────┤
│ [PaperCard textured]      [PaperCard]            [PaperCard]             │ ③ 3 col
│  [Iniciante] Front-end     [Iniciante] Front-end  [Intermediário] Back   │
│  Página de perfil pessoal  Lista de tarefas…      API de tarefas…        │
│  descrição                 descrição              descrição              │
│  html css git              html css javascript    nodejs sql postgresql  │
│  Ver projeto →             Ver projeto →          Ver projeto →          │
│ objeto decorativo: objects/teclado-retro.webp (canto)                    │
└──────────────────────────────────────────────────────────────────────────┘
```

### Mobile

```
┌────────────────────┐
│ PROJETOS           │ ①
│ chips roláveis     │ ② overflow-x
│ [PaperCard]        │ ③ 1 col
│ [PaperCard]        │
└────────────────────┘
```

## 5. Seções

| nº | Seção | Componentes | Dados | Assets | Vazio |
|---|---|---|---|---|---|
| ① | Cabeçalho | `SectionHeading as="h1"`, `StickyNote` (xl) | — | — | — |
| ② | Filtros | chips-link (`ul` de `Link` com `aria-current` no ativo) para carreira e nível; preserva o outro parâmetro | `listCareers()` | — | — |
| ③ | Grade | `PaperCard textured interactive`, `LevelBadge`, texto da carreira, `TopicChip`-like `TechChip` (slug → nome via `listTechnologies()` ou nome já no DTO), link `/projetos/<slug>` (`PROJECT_CLICK`) | `listProjects(filter)` | `objects/teclado-retro.webp`, `objects/mouse-retro.webp` | `EmptyState` |

Nomes das tecnologias: PROPOSTA estender `ProjectSummary.technologies: Array<{ slug; name }>` em vez de `technologySlugs` (ou manter ambos). Hoje a tela mostra slugs em mono (**FATO**) — insuficiente.

## 6. Metadata

`buildPageMetadata({ title: "Projetos práticos", description, path: "/projetos" })` (**FATO**); canonical fixo.

## 7. Acessibilidade

Chips de filtro: `nav aria-label="Filtrar projetos"`, `aria-current="page"` no ativo; cartões com link cobrindo; badges em texto.

## 8. Movimento

`Reveal` escalonado nos cartões.

## 9. Estados

Carregando: 6 skeletons. Vazio: `EmptyState`. Erro: `error.tsx`.

## 10. Do mockup: o que não entra

Thumbnails de telas prontas (sem assets; usar objeto recortado pequeno por nível como ícone), abas "Full Stack/DevOps/IA" como categorias fixas (vêm das carreiras publicadas), avatar.

## 11. Critérios de aceite

| # | Given / When / Then | Prova |
|---|---|---|
| 1 | Dado `/projetos`, então 3 projetos publicados aparecem e "Análise de um CSV público" (rascunho) não | e2e |
| 2 | Dado `/projetos?nivel=INTERMEDIATE`, então só "API de tarefas com banco de dados" aparece | e2e + unitário |
| 3 | Dado um cartão, então as tecnologias aparecem com nome (ex.: "Node.js"), não slug | e2e |
| 4 | Dado `estimatedHours` indefinido, então nenhum texto de horas aparece | unitário do cartão |
| e2e sugerido | `tests/e2e/projetos.spec.ts` | — |

## 12. Fora de escopo

Envio de solução, comentários, likes, ordenação por popularidade.

## 13. Pendências

- `[PRECISA ESCLARECER: DTO de projeto com nomes de tecnologia (proposta: `technologies: {slug,name}[]`)]`
