# API — DevPath

> Contratos HTTP (Route Handlers) e Server Actions. Nível 2 da hierarquia documental. Cada item marcado como **Implementado**, **Planejado** ou **Pendente**. Não há SDK nem API pública para terceiros: os endpoints servem o próprio site.

## Visão geral

| Mecanismo | Quando usar | Onde fica |
|---|---|---|
| **Server Components** | Toda leitura para renderizar página. | `src/app/**` chamando `src/server/services/**` |
| **Server Actions** | Escrita autenticada originada de formulário do painel; login/logout. | `src/features/*/actions/*.ts` (`"use server"`) |
| **Route Handlers** | O que precisa ser HTTP puro: health check, beacon de analytics, futuros webhooks. | `src/app/api/**/route.ts` |

Não há versionamento de URL (`/api/v1`): a API é interna. Mudança incompatível é tratada no mesmo PR que atualiza o consumidor.

## Convenções dos Route Handlers

- Runtime Node.js (Cache Components não suporta `runtime` por segmento; não exportar `runtime`).
- Entrada **sempre** validada com Zod; schema compartilhado com o cliente quando ele existe (`src/features/*/schemas`).
- Resposta JSON com `content-type: application/json; charset=utf-8`.
- Métodos não suportados respondem `405` com cabeçalho `Allow`.
- Sem CORS liberado: os endpoints só são chamados pela própria origem. Pedido de outra origem é tratado como não suportado (Planejado: resposta explícita `403` se surgir necessidade).
- Nenhum endpoint grava ou loga IP, user-agent completo ou identificador de visitante.
- Cabeçalhos de segurança globais vêm de `next.config.ts` ([`Security-Guide.md`](Security-Guide.md#8-cabeçalhos-e-transporte)).

## Formato de erro

Route Handlers respondem erros com um objeto `error`:

```json
{
  "error": {
    "code": "validation_error",
    "message": "Evento inválido.",
    "issues": [{ "path": "path", "message": "path deve ser um caminho interno sem query string" }]
  }
}
```

| Código HTTP | `error.code` | Quando | Estado |
|---|---|---|---|
| 400 | `invalid_json` | Corpo não é JSON válido | Implementado |
| 400 | `validation_error` | Schema Zod rejeitou; `issues` lista caminho e mensagem | Implementado |
| 413 | `payload_too_large` | `Content-Length` acima do limite do endpoint | Implementado |
| 429 | `rate_limited` | Limite de taxa atingido; cabeçalho `Retry-After` em segundos | Implementado |
| 405 | — | Método não exportado pelo handler (resposta padrão do Next.js) | Implementado (framework) |
| 401 / 403 / 404 / 500 | `unauthenticated` / `forbidden` / `not_found` / `internal_error` | Reservados para endpoints futuros | Planejado |

`code` é um identificador estável em inglês (para código cliente); `message` é texto em português para pessoas. Erros nunca revelam stack, SQL ou existência de registros internos.

## Autenticação

| Superfície | Mecanismo | Estado |
|---|---|---|
| Route Handlers públicos (`/api/health`, `/api/analytics/events`) | Nenhum. Protegidos por validação estrita, limite de taxa e ausência de dados sensíveis na resposta. | Implementado |
| Server Actions do painel | Cookie `devpath_admin_session` (JWT HS256) verificado por `requireAdminSession()` **dentro** da action, além da barreira do `proxy.ts`. Server Actions têm verificação de `Origin` nativa do Next.js (CSRF). | Implementado para login/logout; actions de conteúdo Planejadas |
| Endpoints administrativos HTTP (`/api/admin/*`) | Não existem. Se surgirem, usarão a mesma sessão e `401`/`403` acima. | Planejado (sem data) |

Detalhes da sessão: [`Security-Guide.md`](Security-Guide.md#3-autenticação-do-painel).

## Rate limit

Implementado em memória (`src/server/auth/rate-limit.ts`), por chave derivada do primeiro IP de `X-Forwarded-For` (não persistida):

| Alvo | Limite | Janela | Resposta ao exceder |
|---|---|---|---|
| Login (`loginAction`) | 5 tentativas | 15 min | Estado de formulário "Muitas tentativas…" |
| `POST /api/analytics/events` | 120 eventos | 1 min | `429` + `Retry-After` |

Limitação conhecida: contador por instância (serverless). Versão compartilhada é Planejada ([ADR 0008](DECISIONS.md#0008--rate-limit-em-memória-como-medida-provisória)).

## Endpoints

### `GET /api/health` — Implementado

Sonda de disponibilidade. Não toca o banco (para não acoplar a disponibilidade do site à do banco).

**Resposta `200`:**

```json
{
  "status": "ok",
  "service": "devpath",
  "contentSource": "demo",
  "database": "not_configured",
  "timestamp": "2026-10-29T00:00:00.000Z"
}
```

| Campo | Significado |
|---|---|
| `contentSource` | `demo` ou `database` — origem efetiva do conteúdo neste processo. |
| `database` | `configured` quando há `DATABASE_URL`, senão `not_configured`. **Não** significa que o banco está acessível (não é readiness check). |

Não expõe se `AUTH_SECRET` existe, versão de dependências nem hostname. Cache: `Cache-Control: no-store`.

### `POST /api/analytics/events` — Implementado

Recebe um evento de navegação enviado pelo cliente (`navigator.sendBeacon` ou `fetch` com `keepalive`).

**Requisição:** corpo JSON (o cliente envia por `sendBeacon` com Blob `application/json`, ou `fetch` com `keepalive`). Ordem de verificação no servidor: limite de taxa → `Content-Length` (máximo 2 048 bytes) → JSON válido → schema.

```json
{
  "type": "COURSE_CLICK",
  "path": "/cursos",
  "targetSlug": "mdn-aprenda-desenvolvimento-web",
  "externalHost": "developer.mozilla.org"
}
```

Schema (`src/features/analytics/schemas.ts`, `strict` — campo extra é rejeitado):

| Campo | Tipo | Regras |
|---|---|---|
| `type` | enum | `PAGE_VIEW` · `ROADMAP_CLICK` · `COURSE_CLICK` · `PROJECT_CLICK` · `CAREER_NAVIGATION` · `EXTERNAL_LINK_CLICK` |
| `path` | string | Caminho interno, começa com `/`, sem query string nem fragmento, ≤ 512 |
| `targetSlug` | string? | Slug `^[a-z0-9]+(?:-[a-z0-9]+)*$`, ≤ 120 |
| `externalHost` | string? | Só o host (`^[a-z0-9.-]+$`), ≤ 253 |

**Respostas:**

| Código | Quando | Corpo |
|---|---|---|
| `202` | Evento aceito (gravado **ou** descartado por ausência de banco — o cliente não precisa distinguir) | vazio |
| `400` | JSON inválido (`invalid_json`) ou schema rejeitado (`validation_error`) | formato de erro |
| `413` | `Content-Length` > 2 048 bytes (`payload_too_large`) | formato de erro |
| `429` | Limite excedido (`rate_limited`) | formato de erro + `Retry-After` |

Não há `GET`: eventos não são consultáveis por HTTP. O que é armazenado e por quanto tempo: [`DATABASE.md`](DATABASE.md#analytics) e [`INTEGRATION.md`](INTEGRATION.md#analytics).

### `GET /sitemap.xml` e `GET /robots.txt` — Implementado

Gerados por `src/app/sitemap.ts` e `src/app/robots.ts`. O sitemap inclui as rotas públicas estáticas e os detalhes publicados de carreiras, roadmaps e lendas (`/carreiras/<slug>`, `/roadmaps/<slug>`, `/lendas-da-ti/<slug>`), sem `lastModified` fictício; se a fonte de conteúdo falhar, devolve só as estáticas. `robots` permite `/` e bloqueia `/admin`, `/admin/` e `/api/`. Em modo demo reflete o conteúdo demonstrativo.

## Server Actions

### `loginAction(prevState, formData)` — Implementado

Arquivo: `src/features/admin/actions/login.ts`.

| Entrada (`FormData`) | Validação |
|---|---|
| `email` | `trim`, ≤ 254, formato de e-mail, normalizado para minúsculas |
| `password` | 8–128 caracteres |

Retorna `LoginFormState`:

```ts
{ status: "idle" | "error"; message?: string; fieldErrors?: { email?: string; password?: string } }
```

Em sucesso não retorna: grava o cookie de sessão e redireciona para `/admin/dashboard`. Mensagens de falha (todas em pt-BR, em `authFailureMessages`):

| `reason` | Mensagem | Causa |
|---|---|---|
| `auth_not_configured` | "Autenticação indisponível: AUTH_SECRET não configurado…" | Ambiente sem segredo |
| `db_unavailable` | "Painel indisponível: banco de dados não configurado…" | Sem `DATABASE_URL` |
| `rate_limited` | "Muitas tentativas. Aguarde alguns minutos…" | 5 tentativas / 15 min |
| `invalid_credentials` | "E-mail ou senha inválidos." | E-mail inexistente, senha errada **ou** conta inativa (mesma mensagem, de propósito) |

### `logoutAction()` — Implementado

Apaga o cookie de sessão e redireciona para `/admin/login`.

### Actions de conteúdo — Planejado

| Action | Entrada (Zod) | Regra |
|---|---|---|
| `createCareerAction`, `updateCareerAction`, `archiveCareerAction` | Campos do modelo `Career` | `requireAdminSession()`; slug único; `publishedAt` preenchido na primeira publicação |
| Equivalentes para roadmap (com etapas/tópicos), curso, projeto, tecnologia, figura histórica e conteúdo editorial | — | Mesmas regras; transições `DRAFT → PUBLISHED → ARCHIVED` e `PUBLISHED → DRAFT` |
| `createAdminAction`, `deactivateAdminAction` | e-mail, nome, papel | `requireOwnerSession()` |

Contratos exatos entram neste documento **quando** a feature for especificada ([`spec/README.md`](spec/README.md)).

## Planejado vs implementado — resumo

| Item | Estado |
|---|---|
| `GET /api/health` | Implementado |
| `POST /api/analytics/events` | Implementado |
| `loginAction` / `logoutAction` | Implementado |
| Formato de erro | Implementado nos handlers existentes |
| Rate limit em memória | Implementado |
| Actions de CRUD de conteúdo | Planejado |
| Gestão de administradores | Planejado |
| Endpoints `/api/admin/*` | Planejado (só se houver necessidade de HTTP puro) |
| Rate limit compartilhado | Planejado |
| Resposta explícita a CORS | Planejado (se necessário) |
