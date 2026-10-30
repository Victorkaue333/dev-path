# CLAUDE.md — DevPath

> Resumo técnico para o Claude Code (e qualquer agente). Regras gerais e guardrails completos em [`AGENTS.md`](AGENTS.md). Em caso de conflito, a hierarquia documental de lá vale.

## Identidade do projeto

- **DevPath** — "Seu caminho no mundo da tecnologia". Plataforma educacional **pública, gratuita e sem cadastro**: roadmaps por carreira, cursos gratuitos/documentação oficial, projetos práticos, tecnologias do mercado, figuras históricas da computação.
- **Única autenticação:** painel administrativo (`/admin/*`). O site público não tem login, perfil, progresso em conta nem pagamento.
- **Sem números fictícios** em tela: nada de "+10.000 pessoas", salários ou percentuais sem fonte.

## Estado atual

Bootstrap: base compila; páginas públicas e admin são **páginas-base** com conteúdo demonstrativo; migrations não geradas; sem deploy. Fonte da verdade do estado: [`README.md`](README.md#estado-real-do-projeto) e [`docs/milestones/MILESTONES.md`](docs/milestones/MILESTONES.md).

## Stack

| Área | Escolha |
|---|---|
| Framework | Next.js 16.4 — App Router, `cacheComponents: true`, `partialPrefetching: true`, `src/proxy.ts` (não `middleware.ts`), Turbopack com `@tailwindcss/turbopack` |
| UI | React 19.3, TypeScript 5.9 strict (`noUncheckedIndexedAccess`), Tailwind CSS 4 (tokens em `src/app/globals.css`, sem `tailwind.config`), shadcn/ui 4 preset `radix-nova` (`cn` vem do pacote `cn`), Lucide, Motion 14 |
| Formulários | React Hook Form 7 + Zod 4 (`@hookform/resolvers`) |
| Dados | Prisma **7.10.1** (fixado; generator `prisma-client`, saída `src/generated/prisma`, `prisma.config.ts`, `@prisma/adapter-pg`), PostgreSQL 17 |
| Auth admin | jose (JWT HS256) + bcryptjs + cookie httpOnly `devpath_admin_session` |
| Testes | Vitest 5 (jsdom), Playwright 1.64 |
| Qualidade | ESLint 9 flat config, Prettier 3 + plugin Tailwind, GitHub Actions |
| Pacotes | pnpm 11.3.0 (`packageManager`), Node 24 |

## Comandos essenciais

```bash
pnpm install                 # dependências
cp .env.example .env         # local; nunca versionar
pnpm db:generate             # cliente Prisma (não precisa de banco)
pnpm dev                     # http://localhost:3000 em modo demo

pnpm lint · pnpm typecheck · pnpm test · pnpm build     # portões
pnpm check                   # os quatro em sequência
pnpm test:e2e                # Playwright (instale o Chromium uma vez: pnpm exec playwright install chromium)

pnpm db:up                   # Postgres local (Docker)
pnpm db:migrate              # prisma migrate dev
pnpm db:seed                 # conteúdo demo + admin (só com SEED_ADMIN_* e fora de produção)
pnpm db:studio
```

## Estrutura

```text
src/app/(public)/*      páginas públicas (Server Components)      src/server/db            cliente Prisma (singleton)
src/app/(auth)/admin/login   login fora do layout admin           src/server/repositories  ContentRepository: demo | prisma
src/app/admin/*         layout protegido + páginas-base           src/server/services      fachada usada pelas páginas
src/app/api/*           health, analytics/events                  src/server/auth          session, authenticate, rate-limit, password
src/components/ui       shadcn (gerado)                           src/server/analytics     record-event
src/components/design-system  PaperCard, StickyNote, Tape, Doodle, CharacterSticker, RetroTerminal, SectionHeading
src/features/<dominio>  demo-data, schemas, components, actions   src/config               site.ts (público) · env.ts (servidor, Zod)
src/types/content.ts    DTOs públicos (independentes do Prisma)   src/proxy.ts             barreira de /admin/*
prisma/schema.prisma · prisma/seed.ts · prisma.config.ts          tests/unit · tests/integration · tests/e2e
```

Mapa completo: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Decisões fixas (não rediscutir sem aval do mantenedor)

Registradas em [`docs/DECISIONS.md`](docs/DECISIONS.md):

- Aplicação única Next.js; **nenhum** backend separado (ADR 0001).
- pnpm como único gerenciador (ADR 0002).
- Prisma fixado em 7.10.1; não subir para RC (ADR 0003).
- Auth própria do painel: jose + bcrypt + cookie httpOnly, fail-closed sem `AUTH_SECRET`/banco (ADR 0004).
- Conteúdo demo em `src/features/*/demo-data.ts` é a única fonte transitória; seed importa dela; `CONTENT_SOURCE` define a origem (ADR 0005).
- Cache Components ligado: leitura de cookies/headers/banco sempre dentro de `<Suspense>` (ADR 0006).
- Analytics first-party sem identificadores e desligado por padrão (ADR 0007).
- Sem cadastro público, em qualquer forma (ADR 0012).

## Convenções

- Server Components por padrão; `"use client"` só com interatividade.
- Lógica fora de `page.tsx`; domínio em `src/features`, infra em `src/server` com `import "server-only"`.
- Prisma **só** em `src/server/**` e `prisma/**` (ESLint bloqueia o resto).
- Repositórios devolvem **apenas** conteúdo `PUBLISHED` para o site.
- Zod em toda entrada; mensagens de erro em pt-BR; erro de credencial sempre genérico ("E-mail ou senha inválidos").
- Arquivos kebab-case, componentes PascalCase, tipos em `src/types`.
- Links externos com `rel="noopener noreferrer"`; links de conteúdo rastreáveis via `TrackedLink`.
- Mais em [`docs/Code-Style.md`](docs/Code-Style.md).

## Fluxo de trabalho

1. Leia o doc canônico da área; para API do Next, leia `node_modules/next/dist/docs/`.
2. Feature com tabela/rota/dependência nova → spec em `docs/spec/features/` ([`docs/spec/README.md`](docs/spec/README.md)) → ADR se necessário → milestone em `docs/milestones/`.
3. Implemente com teste. Rode `pnpm check`.
4. Atualize `CHANGELOG.md` e os docs tocados no mesmo PR.
5. Entregue alterações **locais, sem commit**, com relatório: feito / verificado (comando + resultado) / não executado / pendente.

## Regras de segurança

- **Nunca** commit, push, merge, rebase ou deploy sem pedido explícito.
- **Nunca** segredo em código, doc ou exemplo. `AUTH_SECRET`, `DATABASE_URL` real e credenciais de seed só em `.env` local ou no painel da Vercel.
- **Nunca** bypass de auth, admin padrão ou "modo dev" que chegue à produção.
- Operação de escrita no admin passa por `requireAdminSession()` no servidor, além do `proxy.ts`.
- Seeds nunca em produção (`NODE_ENV=production` bloqueia a criação de admin).
- Migrations destrutivas só com aval; nunca `migrate reset` fora do ambiente local pessoal.
- Dúvida de segurança → [`docs/Security-Guide.md`](docs/Security-Guide.md); vulnerabilidade → [`SECURITY.md`](SECURITY.md).

## Ao terminar trabalho relevante

Atualize `CHANGELOG.md` (com o porquê), o doc canônico tocado, e — se houve decisão — `docs/DECISIONS.md`. Não deixe pendência implícita: escreva-a no doc da milestone.
