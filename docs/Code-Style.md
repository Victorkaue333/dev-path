# Code Style — DevPath

> Como o código é escrito neste repositório. Nível 4 da hierarquia documental. O que ferramentas verificam (ESLint, Prettier, TypeScript) está configurado; o resto é regra escrita que revisão de PR cobra.

## 1. Regra de ouro

Código que um iniciante em Next.js consiga ler: Server Component simples, nome explícito, regra de negócio em função pura com teste. Abstração só quando a terceira repetição aparece.

## 2. Portões

| Portão | Comando | Configuração |
|---|---|---|
| Lint | `pnpm lint` | `eslint.config.mjs` (flat): `eslint-config-next/core-web-vitals` + `typescript`, `no-unused-vars` como erro (prefixo `_` tolerado), `no-restricted-imports` bloqueando `@/generated/*` fora de `src/server/**` e `prisma/**` |
| Tipos | `pnpm typecheck` | `tsconfig.json`: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, alias `@/*` → `src/*` |
| Formato | `pnpm format:check` | `.prettierrc`: 100 colunas, aspas duplas, vírgula final, plugin Tailwind (ordena classes; `cn`/`cva` reconhecidos) |
| Testes | `pnpm test` | Vitest |
| Build | `pnpm build` | Cache Components valida Suspense e metadata |

`pnpm check` roda lint → typecheck → test → build. O CI roda esses quatro mais `format:check` e `db:validate`. PR só com tudo verde.

## 3. TypeScript

- `strict` e `noUncheckedIndexedAccess`: acesso a índice devolve `T | undefined`; trate em vez de usar `!`.
- Sem `any`; use `unknown` e estreite. Sem `as` para "fazer compilar" — se precisou, o tipo está errado.
- Tipos de domínio em `src/types/content.ts`; nunca exporte tipos do Prisma para fora de `src/server`.
- `interface` para contratos públicos (DTOs, props); `type` para uniões e utilitários.
- Enums do Prisma são espelhados como uniões de literais (`"DRAFT" | "PUBLISHED" | "ARCHIVED"`) para manter demo e banco intercambiáveis.
- Funções exportadas com tipo de retorno explícito quando o retorno é um contrato (repositórios, actions).
- `satisfies` para objetos de configuração tipados (`as const` + `satisfies`).

## 4. Idioma e nomes

### 4.1 Idioma

| O quê | Idioma |
|---|---|
| Interface, mensagens de erro, documentação, commits, comentários explicativos | Português brasileiro |
| Identificadores (variáveis, funções, tipos, colunas, rotas de API) | Inglês |
| Rotas públicas (URLs) | Português, semânticas: `/carreiras`, `/lendas-da-ti` |
| Chaves de JSON de erro | Português (`erro`, `mensagem`, `detalhes`) — contrato em [`API.md`](API.md#formato-de-erro) |

### 4.2 Nomes

| Coisa | Convenção | Exemplo |
|---|---|---|
| Arquivos e pastas | kebab-case | `demo-content-repository.ts`, `login-form.tsx` |
| Componentes React | PascalCase (export nomeado) | `export function CareerCard()` |
| Hooks | `use` + PascalCase | `useReducedMotionSafe` |
| Server Actions | verbo + `Action` | `loginAction`, `archiveCareerAction` |
| Schemas Zod | substantivo + `Schema` | `loginSchema`, `analyticsEventSchema` |
| Tipos inferidos de schema | `Input` | `LoginInput`, `AnalyticsEventInput` |
| Repositórios | `<Origem>ContentRepository` | `DemoContentRepository` |
| Erros | sufixo `Error` | `DatabaseNotConfiguredError` |
| Tokens CSS do DevPath | prefixo `--dp-` | `--dp-paper`, `--dp-tilt-1` |
| Utilitários CSS do DevPath | prefixo `.dp-` | `.dp-container`, `.dp-torn-edge` |
| Variáveis de ambiente | SCREAMING_SNAKE; públicas com `NEXT_PUBLIC_` | `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL` |
| Booleanos | `is`/`has`/`can` | `isDatabaseConfigured`, `isOfficialDocs` |

## 5. Organização de componentes

### 5.1 Onde cada coisa mora

| Tipo | Pasta | Regra |
|---|---|---|
| Rota | `src/app/**/page.tsx`, `layout.tsx` | Só composição e metadata; sem regra de negócio; sem acesso a dados fora de `server/services` |
| Base de UI (shadcn) | `src/components/ui` | Gerado pela CLI; não editar além do necessário |
| Design System do DevPath | `src/components/design-system` | Puro, por props, sem dados, sem `server-only` |
| Casca e navegação | `src/components/layout` | `PublicHeader`, `PublicFooter`, `AdminShell`, `SkipLink` |
| Feedback | `src/components/feedback` | `EmptyState`, `DevNotice` |
| Específico de um domínio | `src/features/<dominio>/components` | Pode importar tipos do domínio; não acessa banco |

### 5.2 Server vs Client

- Arquivo sem `"use client"` é Server Component. Só adicione a diretiva quando usar estado, efeito, eventos, `motion/react` ou APIs do navegador.
- Client Component recebe dados prontos por props (serializáveis). Nunca importa `src/server/**`.
- Componente assíncrono que lê banco/cookies é envolvido por `<Suspense fallback={…}>` no pai.
- Módulos de servidor começam com `import "server-only";` — exceto os que precisam rodar no seed via `tsx` (`demo-data.ts`, `authenticate.ts`, `rate-limit.ts`, `session-token.ts`, `password.ts`), que por isso são puros.

### 5.3 Props e estilos

- Props tipadas com `interface <Nome>Props`; `className` aceito e combinado com `cn()`.
- Variantes com `cva` quando há mais de duas combinações; caso contrário, condicionais simples.
- Classes Tailwind ordenadas pelo plugin do Prettier; valores mágicos viram token em `globals.css`.
- Decoração recebe `aria-hidden="true"`; imagem de conteúdo tem `alt` real.

## 6. Padrões de importação

Ordem (o Prettier não ordena imports; mantenha à mão):

1. `"server-only"` / `"use client"` (diretiva no topo).
2. Pacotes externos (`react`, `next/*`, `zod`…).
3. Alias internos `@/…` em ordem: `config`, `lib`, `types`, `components`, `features`, `server`.
4. Relativos (`./`, `../`) — só dentro da mesma feature/pasta.

Regras: sempre `@/` para cruzar pastas de topo; nunca `../../..`; nunca importar `@/generated/*` fora de `src/server/**` (ESLint falha); `import type` para tipos.

## 7. Validação

- Toda entrada externa passa por Zod: `FormData` em Server Actions, `request.json()` em Route Handlers, `process.env` em `src/config/env.ts`.
- Schema único por entrada, em `src/features/<dominio>/schemas/`, importado pelo cliente (React Hook Form via `zodResolver`) e pelo servidor.
- Objetos vindos de fora são `strict()` quando campo extra deve ser rejeitado (analytics).
- Mensagens de validação em pt-BR, curtas, no próprio schema.
- Erro de credencial é sempre genérico; erro de validação de campo é específico.
- Nunca confie na validação do cliente: a action/handler revalida.

## 8. Acesso a dados

- Só `src/server/repositories/**` fala com o Prisma; páginas chamam `src/server/services/**`.
- Repositórios públicos filtram `status: PUBLISHED` **sempre**; repositório administrativo (Planejado) é outro módulo.
- `getPrismaClient()` é o único construtor do cliente; nada de `new PrismaClient()` espalhado.
- Consultas selecionam campos (`select`/`include`) — nunca `findMany()` sem forma definida para resposta pública.
- Ordenação determinística (`order`, depois `title`).

## 9. Erros

- Classes nomeadas para erros esperados; mensagem em pt-BR apontando para o doc que resolve.
- Route Handler: `try/catch` no topo, resposta no formato de [`API.md`](API.md#formato-de-erro), `console.error` com contexto mínimo, nunca stack para o cliente.
- Server Action: devolve estado de formulário; não lança para a UI.
- Ausência não vira zero nem vazio silencioso: sem banco em modo `database` é erro; sem conteúdo publicado é `EmptyState` explícito.

## 10. Testes

| Nível | Onde | O que cobre | Dependências |
|---|---|---|---|
| Unitário | `tests/unit/*.test.ts(x)` | `slug.ts`, `loginSchema`, `analyticsEventSchema`/`toExternalHost`, `resolveContentSource`, `DemoContentRepository` (filtro `PUBLISHED`, integridade dos slugs demo), `createMemoryRateLimiter`/`clientKeyFromHeaders`, token de sessão, `authenticateAdmin` com dependências injetadas (ordem fail-closed, mensagem única, reset do limitador), `SectionHeading` (Testing Library) | Nenhuma externa |
| Integração | `tests/integration/*.test.ts` | Route Handlers chamados diretamente: `GET /api/health`, `POST /api/analytics/events` (202, 400, 413, 429) | Nenhuma externa |
| E2E | `tests/e2e/*.spec.ts` | Smoke do site público (home, carreiras → detalhe, roadmap com etapas, 404, `robots.txt`/`sitemap.xml`, cabeçalhos), `/admin/dashboard` → `/admin/login`, login bloqueado sem configuração e `X-Robots-Tag` | `pnpm build` antes; a config sobe `pnpm start` |

Regras:

- Nome do teste descreve o comportamento em pt-BR: `it("recusa login quando AUTH_SECRET não está configurado")`.
- Teste de regra pura não usa mock de módulo: injete dependências.
- Sem banco nos testes unitários/integração; teste contra Postgres real é Planejado (job opcional com serviço Postgres no CI).
- Cada bug corrigido ganha um teste que falharia antes.
- Vitest (`vitest.config.mts`): `environment: jsdom`, alias `@/` e `server-only` → `tests/stubs/server-only.ts` (o pacote real lança erro fora do React Server), `tests/setup.ts` com `@testing-library/jest-dom`, `include` em `tests/unit` e `tests/integration`, cobertura v8 excluindo `src/app`, `src/components/ui` e `src/generated`.
- Playwright (`playwright.config.ts`): `webServer` com `pnpm start` apontando para `/api/health` (rode `pnpm build` antes; fora do CI reaproveita servidor aberto), Chromium, `locale: pt-BR`, `trace: on-first-retry`, 2 retentativas no CI.

## 11. Comentários

- Comente **por quê**, não o quê. Cabeçalho curto em módulos com regra não óbvia (ex.: ordem fail-closed em `authenticate.ts`).
- Conteúdo demonstrativo tem o cabeçalho literal `CONTEÚDO DEMONSTRATIVO`.
- `TODO` só com referência (`TODO(M1): …` ou link para pendência em doc). `TODO` órfão não passa.
- Nada de código comentado.

## 12. Formatação

Prettier decide. Exceções: Markdown fica fora do Prettier (`.prettierignore`) para preservar tabelas; `src/generated` e `pnpm-lock.yaml` ignorados. `.editorconfig` garante LF, UTF-8 e 2 espaços em qualquer editor.

## 13. Git

### Commits

Formato: `tipo(escopo): resumo em pt-BR no imperativo` — tipos `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `style`. Corpo explica o porquê quando não for óbvio. Sem emoji no assunto.

Exemplos: `feat(roadmaps): página de detalhe com etapas e tópicos` · `docs(decisions): ADR 0015 provedor de banco`.

**Agentes de IA não fazem commit sem pedido explícito** ([`AGENTS.md`](../AGENTS.md#guardrails-nunca-faça)).

### Branches

`main` protegida (CI verde). Trabalho em `feat/<slug>`, `fix/<slug>`, `docs/<slug>`. Rebase local antes do PR é permitido; `--force` só na própria branch.

### PR

Template em `.github/PULL_REQUEST_TEMPLATE.md`: o quê, por quê, como testar, checklist (lint/typecheck/test/build, docs atualizados, sem segredo, sem número fictício). PR toca código **e** documentação afetada juntos.

## 14. Regras escritas que nenhuma ferramenta verifica

- Nenhuma tela mostra número sem fonte real.
- Nenhum texto afirma funcionalidade que não existe.
- Nenhum cookie é definido para visitantes.
- Nenhum link externo sem `rel="noopener noreferrer"`.
- Nenhum componente do Design System acessa dados.
- Nenhuma mudança de schema sem atualizar `DATABASE.md` no mesmo PR.
- Nenhuma variável de ambiente nova sem `.env.example` + `ENVIRONMENT.md`.
