# DECISIONS — DevPath

> Registro de decisões arquiteturais (ADRs). Nível 3 da hierarquia documental: explica **por que** o que está nos documentos normativos é assim. Cada ADR tem Data, Status, Contexto, Decisão, Alternativas consideradas e Consequências. Status possíveis: **Aceita** · **Proposta** (tomada no bootstrap, aguarda aceite do mantenedor) · **Pendente** (decisão ainda não tomada) · **Superada por NNNN**.

## Índice

| # | Data | Decisão | Status |
|---|---|---|---|
| [0001](#0001--aplicação-única-nextjs-sem-backend-separado) | 2026-10-29 | Aplicação única Next.js, sem backend separado | Aceita (imposta pelo briefing) |
| [0002](#0002--pnpm-como-gerenciador-de-pacotes) | 2026-10-29 | pnpm como gerenciador de pacotes | Proposta |
| [0003](#0003--prisma-7-fixado-em-7101-com-driver-adapter-pg) | 2026-10-29 | Prisma 7 fixado em 7.10.1, com driver adapter pg | Proposta |
| [0004](#0004--autenticação-própria-do-painel-jose--bcrypt--cookie-httponly) | 2026-10-29 | Autenticação própria do painel: jose + bcrypt + cookie httpOnly | Proposta |
| [0005](#0005--conteúdo-demonstrativo-como-fonte-transitória-única) | 2026-10-29 | Conteúdo demonstrativo como fonte transitória única | Proposta |
| [0006](#0006--cache-components-ligado-suspense-para-cookies-e-banco) | 2026-10-29 | Cache Components ligado: Suspense para cookies e banco | Proposta |
| [0007](#0007--analytics-first-party-sem-identificadores-desligado-por-padrão) | 2026-10-29 | Analytics first-party sem identificadores, desligado por padrão | Proposta |
| [0008](#0008--rate-limit-em-memória-como-medida-provisória) | 2026-10-29 | Rate limit em memória como medida provisória | Proposta |
| [0009](#0009--cabeçalhos-de-segurança-no-nextconfig-csp-estrita-pendente) | 2026-10-29 | Cabeçalhos de segurança no next.config; CSP estrita pendente | Proposta |
| [0010](#0010--design-system-tailwind-v4--shadcnui-fontes-google) | 2026-10-29 | Design System: Tailwind v4 + shadcn/ui, fontes Google | Proposta |
| [0011](#0011--licença-do-projeto-decisão-pendente) | 2026-10-29 | Licença do projeto | **Pendente** |
| [0012](#0012--sem-cadastro-público-em-qualquer-forma) | 2026-10-29 | Sem cadastro público, em qualquer forma | Aceita (regra de produto) |
| [0013](#0013--vercel-como-destino-e-postgresql-externo) | 2026-10-29 | Vercel como destino e PostgreSQL externo | Aceita (imposta pelo briefing) |
| [0014](#0014--estrutura-modular-por-features-com-camada-server-only) | 2026-10-29 | Estrutura modular por features com camada server-only | Proposta |

Todas as datas são a do bootstrap (29/out/2026). "Proposta" significa que a decisão foi tomada e implementada pelo bootstrap com justificativa, mas o mantenedor ainda não a ratificou; ao ratificar, trocar para "Aceita por <nome> em <data real>".

---

## 0001 — Aplicação única Next.js, sem backend separado

- **Data:** 2026-10-29 · **Status:** Aceita (imposta pelo briefing)
- **Contexto:** O DevPath precisa de site público renderizado no servidor, um painel autenticado e dois endpoints HTTP simples. O briefing veda NestJS, Express, Fastify ou segunda aplicação.
- **Decisão:** Uma única aplicação Next.js 16 (App Router). Leitura por Server Components via camada `src/server` (`server-only`); escrita autenticada por Server Actions; HTTP puro por Route Handlers. Deploy único na Vercel.
- **Alternativas consideradas:**
  - *Backend separado (NestJS/Fastify) + front Next:* duas aplicações, dois deploys, duplicação de validação e auth. Vedado e desnecessário para o volume de regras do MVP.
  - *Site estático + CMS headless externo:* dependência de serviço de terceiros para o painel, custo e lock-in; perderia o controle de privacidade do analytics.
- **Consequências:** Toda regra de servidor vive em `src/server`; a fronteira é imposta por ESLint. Escalar para um backend separado no futuro exigiria extrair `src/server` — a interface `ContentRepository` já isola essa possibilidade. Cache Components passa a ser o modelo de renderização (0006).

## 0002 — pnpm como gerenciador de pacotes

- **Data:** 2026-10-29 · **Status:** Proposta
- **Contexto:** O briefing exige escolher npm **ou** pnpm e justificar. pnpm 11.3.0 e npm 11.21 estavam disponíveis na máquina; a Vercel detecta ambos pelo lockfile/`packageManager`.
- **Decisão:** pnpm 11, fixado em `"packageManager": "pnpm@11.3.0"`; `corepack enable` resolve a versão. `pnpm-workspace.yaml` declara `allowBuilds` explícito (pnpm 11 bloqueia scripts de pós-instalação por padrão): `esbuild`, `prisma`, `@prisma/engines`, `@prisma/client` liberados; `sharp` e `unrs-resolver` negados.
- **Alternativas consideradas:**
  - *npm:* onipresente, mas lockfile menos estrito contra dependências fantasma e instalação mais lenta; `package-lock.json` maior nos diffs.
  - *bun/yarn:* fora do briefing.
- **Consequências:** Um único lockfile (`pnpm-lock.yaml`); CI usa `pnpm/action-setup` + `--frozen-lockfile`. Dependência nova que precise de script de build deve ser adicionada a `allowBuilds` conscientemente. Instalação sem `corepack` pode usar versão diferente de pnpm — o `packageManager` avisa.

## 0003 — Prisma 7 fixado em 7.10.1, com driver adapter pg

- **Data:** 2026-10-29 · **Status:** Proposta
- **Contexto:** No dia do bootstrap, a tag `latest` do pacote `prisma` apontava para `8.0.0-rc.28` enquanto `@prisma/client` `latest` era `7.10.1`. Instalar "o mais novo" misturaria CLI em RC com cliente estável. O Prisma 7 mudou a configuração: URL fora do schema (`prisma.config.ts`), generator `prisma-client` com `output` obrigatório e driver adapter obrigatório.
- **Decisão:** `prisma` e `@prisma/client` fixados em `7.10.1` (sem `^`), `@prisma/adapter-pg` 7.10.1 + `pg`. Generator `prisma-client` com saída em `src/generated/prisma` (ignorada no git). `prisma.config.ts` lê `DATABASE_URL`; `dotenv` carregado só para a CLI. O `build` roda `prisma generate && next build` para a Vercel.
- **Alternativas consideradas:**
  - *Prisma 8 RC:* instável por definição; sem garantia de compatibilidade do cliente.
  - *Prisma 6 (schema antigo com `url`):* já superado; migração futura obrigatória.
  - *Drizzle / Kysely:* fora do briefing (Prisma é requisito).
- **Consequências:** Atualização de versão é decisão consciente (editar os três pacotes juntos). `pnpm db:generate` precisa rodar após `install` (não há postinstall). Quem importar o cliente usa `@/generated/prisma/client`, só em `src/server/**` e `prisma/**` (0014).

## 0004 — Autenticação própria do painel: jose + bcrypt + cookie httpOnly

- **Data:** 2026-10-29 · **Status:** Proposta
- **Contexto:** Só administradores se autenticam; não há cadastro público (0012), provedores sociais, MFA no MVP nem múltiplos tenants. A solução precisa rodar em Next.js/Vercel, não depender de serviço externo e falhar de forma segura quando o banco ainda não existe.
- **Decisão:** Sessão própria: JWT HS256 assinado com `AUTH_SECRET` (jose), emissor `devpath`, audiência `devpath-admin`, TTL `AUTH_SESSION_TTL_HOURS` (padrão 8 h), em cookie `devpath_admin_session` httpOnly, SameSite=Lax, Secure em produção, Path=/. Senha com bcrypt custo 12. Regra pura `authenticateAdmin()` fail-closed na ordem: segredo configurado → banco configurado → limite de tentativas → credenciais (comparação sempre executada, mensagem única). `requireAdminSession()` no layout e nas actions; `proxy.ts` como primeira barreira. Primeiro admin só via seed com `SEED_ADMIN_*` fora de produção.
- **Alternativas consideradas:**
  - *Auth.js (NextAuth):* robusto, mas traz adaptadores, provedores e tabelas que o DevPath não usa; a configuração de credenciais puras é o caminho menos recomendado da própria biblioteca.
  - *Clerk / Auth0 / Supabase Auth:* serviço externo, custo, lock-in e dados de administradores fora do controle; desproporcional para poucos admins.
  - *Sessão opaca no banco (tabela `Session`):* permite revogação imediata, mas exige banco em toda requisição do painel. Fica como evolução possível se revogação virar requisito.
- **Consequências:** Revogação só por expiração ou troca de `AUTH_SECRET` (invalida todas as sessões). CSRF coberto por SameSite=Lax + verificação de `Origin` nativa das Server Actions. Sem `AUTH_SECRET` ou sem banco o login responde com mensagem clara e nenhum bypass existe. MFA, recuperação de senha e troca obrigatória de senha provisória: Planejados ([`Security-Guide.md`](Security-Guide.md#17-riscos-conhecidos-em-aberto)).

## 0005 — Conteúdo demonstrativo como fonte transitória única

- **Data:** 2026-10-29 · **Status:** Proposta
- **Contexto:** A aplicação precisa iniciar sem banco remoto e mostrar uma experiência inicial, mas o briefing proíbe uma segunda fonte de verdade permanente e dados fictícios apresentados como reais.
- **Decisão:** O conteúdo demonstrativo vive **somente** em `src/features/*/demo-data.ts`, com cabeçalho "CONTEÚDO DEMONSTRATIVO", campo `status` e sem estatísticas de mercado. Dois consumidores: `DemoContentRepository` (site em `CONTENT_SOURCE=demo`) e `prisma/seed.ts` (popula o banco). A origem é resolvida uma vez por processo por `resolveContentSource()`: explícita por `CONTENT_SOURCE`; senão `database` se há `DATABASE_URL`, senão `demo`; `database` sem URL é erro. Em desenvolvimento, `DevNotice` informa a origem.
- **Alternativas consideradas:**
  - *Mock só no front com flag de ambiente:* duplica dados e regras; fácil de vazar para produção.
  - *SQLite local como "banco demo":* segundo SGBD, migrations duplicadas, divergência com PostgreSQL.
  - *Exigir banco desde o início:* bloqueia o desenvolvimento do site público até contratar o provedor.
- **Consequências:** Um único conjunto de dados demo, testável por unidade. A transição está definida ([`DATABASE.md`](DATABASE.md#transição-do-conteúdo-demonstrativo-para-o-banco)): depois da curadoria real, o demo vira fixture de teste. Qualquer alteração no formato demo exige atualizar o seed no mesmo PR.

## 0006 — Cache Components ligado: Suspense para cookies e banco

- **Data:** 2026-10-29 · **Status:** Proposta
- **Contexto:** O `create-next-app` 16.4 já vem com `cacheComponents: true` e `partialPrefetching: true`. Nesse modo, qualquer acesso a `cookies()`, `headers()`, `searchParams` ou dado não cacheado fora de `<Suspense>` é erro de build, e `runtime` por segmento não é suportado.
- **Decisão:** Manter Cache Components. Regras: leitura de runtime/banco sempre dentro de `<Suspense>` com `Skeleton`; `process.env` lido no escopo do módulo (`src/config/env.ts`, `getContentRepository()`); nenhum `export const runtime`; layout admin envolve `requireAdminSession()` em `<Suspense>`; valores únicos por requisição usam `connection()`.
- **Alternativas consideradas:**
  - *Desligar (`cacheComponents: false`):* volta ao modelo anterior, mais permissivo, mas o framework sinaliza que ambos serão padrão na próxima major — a dívida só cresceria.
- **Consequências:** Páginas públicas ganham shell estático instantâneo; erros de "blocking route" aparecem no dev e no build e devem ser corrigidos com Suspense ou `use cache`, nunca desligando a flag. Consulta ao banco em `generateMetadata` segue a mesma regra. `dynamicParams = false` é incompatível (o build falha): slug desconhecido em rota dinâmica responde `200` na primeira visita (App Shell + `not-found` em streaming) e `404` nas seguintes via ISR — registrado em [`ARCHITECTURE.md`](ARCHITECTURE.md#comportamentos-conhecidos).

## 0007 — Analytics first-party sem identificadores, desligado por padrão

- **Data:** 2026-10-29 · **Status:** Proposta
- **Contexto:** O painel precisará de métricas de navegação; o produto não tem cadastro e deve respeitar a LGPD sem fingerprinting. Nenhum número pode ser exibido sem coleta real.
- **Decisão:** Coleta própria: evento Zod `strict` com `type`, `path` (sem query), `targetSlug?`, `externalHost?` — sem IP, user-agent, cookie, identificador de visitante ou referrer completo. Cliente envia por `sendBeacon` para `POST /api/analytics/events`, só se `NEXT_PUBLIC_ANALYTICS_ENABLED=true`. Servidor valida, limita e grava `AnalyticsEvent`; sem banco, descarta e responde 202. Agregação diária em `AnalyticsDailyAggregate` para o dashboard (Planejada). Não se afirma "anônimo" sem a revisão descrita em [`INTEGRATION.md`](INTEGRATION.md#analytics).
- **Alternativas consideradas:**
  - *Google Analytics / Meta Pixel:* cookies de terceiros, transferência internacional, consentimento obrigatório; contrário ao posicionamento.
  - *Plausible/Umami auto-hospedado:* bom alinhamento de privacidade, mas é mais um serviço para operar; pode ser reconsiderado se a coleta própria crescer.
  - *Vercel Analytics:* simples, porém dependente do provedor e sem os eventos de domínio (cliques em roadmap/curso).
- **Consequências:** Métricas de "usuários únicos", retenção ou sessão são impossíveis por desenho — e isso é intencional. A chave de rate limit usa IP só em memória. O dashboard mostra estado vazio até a agregação existir.

## 0008 — Rate limit em memória como medida provisória

- **Data:** 2026-10-29 · **Status:** Proposta (com pendência explícita)
- **Contexto:** Login e endpoint de analytics precisam de proteção contra abuso desde o primeiro dia, mas não há Redis/KV nem tabela dedicada, e a Vercel executa várias instâncias.
- **Decisão:** `createMemoryRateLimiter` (janela deslizante): login 5/15 min, analytics 120/min, chave = primeiro IP de `X-Forwarded-For`, não persistida. Documentar que o contador é **por instância**.
- **Alternativas consideradas:**
  - *Vercel KV / Upstash Redis:* correto para serverless; adiciona serviço e custo — decisão a tomar com o provedor do banco.
  - *Tabela `LoginAttempt` no PostgreSQL:* sem serviço novo, mas grava IP (dado pessoal) e acopla ao banco.
  - *Nenhum limite:* inaceitável para o login.
- **Consequências:** Reduz, mas não impede, força bruta distribuída. Pendência registrada em [`Security-Guide.md`](Security-Guide.md#17-riscos-conhecidos-em-aberto); a troca de implementação não muda `authenticateAdmin()` (recebe `RateLimiter` por injeção).

## 0009 — Cabeçalhos de segurança no next.config; CSP estrita pendente

- **Data:** 2026-10-29 · **Status:** Proposta (CSP estrita Pendente)
- **Contexto:** Headers básicos são baratos e independentes de provedor; CSP estrita exige nonces nos scripts inline do Next e tratamento das fontes do Google.
- **Decisão:** `next.config.ts` aplica `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restritiva, `Content-Security-Policy: frame-ancestors 'none'`, HSTS; `/admin/:path*` recebe `X-Robots-Tag: noindex` e `Cache-Control: private, no-store`. `poweredByHeader: false`.
- **Alternativas consideradas:** CSP completa já no bootstrap (risco de quebrar fontes/scripts sem tempo de validar); headers só na Vercel (`vercel.json`) — menos portável.
- **Consequências:** Proteção contra clickjacking e sniffing desde já. CSP estrita com nonce via `proxy.ts` fica como item de segurança planejado, a validar com as fontes (self-hosting pode simplificar).

## 0010 — Design System: Tailwind v4 + shadcn/ui, fontes Google

- **Data:** 2026-10-29 · **Status:** Proposta
- **Contexto:** O briefing define Tailwind, shadcn/ui, Lucide e Motion, paleta inicial e fontes Inter/Permanent Marker; os mockups pedem uma linguagem de colagem editorial.
- **Decisão:** Tailwind CSS 4 sem `tailwind.config` (tokens em `globals.css` via `@theme inline`); shadcn/ui 4 com preset `radix-nova` (base Radix, não Base UI) e cor base `neutral` remapeada para a paleta DevPath; tokens brutos `--dp-*` separados dos semânticos; fontes via `next/font/google`; componentes próprios em `src/components/design-system`; tema escuro definido mas não priorizado; `prefers-reduced-motion` global.
- **Alternativas consideradas:**
  - *Preset Base UI (`base-nova`, padrão da CLI):* mais novo e menos testado em produção; Radix é a base histórica do shadcn.
  - *Self-hosting das fontes:* mais controle e build sem rede; adiado — registrado como alternativa.
  - *Biblioteca de componentes pronta (MUI, Chakra):* estética genérica incompatível com a identidade.
- **Consequências:** Mudança de cor = mudança de token, não de componente. Componentes shadcn são gerados pela CLI e não editados à mão. Tema escuro exige validação antes de ganhar alternador.

## 0011 — Licença do projeto: decisão pendente

- **Data:** 2026-10-29 · **Status:** **Pendente**
- **Contexto:** A licença de referência inspecionada no bootstrap era proprietária de outra organização e não pode ser copiada. O DevPath é um produto educacional público, mas "público" não significa "open source" automaticamente, e o conteúdo editorial pode merecer licença distinta do código.
- **Decisão (provisória):** Arquivo `LICENSE` declara que a licença não foi definida e que nenhuma autorização de uso/redistribuição é concedida até a decisão. `package.json` tem `"private": true` e nenhum campo `license`.
- **Alternativas a avaliar:**
  - *MIT:* máxima adoção e simplicidade; não cobre bem conteúdo editorial.
  - *Apache-2.0:* cláusula de patentes e marca; adequada se houver contribuição externa relevante.
  - *CC BY 4.0 (conteúdo) + MIT/Apache (código):* separa texto curado de software; comum em projetos educacionais.
  - *Proprietária / todos os direitos reservados:* mantém controle total; dificulta contribuição.
- **Consequências:** Contribuições externas devem aguardar a decisão (ou um CLA). Marcas e ilustrações de terceiros seguem seus próprios termos independentemente.

## 0012 — Sem cadastro público, em qualquer forma

- **Data:** 2026-10-29 · **Status:** Aceita (regra de produto)
- **Contexto:** O produto é um guia aberto; identificar visitantes não serve ao propósito e cria obrigações de privacidade e suporte.
- **Decisão:** Não existem login público, registro, perfil, dashboard individual, progresso em conta, favoritos sincronizados, assinaturas ou pagamentos. A única autenticação é a de administradores. Nenhum cookie é definido para visitantes.
- **Alternativas consideradas:** "Login opcional para salvar progresso" — rejeitado: abre caminho para toda a infraestrutura de contas. Progresso local no navegador (sem conta) pode ser avaliado no futuro como feature explícita.
- **Consequências:** Mockups que mostram avatar, "meu progresso" ou checkboxes de conclusão não são implementados ([`DESIGN.md`](DESIGN.md#o-que-os-mockups-mostram-e-não-entra)). O schema não tem tabela de usuários além de `AdminUser`.

## 0013 — Vercel como destino e PostgreSQL externo

- **Data:** 2026-10-29 · **Status:** Aceita (imposta pelo briefing)
- **Contexto:** Vercel é o destino de produção. O briefing é explícito: não assumir que a Vercel fornece PostgreSQL.
- **Decisão:** Deploy na Vercel com `pnpm build` (`prisma generate && next build`); banco PostgreSQL em provedor externo a escolher (critérios em [`INTEGRATION.md`](INTEGRATION.md#banco-de-dados-externo)); migrations por `prisma migrate deploy` em etapa controlada, não no build; segredos só no painel da Vercel. Local: Docker Compose com `postgres:17-alpine`.
- **Alternativas consideradas:** Integração "Postgres" do marketplace da Vercel (é um provedor externo por trás; pode ser a escolha, mas é decisão separada); VPS própria (mais operação, fora do briefing).
- **Consequências:** O app precisa funcionar sem banco em dev (0005) e falhar de forma clara em produção se `DATABASE_URL` faltar. Pooling/limite de conexões é requisito na escolha do provedor (serverless abre muitas conexões).

## 0014 — Estrutura modular por features com camada server-only

- **Data:** 2026-10-29 · **Status:** Proposta
- **Contexto:** O briefing pede arquitetura modular orientada a funcionalidades, separando apresentação, domínio, aplicação e infraestrutura sem abstrações excessivas.
- **Decisão:** `src/app` (rotas, só composição), `src/components` (`ui` gerado, `design-system`, `layout`, `branding`, `feedback`), `src/features/<dominio>` (demo-data, schemas, components, actions), `src/server` (`db`, `repositories`, `services`, `auth`, `analytics` — tudo `server-only`), `src/config`, `src/lib`, `src/types`. Interface `ContentRepository` com duas implementações; DTOs em `src/types` independentes do Prisma. ESLint impede importar `@/generated/*` fora de `src/server/**` e `prisma/**`. Pastas vazias não são criadas (`hooks/` só quando houver hook).
- **Alternativas consideradas:** Camadas por tipo técnico (`controllers/`, `models/`) — espalha um domínio por várias pastas; Clean Architecture completa com casos de uso e portas por entidade — abstração excessiva para o tamanho atual.
- **Consequências:** Feature nova = diretório novo em `features` + serviço/repositório se tocar dados. O custo é disciplina de importação, que a regra ESLint fiscaliza. Se um backend separado surgir um dia, `src/server` é o que se extrai.
