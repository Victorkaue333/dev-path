# INTEGRATION — DevPath

> Integrações externas: o que está planejado, o que depende de decisão e o que já existe. Nível 4 da hierarquia documental. **Nenhuma integração está operacional** neste bootstrap; o único "externo" em uso hoje é o Google Fonts no build.

## Estado geral

| Integração | Finalidade | Estado |
|---|---|---|
| Vercel | Hospedagem da aplicação | Planejado — sem projeto criado, sem deploy |
| PostgreSQL externo | Banco de produção | Pendente — provedor não escolhido |
| Google Fonts (`next/font/google`) | Inter e Permanent Marker | Implementado (fetch no build; fontes servidas pelo próprio app) |
| Analytics first-party | Métricas de navegação | Implementado (coleta), desligado por padrão; agregação Planejada |
| Provedores de cursos e documentação | Links externos do conteúdo | Implementado como links; nenhuma API consumida |
| Armazenamento de assets (imagens) | Retratos, ilustrações | Pendente de decisão (ver [Assets](#assets-e-imagens)) |
| Rate limit compartilhado (KV/Redis) | Proteção do login no serverless | Planejado ([ADR 0008](DECISIONS.md#0008--rate-limit-em-memória-como-medida-provisória)) |
| E-mail transacional | Recuperação de senha de admin | Planejado (sem provedor) |
| Observabilidade / erros | Logs e alertas | Pendente de decisão |

## Vercel

**Papel:** build e hospedagem da aplicação Next.js (Server Components, Server Actions, Route Handlers, imagens, fontes).

| Item | Definição |
|---|---|
| Comando de build | `pnpm build` (`prisma generate && next build`) |
| Gerenciador | pnpm 11 via `packageManager` + corepack |
| Node | 24 |
| Variáveis | Todas as de [`ENVIRONMENT.md`](ENVIRONMENT.md) marcadas como "produção", cadastradas no painel do projeto por ambiente (Production/Preview) |
| Preview deployments | Devem apontar para um banco **separado** do de produção ou rodar em `CONTENT_SOURCE=demo` sem `AUTH_SECRET` (painel bloqueado) |
| O que a Vercel **não** fornece por padrão | PostgreSQL. Qualquer "Postgres" do marketplace é um provedor externo contratado à parte ([ADR 0013](DECISIONS.md#0013--vercel-como-destino-e-postgresql-externo)) |

Procedimento, checklist e rollback: [`DEPLOY.md`](DEPLOY.md).

## Banco de dados externo

**Papel:** PostgreSQL 17 (ou 16+) acessível pela Vercel, com migrations aplicadas por `prisma migrate deploy`.

Critérios de escolha do provedor (decisão Pendente):

| Critério | Por quê |
|---|---|
| **Pooling de conexões** (PgBouncer ou equivalente) ou limite alto de conexões | Funções serverless abrem muitas conexões curtas |
| Região próxima da região das funções da Vercel | Latência por requisição |
| Backups automáticos e point-in-time recovery | Conteúdo editorial é o ativo do projeto |
| TLS obrigatório | `DATABASE_URL` com `sslmode=require` |
| Plano gratuito/baixo custo com possibilidade de crescer | Projeto sem receita |
| Branching de banco (desejável) | Preview deployments com dados isolados |

Candidatos usuais: Neon, Supabase (só o Postgres), Railway, Render, Vercel Marketplace (Neon/Supabase por trás). A escolha vira ADR.

Contrato com a aplicação: só `DATABASE_URL`. Se o provedor exigir URL distinta para migrations (sem pooler), documentar como `DIRECT_URL` em `ENVIRONMENT.md` e `prisma.config.ts` no mesmo PR.

## Analytics

**Papel:** medir uso do site sem dados pessoais, para o painel administrativo. Implementação em `src/features/analytics/*`, `src/app/api/analytics/events/route.ts`, `src/server/analytics/record-event.ts`. Decisão: [ADR 0007](DECISIONS.md#0007--analytics-first-party-sem-identificadores-desligado-por-padrão).

### O que é coletado

| Campo | Exemplo | Observação |
|---|---|---|
| `type` | `COURSE_CLICK` | Um de seis tipos fixos |
| `path` | `/cursos` | Caminho interno, sem query string nem fragmento |
| `targetSlug` | `mdn-aprenda-desenvolvimento-web` | Opcional; slug do conteúdo clicado |
| `externalHost` | `developer.mozilla.org` | Opcional; só o host do link externo |
| `occurredAt` | timestamp do servidor | — |

### O que **não** é coletado nem armazenado

IP, user-agent (completo ou reduzido), cookie, identificador de visitante/sessão, referrer, query string, geolocalização, resolução de tela, idioma do navegador, qualquer fingerprint. O IP é usado apenas em memória como chave do limitador de taxa e descartado.

### Avaliação de privacidade (LGPD)

- **Base legal prevista:** legítimo interesse para estatística de uso agregada, dado que nenhum dado pessoal é tratado. **Esta afirmação precisa de revisão antes de ligar a coleta**: `path` e `targetSlug` não identificam pessoas, mas a combinação com logs do provedor (Vercel registra IP nos logs de função) deve ser considerada na avaliação.
- **Não afirmar "anônimo"** em textos públicos até a revisão; usar "sem identificação de visitantes".
- **Transparência:** página "Sobre" ou "Privacidade" (Planejada) descreve a coleta quando ela for ligada.
- **Retenção:** proposta de 90 dias para `AnalyticsEvent`, agregados sem prazo. Decisão Pendente.
- **Ativação:** `NEXT_PUBLIC_ANALYTICS_ENABLED=true` só após a revisão acima, registrada no `CHANGELOG.md`.

### Pipeline

| Etapa | Estado |
|---|---|
| Cliente → `POST /api/analytics/events` | Implementado |
| Validação, limite, gravação em `AnalyticsEvent` | Implementado |
| Agregação diária → `AnalyticsDailyAggregate` | Planejado (Server Action protegida ou job agendado; sem provedor de cron decidido) |
| Dashboard no painel | Planejado (estado vazio hoje) |
| Expurgo de eventos antigos | Planejado |

## Provedores de cursos e documentação

O DevPath **só referencia** recursos externos por link (`Course.url`, `Technology.website`). Não há consumo de API, scraping, importação automática ou afiliação.

Regras editoriais:

- Só recursos gratuitos ou documentação oficial (`isFree = true`; `isOfficialDocs` quando for a documentação do projeto).
- `provider` identifica a origem (MDN Web Docs, react.dev, Python Software Foundation, git-scm.com, freeCodeCamp…).
- Links abrem em nova aba com `rel="noopener noreferrer"`; cliques geram `COURSE_CLICK`/`EXTERNAL_LINK_CLICK` com `externalHost` quando o analytics está ligado.
- Verificação periódica de links quebrados: Planejado (script ou CI).

Nenhum provedor tem contrato, parceria ou integração operacional com o DevPath.

## Assets e imagens

Hoje: tudo em `public/assets/*`, servido pelo próprio app via `next/image`; `images.remotePatterns` está vazio. Decisão Pendente se ilustrações pesadas irão para armazenamento externo (Vercel Blob, S3 compatível) — só se o repositório ficar grande. Inventário e regras: [`assets/README.md`](assets/README.md).

## Autenticação

Não há provedor externo de identidade: a autenticação do painel é própria ([ADR 0004](DECISIONS.md#0004--autenticação-própria-do-painel-jose--bcrypt--cookie-httponly)). Integração futura possível: provedor de e-mail transacional para recuperação de senha (Planejado; candidatos Resend, Postmark; vira ADR).

## Variáveis por integração

| Integração | Variáveis |
|---|---|
| Vercel | `NEXT_PUBLIC_SITE_URL` (domínio público), todas as de produção |
| Banco | `DATABASE_URL` (+ `DIRECT_URL` se o provedor exigir) |
| Analytics | `NEXT_PUBLIC_ANALYTICS_ENABLED` |
| Auth | `AUTH_SECRET`, `AUTH_SESSION_TTL_HOURS` |
| Seeds (nunca produção) | `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_DEMO_CONTENT` |

Definições completas em [`ENVIRONMENT.md`](ENVIRONMENT.md).

## Decisões em aberto

| Decisão | Impacto | Onde registrar |
|---|---|---|
| Provedor de PostgreSQL | Desbloqueia painel e conteúdo real | ADR nova |
| KV/Redis para rate limit | Segurança do login em escala | ADR 0008 (atualizar) |
| Retenção de eventos e mecanismo de agregação | Dashboard | ADR 0007 (atualizar) |
| Provedor de e-mail | Recuperação de senha | ADR nova |
| Observabilidade (logs/erros) | Operação | ADR nova |
| Armazenamento de assets | Tamanho do repositório | ADR nova (se necessário) |
