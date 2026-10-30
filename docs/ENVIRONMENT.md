# ENVIRONMENT — DevPath

> Requisitos locais, Docker Compose, variáveis de ambiente, comandos e diagnóstico. Nível 4 da hierarquia documental. Fonte da verdade das variáveis: [`.env.example`](../.env.example) (nomes) e `src/config/env.ts` (validação no servidor).

## Requisitos locais

| Ferramenta | Versão | Como conferir |
|---|---|---|
| Node.js | 24 (`.nvmrc`); mínimo 22 | `node --version` |
| pnpm | 11.3.0 (`packageManager`) | `corepack enable && pnpm --version` |
| Docker + Compose v2 | recente | `docker compose version` — **opcional**, só para o Postgres local |
| Git | 2.x | `git --version` |
| Navegador Chromium para Playwright | instalado pelo próprio Playwright | `pnpm exec playwright install chromium` |

Windows, macOS e Linux são suportados. Em Windows, use Git Bash ou PowerShell; caminhos com espaço devem ser citados.

## Primeira execução

```bash
corepack enable
pnpm install
cp .env.example .env
pnpm db:generate      # cliente Prisma; não precisa de banco
pnpm dev              # http://localhost:3000 em modo demo
```

Resultado esperado: site público navegável com conteúdo demonstrativo. `/admin/login` abre, mas o login responde "Autenticação indisponível: AUTH_SECRET não configurado" — comportamento correto.

## Modos de execução

| Modo | `.env` | O que funciona |
|---|---|---|
| **Demo** (padrão) | `CONTENT_SOURCE=demo` ou vazio sem `DATABASE_URL` | Site público completo com dados demo; `/api/health`; analytics descarta eventos; painel bloqueado |
| **Banco local** | `DATABASE_URL` do compose, `CONTENT_SOURCE=database`, `AUTH_SECRET`, `SEED_ADMIN_*` | Tudo acima + conteúdo vindo do Postgres + login no painel |
| **Teste** | `NODE_ENV=test` (Vitest define) | Testes unitários sem banco |

## Docker Compose

Arquivo: [`docker-compose.yml`](../docker-compose.yml). Um serviço, `postgres` (`postgres:17-alpine`), com volume nomeado `devpath-postgres-data` e healthcheck `pg_isready`.

```bash
pnpm db:up        # docker compose up -d postgres
docker compose ps # healthy?
pnpm db:down      # docker compose down (mantém o volume)
docker compose down -v   # apaga o volume — só se quiser zerar o banco local
```

Variáveis lidas pelo compose (com padrões locais inofensivos): `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT`. Elas **não** são usadas pela aplicação; a aplicação usa só `DATABASE_URL`, que deve coincidir com esses valores.

Validação sem daemon: `docker compose config` confere a sintaxe. No bootstrap o daemon estava indisponível, então o container **não** foi executado.

## Variáveis de ambiente

Validação: `src/config/env.ts` (Zod) lê as variáveis do servidor no carregamento do módulo e lança erro com mensagem clara se algo estiver inválido (ex.: `AUTH_SECRET` com menos de 32 caracteres). Variáveis `NEXT_PUBLIC_*` são embutidas no bundle no **build** — mudar exige novo build.

| Variável | Obrigatória? | Padrão | Lida por | Descrição |
|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Produção: sim | `http://localhost:3000` | `src/config/site.ts` | Origem pública; metadata, Open Graph, canonical, sitemap. Valor inválido cai no padrão. |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | Não | `false` | `src/features/analytics/track.ts` | `true` liga o envio de eventos pelo navegador. Só após revisão de privacidade. |
| `CONTENT_SOURCE` | Não | vazio | `src/server/repositories` | `demo` ou `database`. Vazio: `database` se há `DATABASE_URL`, senão `demo`. `database` sem URL = erro proposital. |
| `DATABASE_URL` | Para `database` e para o painel | — | `prisma.config.ts`, `src/server/db/client.ts` | URL PostgreSQL. Local: `postgresql://devpath:devpath@localhost:5432/devpath?schema=public`. Produção: TLS (`sslmode=require`). |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` / `POSTGRES_PORT` | Não | `devpath` / `devpath` / `devpath` / `5432` | `docker-compose.yml` | Só para o container local. |
| `AUTH_SECRET` | Para o painel | — | `src/config/env.ts`, `src/server/auth/*`, `src/proxy.ts` | Segredo HS256, ≥ 32 caracteres. Gerar: `openssl rand -base64 32`. Trocar invalida todas as sessões. |
| `AUTH_SESSION_TTL_HOURS` | Não | `8` | `src/server/auth/session.ts` | Duração da sessão (1–72). |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Só para criar admin local | — | `prisma/seed.ts` | Ambas preenchidas **e** `NODE_ENV != production` → cria/atualiza um `OWNER`; senha com menos de 12 caracteres é recusada. Nunca em produção. |
| `SEED_DEMO_CONTENT` | Não | `true` | `prisma/seed.ts` | Popula o banco com os `demo-data.ts`. |
| `NODE_ENV` | Definida pelas ferramentas | `development` | tudo | `production` bloqueia o seed e liga `Secure` no cookie. |

Nunca versionar `.env` (`.gitignore` ignora `.env*` e libera só `.env.example`). Conferir: `git check-ignore -v .env` deve apontar para a regra.

## Comandos

| Comando | Uso |
|---|---|
| `pnpm dev` | Desenvolvimento com Turbopack e Cache Components; erros de "blocking route" aparecem no overlay |
| `pnpm build && pnpm start` | Simula produção local (necessário para e2e e para validar prerender) |
| `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm check` | Portões locais |
| `pnpm format` | Prettier em todo o repositório (`.md` é ignorado pelo `.prettierignore`) |
| `pnpm db:validate` · `pnpm db:generate` | Schema e cliente, sem banco |
| `pnpm db:migrate` | Cria/aplica migration local (`prisma migrate dev`) |
| `pnpm db:seed` | Seed local (`tsx prisma/seed.ts`) |
| `pnpm db:studio` | Prisma Studio em `http://localhost:5555` |
| `pnpm build && pnpm test:e2e` | Playwright contra `pnpm start`; fora do CI reaproveita um servidor já aberto. Porta: `PORT` (padrão 3000) ou `PLAYWRIGHT_BASE_URL` |
| `pnpm dlx shadcn@4.23.0 add <componente>` | Adicionar componente shadcn (versão fixada para reprodutibilidade) |

## Diagnóstico de problemas

| Sintoma | Causa provável | Solução |
|---|---|---|
| `Variáveis de ambiente inválidas: AUTH_SECRET: …` ao iniciar | Segredo com menos de 32 caracteres | Gere um novo com `openssl rand -base64 32` ou deixe vazio em modo demo |
| `CONTENT_SOURCE="database" exige DATABASE_URL definida` | Pediu banco sem URL | Defina `DATABASE_URL` ou use `CONTENT_SOURCE=demo` |
| `Banco de dados não configurado: defina DATABASE_URL` | Código de servidor tentou usar Prisma sem URL (só acontece fora do modo demo) | Configure o banco ou verifique por que a rota tocou o Prisma |
| Login responde "Painel indisponível: banco de dados não configurado" | Comportamento fail-closed | Suba o banco, rode `db:migrate` e `db:seed` com `SEED_ADMIN_*` |
| Login responde "E-mail ou senha inválidos" após seed | Seed não rodou com as variáveis, conta inativa ou senha diferente | Confira `SEED_ADMIN_*` no `.env`, rode `pnpm db:seed` de novo (é idempotente) |
| `Cannot find module '@/generated/prisma/client'` | Cliente não gerado | `pnpm db:generate` |
| Erro de build "blocking route" / "uncached data accessed outside Suspense" | Leitura de `cookies()`/banco fora de `<Suspense>` | Envolva o componente assíncrono em `<Suspense>` ([ADR 0006](DECISIONS.md#0006--cache-components-ligado-suspense-para-cookies-e-banco)) |
| `pnpm install` avisa "Ignored build scripts" | pnpm 11 bloqueou um script de pós-instalação | Adicione o pacote a `allowBuilds` em `pnpm-workspace.yaml` **se** for necessário; não libere tudo |
| Fontes não carregam no build sem internet | `next/font/google` busca as fontes no build | Garanta rede no build ou avalie self-hosting ([`DESIGN.md`](DESIGN.md#5-tipografia)) |
| Docker: `failed to connect to the docker API` | Daemon parado | Inicie o Docker Desktop/serviço; `docker compose config` valida o arquivo sem daemon |
| Playwright: "browserType.launch: Executable doesn't exist" | Chromium não instalado | `pnpm exec playwright install chromium` |
| Porta 3000 ou 5432 ocupada | Outro processo | `PORT=3100 pnpm dev` (ou `pnpm start`); para o e2e, `PORT=3100 pnpm test:e2e`; para o banco, mude `POSTGRES_PORT` e a `DATABASE_URL` |
| `/carreiras/<slug-inexistente>` responde `200` na primeira visita | `dynamicParams` é incompatível com `cacheComponents`; o Next serve o App Shell e transmite o 404 | Comportamento conhecido ([`ARCHITECTURE.md`](ARCHITECTURE.md#comportamentos-conhecidos)); visitas seguintes respondem `404` |

## Log

Em desenvolvimento o Prisma loga `warn` e `error`; em produção só `error`. A aplicação não loga IP, corpo de requisição de analytics nem credenciais. Falhas ao gravar analytics vão para `console.error` com prefixo `[analytics]`.
