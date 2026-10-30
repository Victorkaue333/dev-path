# M0 — Base técnica e documental do DevPath compilando sem banco

> Doc-pai da fase **M0**. **Status: implementada — não commitada.**
> Spec: sem spec — a milestone é o próprio bootstrap, definido pelo briefing do mantenedor.
> Origem: briefing "Inicialização completa da base do DevPath" (29/out/2026).
> Relação com ADRs: abre as ADRs [0001](../DECISIONS.md#0001--aplicação-única-nextjs-sem-backend-separado) a [0014](../DECISIONS.md#0014--estrutura-modular-por-features-com-camada-server-only).

---

## O problema

Não existia nada além de um `README.md` de uma linha. Era preciso uma base que compilasse, com arquitetura que suportasse crescimento incremental, segurança do painel desde o primeiro dia e documentação que não prometesse o que não existe.

---

## A descoberta que mudou o desenho

- **Prisma com tags divergentes:** `prisma@latest` era `8.0.0-rc.28` e `@prisma/client@latest` era `7.10.1`. Versões fixadas em 7.10.1 ([ADR 0003](../DECISIONS.md#0003--prisma-7-fixado-em-7101-com-driver-adapter-pg)).
- **Next 16.4 com Cache Components ligado por padrão:** qualquer `cookies()`/banco fora de `<Suspense>` quebra o build. A arquitetura passou a assumir isso ([ADR 0006](../DECISIONS.md#0006--cache-components-ligado-suspense-para-cookies-e-banco)).
- **`create-next-app` recusa diretório com `README.md`:** scaffold gerado fora e copiado.
- **Docker daemon indisponível** na máquina do bootstrap: migrations não geradas; compose validado só por `docker compose config`.
- **shadcn/ui 4** usa presets (`radix-nova` escolhido) e o pacote `cn`; o componente `form` não existe mais na CLI — login usa React Hook Form + `Input`/`Label` diretamente.
- **`dynamicParams = false` é incompatível com `cacheComponents`** (o build falha): rotas `[slug]` desconhecidas respondem `200` na primeira visita (App Shell + 404 em streaming) e `404` nas seguintes via ISR. Registrado como comportamento conhecido em [`../ARCHITECTURE.md`](../ARCHITECTURE.md#comportamentos-conhecidos).
- **Tópico como taxonomia compartilhada:** o mesmo tópico ("http-basico") aparece em etapas de roadmaps diferentes e é o elo com os cursos; por isso `Topic` perdeu `stepId` e ganhou a junção `RoadmapStepTopic`.
- **Assets entregues durante o bootstrap:** PNGs oficiais de personagens e objetos foram adicionados pelo mantenedor; o `logo-devpath.png` não tem canal alfa, então `Logo` continua em texto + SVG.

---

## O que foi entregue

### 1. Aplicação e ferramental

Next.js 16.4.3, React 19.3, TypeScript 5.9 strict, Tailwind 4, shadcn/ui 4, Lucide, Motion 14, Zod 4, React Hook Form 7, pnpm 11.3.0 (`allowBuilds` explícito), ESLint 9 flat (regra que restringe Prisma a `src/server`), Prettier 3 + plugin Tailwind, `.editorconfig`, `.nvmrc`, `.env.example` completo, `docker-compose.yml`.

### 2. Design System (base)

Tokens `--dp-*` e mapeamento shadcn em `globals.css`; Inter + Permanent Marker; utilitários `.dp-*`; `prefers-reduced-motion` global; componentes `PaperCard`, `StickyNote`, `Tape`, `Doodle`, `CharacterSticker`, `RetroTerminal`, `SectionHeading`, `CareerCard`, `RoadmapStep` — contratos e versão inicial. Direção visual e exclusões documentadas em [`../DESIGN.md`](../DESIGN.md).

### 3. Rotas

Públicas: `/`, `/carreiras(/[slug])`, `/roadmaps(/[slug])`, `/cursos`, `/projetos`, `/mercado`, `/lendas-da-ti(/[slug])`, `/sobre`, `not-found`, `robots.ts`, `sitemap.ts`. Admin: `/admin/login` (grupo `(auth)`), `/admin` → `/admin/dashboard`, páginas-base `dashboard|carreiras|roadmaps|cursos|projetos|conteudos|analytics`. API: `GET /api/health`, `POST /api/analytics/events`.

### 4. Dados

`ContentRepository` com `DemoContentRepository` e `PrismaContentRepository`; seleção por `CONTENT_SOURCE`; conteúdo demo explícito em `src/features/*/demo-data.ts`; `prisma/schema.prisma` completo; `prisma/seed.ts` que importa o demo e cria admin só com `SEED_ADMIN_*` fora de produção.

### 5. Segurança

Auth própria fail-closed (jose + bcrypt + cookie httpOnly), `proxy.ts`, `requireAdminSession()`, rate limit em memória, cabeçalhos de segurança, analytics sem identificadores desligado por padrão.

### 6. Qualidade e CI

Vitest (slug, schemas, repositório demo, limitador, `authenticateAdmin`), Playwright (smoke), `.github/workflows/ci.yml` sem deploy, templates de issue/PR.

### 7. Documentação

Raiz: `README`, `PROJECT_CONTEXT`, `AGENTS`, `CLAUDE`, `SECURITY`, `CHANGELOG`, `LICENSE` (pendente). `docs/`: PRD, ARCHITECTURE, API, DATABASE, DESIGN, DECISIONS (ADRs 0001–0014), INTEGRATION, DEPLOY, ENVIRONMENT, Code-Style, Security-Guide, CHECKLIST-E2E-STAGING, milestones, spec, templates, inventário de assets.

---

## Decisões que não são detalhe

**1. Fail-closed em vez de "modo dev" para o painel.** Sem `AUTH_SECRET` ou banco, o login explica por quê e não entra. Alternativa rejeitada: admin padrão para desenvolvimento — chega à produção por acidente.

**2. Demo como única fonte transitória.** O mesmo arquivo alimenta site e seed. Alternativa rejeitada: mock separado no front.

**3. Cache Components mantido.** Custo: disciplina de `<Suspense>`. Benefício: shell estático e alinhamento com o futuro do framework.

**4. Nenhum número fictício, nenhum asset falso.** Mockups mostram contadores e retratos; a base mostra placeholders explícitos e nenhum contador.

---

## O que muda, por arquivo

Árvore completa em [`../ARCHITECTURE.md`](../ARCHITECTURE.md#estrutura-de-diretórios). Tudo é **novo** nesta milestone, exceto `README.md` (substituído).

---

## Como verificar

| # | Critério | Onde se prova |
|---|---|---|
| 1 | `pnpm dev` sobe sem `.env` e a home renderiza conteúdo demo | manual |
| 2 | `/admin/dashboard` sem sessão redireciona para `/admin/login` | `tests/e2e/public-smoke.spec.ts` |
| 3 | Login sem `AUTH_SECRET` responde `auth_not_configured`; sem banco, `db_unavailable` | `tests/unit/authenticate.test.ts`; e2e cobre a mensagem na tela |
| 4 | Repositório demo nunca devolve rascunho | `tests/unit/demo-content-repository.test.ts` |
| 5 | Evento de analytics com campo extra é rejeitado | `tests/unit/analytics-schema.test.ts`, `tests/integration/analytics-route.test.ts` |
| 6 | `prisma validate` e `prisma generate` passam sem banco | comando |
| 7 | `pnpm lint`, `format:check`, `typecheck`, `test`, `build` verdes | comando |
| 8 | E2E (8 testes) passa contra `next start` | `pnpm build && pnpm test:e2e` |

Resultados da execução: [`../../README.md`](../../README.md#verificações-executadas-no-bootstrap) (nesta rodada: todos os itens acima aprovados; Docker e migrations não executados).

---

## Pendências declaradas

1. **Migrations não geradas** — exigem banco; primeira execução de `pnpm db:migrate` cria `init`.
2. **Docker Compose não executado** — daemon indisponível; arquivo validado.
3. **Assets parciais** — PNGs oficiais e SVGs provisórios existem; logo em paths, textura fotográfica, ilustrações de cena e OG image faltam ([`../assets/README.md`](../assets/README.md)).
4. **Licença indefinida** — [ADR 0011](../DECISIONS.md#0011--licença-do-projeto-decisão-pendente).
5. **Rate limit por instância** — [ADR 0008](../DECISIONS.md#0008--rate-limit-em-memória-como-medida-provisória).
6. **CSP estrita** — [ADR 0009](../DECISIONS.md#0009--cabeçalhos-de-segurança-no-nextconfig-csp-estrita-pendente).
7. **Telas finais, CRUD, agregação de analytics, deploy** — milestones M1–M5.
8. **Auditoria de acessibilidade e medição de performance** — Pendentes.
