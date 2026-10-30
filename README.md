<p align="center">
  <img src="public/assets/branding/logo-devpath.webp" alt="DevPath" width="440">
</p>

# DevPath — Seu caminho no mundo da tecnologia

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=flat&logo=postgresql&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-11-F69220?style=flat&logo=pnpm&logoColor=white)

> **Estágio: bootstrap.** Este repositório contém a base técnica e documental do DevPath: aplicação Next.js compilável, Design System inicial, schema do banco, autenticação do painel e documentação normativa. **Nenhuma tela final está pronta** e **não há deploy**. O que existe, o que falta e o que foi verificado está em [Estado real do projeto](#estado-real-do-projeto).

---

## Visão geral

O DevPath é uma **plataforma educacional pública e gratuita** para quem quer iniciar ou desenvolver uma carreira em tecnologia. Ele reúne, em um só lugar:

- **Roadmaps de aprendizado por carreira** — passo a passo, do zero ao primeiro projeto.
- **Cursos gratuitos e documentação oficial** — curadoria de recursos abertos, sem venda de curso.
- **Projetos práticos por nível** — com critérios de conclusão claros.
- **Tecnologias e habilidades** — o que cada carreira exige, sem inventar números de mercado.
- **Lendas da TI** — figuras importantes da história da computação.
- **Orientação para iniciantes** — como escolher um caminho.

**Regras de produto que moldam o código** (ver [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) e [`docs/PRD.md`](docs/PRD.md)):

| Regra | Consequência técnica |
|---|---|
| Navegação pública **sem cadastro** | Não existe login, registro, perfil, progresso em conta nem pagamento. |
| Autenticação **só no painel administrativo** | `/admin/*` exige sessão de administrador; o resto do site é aberto. |
| **Nenhum número fictício** | Contadores, estatísticas de mercado e métricas só aparecem com fonte real. |
| Conteúdo demonstrativo é **transitório** | `src/features/*/demo-data.ts` alimenta o site sem banco e o seed; a fonte definitiva é o PostgreSQL ([ADR 0005](docs/DECISIONS.md#0005--conteúdo-demonstrativo-como-fonte-transitória-única)). |

---

## Pré-requisitos

| Ferramenta | Versão | Observação |
|---|---|---|
| Node.js | **24** (`.nvmrc`); mínimo 22 | `engines.node >= 22` no `package.json`. |
| pnpm | **11.3.0** | Fixado em `packageManager`; `corepack enable` resolve a versão. [ADR 0002](docs/DECISIONS.md#0002--pnpm-como-gerenciador-de-pacotes). |
| Docker + Docker Compose | qualquer versão recente | Só para o PostgreSQL local. Opcional: o site roda sem banco em modo demo. |
| Git | 2.x | — |

Não é necessário banco remoto, conta na Vercel nem segredo configurado para rodar o site público em desenvolvimento.

---

## Instalação

```bash
git clone https://github.com/Victorkaue333/dev-path.git
cd dev-path
corepack enable          # garante pnpm 11.3.0
pnpm install             # dependências (sem postinstall do Prisma: o generate é explícito)
cp .env.example .env     # valores locais; nunca versionar
pnpm db:generate         # gera o cliente Prisma em src/generated/prisma (não precisa de banco)
pnpm dev                 # http://localhost:3000
```

Com isso o site público sobe em **modo demo** (`CONTENT_SOURCE=demo`), sem banco. O painel administrativo abre em `/admin/login` mas **recusa qualquer login** até existir `AUTH_SECRET` e `DATABASE_URL` com migrations aplicadas e um administrador criado pelo seed (fluxo fail-closed, [docs/Security-Guide.md](docs/Security-Guide.md)).

### Com banco local (opcional)

```bash
pnpm db:up               # docker compose up -d postgres (postgres:17-alpine)
pnpm db:migrate          # prisma migrate dev — cria a primeira migration a partir do schema
pnpm db:seed             # conteúdo demonstrativo + administrador (só com SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD)
# no .env: CONTENT_SOURCE=database e AUTH_SECRET preenchido
pnpm dev
```

> As migrations **ainda não foram geradas** neste bootstrap (exigem banco acessível). O primeiro `pnpm db:migrate` cria `prisma/migrations/`. Ver [docs/DATABASE.md](docs/DATABASE.md#migrations).

---

## Comandos

| Comando | O que faz |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento (Turbopack). |
| `pnpm build` | `prisma generate && next build` — é o comando que a Vercel executa. |
| `pnpm start` | Servidor de produção local (após `build`). |
| `pnpm lint` / `pnpm lint:fix` | ESLint 9 (flat config, `eslint-config-next` + regras do projeto). |
| `pnpm typecheck` | `tsc --noEmit` em modo strict. |
| `pnpm format` / `pnpm format:check` | Prettier 3 com plugin Tailwind. |
| `pnpm test` / `pnpm test:watch` / `pnpm test:coverage` | Vitest (unitários e integração em `tests/`). |
| `pnpm test:e2e` / `pnpm test:e2e:ui` | Playwright (`tests/e2e/`). Exige `pnpm exec playwright install chromium` uma vez. |
| `pnpm db:generate` | Gera o cliente Prisma. Não precisa de banco. |
| `pnpm db:validate` | Valida `prisma/schema.prisma`. |
| `pnpm db:migrate` | `prisma migrate dev` (desenvolvimento). |
| `pnpm db:migrate:deploy` | `prisma migrate deploy` (produção/CI). |
| `pnpm db:studio` | Prisma Studio. |
| `pnpm db:seed` | Executa `prisma/seed.ts` (nunca em produção; ver [docs/DATABASE.md](docs/DATABASE.md#seeds)). |
| `pnpm db:up` / `pnpm db:down` | Sobe/derruba o PostgreSQL do `docker-compose.yml`. |
| `pnpm check` | `lint` → `typecheck` → `test` → `build`, em sequência. |

---

## Stack

| Camada | Tecnologia | Decisão |
|---|---|---|
| Framework | **Next.js 16.4** (App Router, `cacheComponents`, `proxy.ts`) | [ADR 0001](docs/DECISIONS.md#0001--aplicação-única-nextjs-sem-backend-separado), [ADR 0006](docs/DECISIONS.md#0006--cache-components-ligado-suspense-para-cookies-e-banco) |
| UI | React 19, TypeScript 5.9 strict, Tailwind CSS 4, shadcn/ui 4 (preset `radix-nova`), Lucide, Motion 14 | [ADR 0010](docs/DECISIONS.md#0010--design-system-tailwind-v4--shadcnui-fontes-google) |
| Formulários e validação | React Hook Form 7 + Zod 4 (mesmo schema no cliente e no servidor) | [docs/Code-Style.md](docs/Code-Style.md#7-validação) |
| Persistência | PostgreSQL 17 + Prisma 7.10.1 (`@prisma/adapter-pg`) | [ADR 0003](docs/DECISIONS.md#0003--prisma-7-fixado-em-7101-com-driver-adapter-pg) |
| Autenticação do painel | jose (JWT HS256) + bcryptjs + cookie httpOnly | [ADR 0004](docs/DECISIONS.md#0004--autenticação-própria-do-painel-jose--bcrypt--cookie-httponly) |
| Testes | Vitest 5 (unit/integration) + Playwright 1.64 (e2e) | [docs/Code-Style.md](docs/Code-Style.md#10-testes) |
| Qualidade | ESLint 9, Prettier 3, GitHub Actions (CI sem deploy) | [docs/DEPLOY.md](docs/DEPLOY.md) |
| Infra | Vercel (destino), Docker Compose (Postgres local), pnpm 11 | [ADR 0013](docs/DECISIONS.md#0013--vercel-como-destino-e-postgresql-externo) |

**Não** há backend separado (NestJS, Express, Fastify): Server Components, Server Actions e Route Handlers do próprio Next.js fazem o papel de API ([docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)).

---

## Arquitetura resumida

```mermaid
flowchart LR
  subgraph Público["Site público (sem auth)"]
    P[Server Components<br/>(public)/*]
  end
  subgraph Admin["Painel (auth obrigatória)"]
    L[/admin/login<br/>Server Action]
    A[admin/* layout<br/>requireAdminSession]
  end
  subgraph Server["src/server (server-only)"]
    S[services] --> R[repositories]
    R -->|CONTENT_SOURCE=demo| D[demo-data.ts]
    R -->|CONTENT_SOURCE=database| PR[(Prisma 7<br/>PostgreSQL)]
    AU[auth: session, authenticate,<br/>rate-limit, password]
    AN[analytics: record-event]
  end
  P --> S
  A --> AU
  L --> AU
  AU --> PR
  AN --> PR
  API[/api/analytics/events<br/>api/health/] --> AN
  PX[proxy.ts] -.primeira barreira /admin.-> A
```

- **Camadas:** apresentação (`src/app`, `src/components`, `src/features/*/components`) → aplicação (`src/server/services`) → domínio/contratos (`src/types`, `src/features/*/schemas`) → infraestrutura (`src/server/repositories`, `src/server/db`, `src/server/auth`).
- **Regra dura:** o cliente Prisma só é importado em `src/server/**` (regra ESLint `no-restricted-imports`). Componentes client-side nunca tocam o banco.
- **Cache Components:** toda leitura de `cookies()`, `headers()` ou banco fica dentro de `<Suspense>`; o resto vira shell estático.

Detalhes: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Estrutura de pastas

```text
dev-path/
├── .github/workflows/ci.yml     # lint, typecheck, test, build, e2e — sem deploy
├── docs/                        # documentação normativa (ver tabela abaixo)
├── prisma/
│   ├── schema.prisma            # modelo de dados (Prisma 7)
│   └── seed.ts                  # seed local: importa os mesmos demo-data.ts
├── prisma.config.ts             # URL do banco (Prisma 7 não usa mais `url` no schema)
├── public/assets/               # branding, characters, objects, decorations, textures, illustrations
├── src/
│   ├── app/
│   │   ├── (public)/            # layout público + páginas: carreiras, roadmaps, cursos, projetos, mercado, lendas-da-ti, sobre
│   │   ├── (auth)/admin/login/  # login fora do layout do painel
│   │   ├── admin/               # layout protegido + dashboard, carreiras, roadmaps, cursos, projetos, conteudos, analytics
│   │   ├── api/                 # health, analytics/events
│   │   ├── layout.tsx · globals.css · not-found.tsx · robots.ts · sitemap.ts
│   ├── components/
│   │   ├── ui/                  # shadcn/ui (gerado pela CLI)
│   │   ├── design-system/       # PaperCard, StickyNote, Tape, Doodle, CharacterSticker, RetroTerminal, SectionHeading
│   │   ├── layout/              # SiteHeader, SiteFooter, MainNav, MobileNav, AdminShell, SkipLink
│   │   ├── branding/ · feedback/ · motion/   # Logo · DevNotice, EmptyState, StatusBadge · Reveal
│   ├── features/                # um diretório por domínio: demo-data, schemas, components, actions
│   │   ├── careers/ roadmaps/ courses/ projects/ market/ legends/ analytics/ admin/ content/ home/ (hero)
│   ├── server/                  # server-only: db, repositories, services, auth, analytics
│   ├── config/                  # site.ts (público), env.ts (servidor, validado com Zod)
│   ├── lib/ · types/ · generated/ (Prisma, ignorado no git)
│   └── proxy.ts                 # barreira de /admin/*
├── tests/unit · tests/integration · tests/e2e
├── docker-compose.yml           # postgres:17-alpine
├── .env.example                 # todas as variáveis, sem valores reais
└── package.json
```

A estrutura completa e as responsabilidades de cada pasta estão em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#estrutura-de-diretórios).

---

## Desenvolvimento

1. **Comece pela documentação canônica** da área que vai tocar (tabela em [Documentação](#documentação)). Feature nova segue o processo de [docs/spec/README.md](docs/spec/README.md).
2. **Server Components por padrão.** `"use client"` só com interatividade real (formulários, Motion, tracking).
3. **Nada de lógica em `page.tsx`.** A página compõe; a regra vive em `src/features/*` e `src/server/*`.
4. **Validação com Zod** em toda entrada: Server Actions, Route Handlers, variáveis de ambiente.
5. **Idioma:** interface, documentação e mensagens em português brasileiro; código (identificadores) em inglês. Ver [docs/Code-Style.md](docs/Code-Style.md#4-idioma-e-nomes).
6. **Antes de abrir PR:** `pnpm check` verde e [docs/Security-Guide.md](docs/Security-Guide.md#15-checklist-de-segurança-do-pr) conferido.

---

## Testes

| Tipo | Ferramenta | Onde | Como rodar |
|---|---|---|---|
| Unitário | Vitest + jsdom | `tests/unit/` — slug, schemas Zod, `resolveContentSource`, repositório demo, limitador, token de sessão, `authenticateAdmin`, `SectionHeading` | `pnpm test` |
| Integração (Route Handlers) | Vitest | `tests/integration/` — `GET /api/health`, `POST /api/analytics/events` | `pnpm test` |
| E2E | Playwright (Chromium) | `tests/e2e/public-smoke.spec.ts` — home, carreiras, roadmap, 404, robots/sitemap, cabeçalhos, redirecionamento e bloqueio do admin | `pnpm build && pnpm test:e2e` (a config sobe `pnpm start`; reaproveita servidor aberto fora do CI) |

Os testes **não** exigem banco: o repositório demo e as regras de autenticação recebem dependências por injeção (`src/server/auth/authenticate.ts`); `server-only` é substituído por um stub em `tests/stubs/`. Configuração em `vitest.config.mts` e `playwright.config.ts`. Critérios em [docs/Code-Style.md](docs/Code-Style.md#10-testes).

---

## Estado real do projeto

Legenda: **Implementado** = existe no código e compila · **Planejado** = desenhado nos docs, sem código · **Pendente** = depende de decisão, configuração ou asset.

| Área | Estado | Detalhe |
|---|---|---|
| Aplicação Next.js, TypeScript strict, Tailwind 4, shadcn/ui | **Implementado** | `pnpm dev` sobe sem banco. |
| Layout público base + rotas das seções | **Implementado** (páginas-base) | Conteúdo demonstrativo; listagens e detalhes finais são a próxima onda ([M1](docs/milestones/M1-hero-e-paginas-publicas.md)). |
| Hero da página inicial (tela inteira, estilo colagem) | **Implementado** (primeira versão) | `src/features/home/components/`; Ada Lovelace e Alan Turing com PNGs oficiais; sem busca, contador de pessoas ou login público. Logotipo oficial (`logo-devpath.webp`) no centro; Tux e computador retrô nos cantos. |
| Layout administrativo + rotas | **Implementado** (casca) | Páginas listam estado "Planejado"; nenhum CRUD. |
| Tokens do Design System | **Implementado** | `src/app/globals.css`; direção visual em [docs/DESIGN.md](docs/DESIGN.md). |
| Componentes do Design System (PaperCard, StickyNote, Tape, Doodle, CharacterSticker, RetroTerminal, SectionHeading, CareerCard, RoadmapStep) | **Implementado** (contratos e versão inicial) | Sem reproduzir as telas finais dos mockups. |
| Schema Prisma | **Implementado** | `prisma validate` e `prisma generate` passam. |
| Migrations | **Pendente** | Exigem banco acessível; não geradas. |
| Seed local | **Implementado** | Só cria admin com `SEED_ADMIN_*` e fora de produção. |
| Autenticação do painel | **Implementado** (fail-closed) | Sem bypass; exige `AUTH_SECRET` + banco + admin seedado. |
| Rate limit de login | **Implementado** (em memória) | Por instância; versão compartilhada é **Pendente** ([ADR 0008](docs/DECISIONS.md#0008--rate-limit-em-memória-como-medida-provisória)). |
| Analytics first-party | **Implementado** (endpoint + tracker, desligado por padrão) | Agregação e dashboard: **Planejado**. |
| SEO: metadata, Open Graph, canonical, robots, sitemap | **Implementado** | JSON-LD: **Pendente** (só com conteúdo real). |
| Cabeçalhos de segurança | **Implementado** | CSP estrita: **Pendente** ([ADR 0009](docs/DECISIONS.md#0009--cabeçalhos-de-segurança-no-nextconfig-csp-estrita-pendente)). |
| CI (GitHub Actions) | **Implementado** | Sem deploy. |
| Deploy na Vercel | **Planejado** | Não executado ([docs/DEPLOY.md](docs/DEPLOY.md)). |
| Assets visuais | **Parcial** | PNGs oficiais de personagens, objetos, fundo da hero e logotipo em `public/assets/`; versões `.webp` com fundo transparente geradas por `pnpm assets:remover-fundo` (logo, Tux, Linus, computador, programador); SVGs de apoio no estilo adesivo. **Pendentes:** logo em vetor, textura fotográfica, OG image e licenciamento das ilustrações ([docs/assets/README.md](docs/assets/README.md)). |
| Licença | **Pendente** | [`LICENSE`](LICENSE) e [ADR 0011](docs/DECISIONS.md#0011--licença-do-projeto-decisão-pendente). |

### Verificações executadas no bootstrap

| Verificação | Comando | Resultado (rodada final do bootstrap, 30/out/2026) |
|---|---|---|
| Instalação | `pnpm install` | **Aprovado** (pnpm 11.3.0, Node 24) |
| Schema | `pnpm db:validate` · `pnpm db:generate` | **Aprovado**, sem banco |
| Docker Compose | `docker compose config` | **Arquivo válido**; container **não executado** (daemon do Docker Desktop indisponível) |
| Lint | `pnpm lint` | **Aprovado** (0 erros, 0 avisos) |
| Formatação | `pnpm format:check` | **Aprovado** |
| Typecheck | `pnpm typecheck` | **Aprovado** |
| Testes unitários e de integração | `pnpm test` | **Aprovado**: 41 testes em 11 arquivos |
| Build de produção | `pnpm build` | **Aprovado** (41 rotas estáticas/parciais, Cache Components) |
| E2E | `pnpm test:e2e` | **Aprovado**: 8 testes (Chromium) contra `next start` na porta 3100 (a 3000 estava ocupada na máquina) |
| Rotas | `curl` em todas as rotas públicas, `/admin/*`, `/robots.txt`, `/sitemap.xml`, `/api/health`, `POST /api/analytics/events` | **Aprovado**: 200 nas públicas, 307 → `/admin/login` nas administrativas, 404 na inexistente, 202/400 no endpoint de eventos |
| Links da documentação | script que varre os links internos de todos os `.md` | **Aprovado** (0 quebrados) |
| Segredos acidentais | grep por chaves/tokens/URLs privadas | **Nada encontrado** (apenas valores de teste em `tests/`) |
| Migrations | `pnpm db:migrate` | **Não executado** (sem banco) |
| Seed | `pnpm db:seed` | **Não executado** (sem banco) |
| Deploy | — | **Não executado** |

---

## Documentação

Hierarquia normativa (quando dois documentos divergem, o de cima vence; a divergência vira correção no de baixo):

1. **Produto:** [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md), [`docs/PRD.md`](docs/PRD.md)
2. **Técnico normativo:** [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/DATABASE.md`](docs/DATABASE.md), [`docs/API.md`](docs/API.md), [`docs/DESIGN.md`](docs/DESIGN.md)
3. **Registro de decisões:** [`docs/DECISIONS.md`](docs/DECISIONS.md)
4. **Guias operacionais:** [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md), [`docs/DEPLOY.md`](docs/DEPLOY.md), [`docs/INTEGRATION.md`](docs/INTEGRATION.md), [`docs/Code-Style.md`](docs/Code-Style.md), [`docs/Security-Guide.md`](docs/Security-Guide.md)
5. **Execução:** [`docs/CHECKLIST-E2E-STAGING.md`](docs/CHECKLIST-E2E-STAGING.md), [`docs/milestones/MILESTONES.md`](docs/milestones/MILESTONES.md), [`docs/spec/README.md`](docs/spec/README.md)

| Documento | Para quê |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Regras para agentes de IA: documentos canônicos, guardrails, critérios de conclusão. |
| [`CLAUDE.md`](CLAUDE.md) | Contexto técnico resumido, comandos e fluxo de trabalho. |
| [`SECURITY.md`](SECURITY.md) | Política de divulgação de vulnerabilidades. |
| [`CHANGELOG.md`](CHANGELOG.md) | Histórico (Keep a Changelog). |
| [`docs/assets/README.md`](docs/assets/README.md) | Inventário de assets: o que existe, o que falta, dimensões. |
| [`docs/templates/README.md`](docs/templates/README.md) | Templates de milestone e de spec de feature. |

---

## Licença

**Pendente.** A licença do DevPath ainda não foi definida; até lá, nenhuma autorização de uso ou redistribuição é concedida. Ver [`LICENSE`](LICENSE) e [ADR 0011](docs/DECISIONS.md#0011--licença-do-projeto-decisão-pendente).
