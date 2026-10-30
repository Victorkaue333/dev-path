# Changelog — DevPath

Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). Versionamento: [SemVer](https://semver.org/lang/pt-BR/). Cada entrada diz **o que** mudou e, quando não for óbvio, **por quê**.

## [Não publicado]

Bootstrap da base técnica e documental (29/out/2026). Nenhuma versão publicada ainda; nenhum deploy.

### Adicionado

- **Aplicação Next.js 16.4** (App Router, Cache Components, `src/proxy.ts`) com TypeScript strict, Tailwind CSS 4 e shadcn/ui 4 (preset `radix-nova`): `button`, `card`, `input`, `label`, `badge`, `alert`, `separator`, `skeleton`, `table`, `sheet`, `textarea`.
- **Tokens do Design System** em `src/app/globals.css` (paleta `--dp-*`, Inter + Permanent Marker, sombras de papel, raios, movimento, `prefers-reduced-motion`) e mapeamento para os tokens semânticos do shadcn.
- **Componentes do Design System** (`src/components/design-system/`): `PaperCard`, `StickyNote`, `Tape`, `Doodle`, `CharacterSticker`, `RetroTerminal`, `SectionHeading`; `CareerCard` e `RoadmapStep` nas respectivas features; `Reveal` (Motion com `useReducedMotion`), `DevNotice`, `EmptyState`, `StatusBadge` — contratos e versão inicial, sem reproduzir as telas finais.
- **Hero da página inicial** em tela inteira no estilo colagem (`src/features/home/components/`: `Hero`, `HeroWordmark`, `HeroCharacter`, `HeroCareers`): lettering marker com contorno tinta e papel rasgado, tagline, parágrafo, CTAs "Explorar roadmaps" e "Ver carreiras", Ada Lovelace e Alan Turing com os PNGs oficiais e etiquetas, post-its, rabiscos SVG, terminal retrô e linha de carreiras publicadas. Sem busca, contador de pessoas, vídeo ou login (regras do produto). Utilitários `.dp-hero-bg` e `.dp-ink-outline` em `globals.css`.
- **Specs das telas** em `docs/spec/features/`: guarda-chuva `paginas-publicas-v1.md` + home, carreiras (lista/detalhe), roadmaps (lista/detalhe), cursos, projetos (lista/detalhe), com wireframes desktop/mobile, dados, assets, estados, SEO, acessibilidade e critérios de aceite; mercado, lendas, sobre, 404, erro e painel ficam para a próxima rodada (índice em `docs/spec/features/README.md`).
- **Folhas de adesivos de referência** salvas em `docs/assets/references/` (objetos retrô e cultura dev) para recorte reproduzível por `pnpm assets:recortar-folha` (script e recortes em `public/assets/objects/` e `public/assets/stickers/`, conforme inventário).
- **Hero dimensionada pela altura da tela**: logo, personagens, textos, botões e cartões usam `clamp()` com `svh` para a hero inteira (até a linha "Disciplina + Prática…") caber na altura visível em 1080p e em notebooks; post-its somem abaixo de 840 px de altura; tagline em tira de papel kraft rasgado em uma linha.
- **Seis carreiras na hero** como no mockup (Frontend, Backend, Full Stack, DevOps, Dados, IA) em cartões de papel rasgado (`objects/nota-papel-rasgado.webp`, `HeroCareerCard`); `Career` ganhou `shortTitle` e `tagline` opcionais (schema, tipos, repositórios, seed e conteúdo demo); "Segurança da Informação" entra como rascunho para exercitar o filtro de publicação.
- **Versões com fundo transparente** (`.webp`, mesmo nome-base) geradas a partir dos PNGs opacos entregues: `branding/logo-devpath.webp` (usado na hero e no README), `objects/tux-e-livros-sticker.webp` (canto da hero), `objects/computador-retro.webp`, `characters/linus-torvalds.webp` (Lendas da TI) e `characters/programador-jovem.webp`. Script reproduzível em `scripts/remover-fundo-sticker.cjs` (`pnpm assets:remover-fundo`), com `sharp` como dependência de desenvolvimento.
- **Computador retrô oficial** (`public/assets/objects/terminal-retro-v320.png`, PNG transparente) no canto inferior esquerdo da hero, no lugar do `RetroTerminal` em CSS.
- **Fundo oficial da hero** (`public/assets/textures/hero-background.png`, mural verde com rabiscos) aplicado via `next/image` com fallback em CSS.
- **Cabeçalho público no estilo do mockup**: faixa de papel rasgado oficial (`objects/faixa-papel-rasgado.webp`) aplicada via `border-image` em 3 fatias (`.dp-paper-strip`: pontas rasgadas com proporção fixa, miolo estica), altura 5,5 rem, navegação completa só a partir de 1280 px (menu lateral abaixo disso), logo com coroa, item ativo com marcador verde, CTA "Começar agora" (/carreiras) e fitas nas pontas; "Início" entra na navegação do cabeçalho. Sem campo de busca (fora do escopo).
- **Lendas da TI** com retratos oficiais (`imagePath`) para Ada Lovelace, Alan Turing, Grace Hopper, Margaret Hamilton e Tim Berners-Lee; Linus Torvalds registrado sem imagem até existir export transparente. `CharacterSticker` passou a exibir o recorte inteiro (os PNGs já vêm em formato de adesivo).
- **Ícone do site** (`src/app/icon.svg`, ícone "P" em estilo adesivo) no lugar do `favicon.ico` padrão do Next.
- **Layout público** (`SiteHeader` com `MainNav`/`MobileNav`, `SiteFooter`, `SkipLink`, `error.tsx`) e página inicial provisória identificada como base de desenvolvimento; rotas `/carreiras`, `/carreiras/[slug]`, `/roadmaps`, `/roadmaps/[slug]`, `/cursos`, `/projetos`, `/mercado`, `/lendas-da-ti`, `/lendas-da-ti/[slug]`, `/sobre`.
- **Layout administrativo** (`AdminShell`) protegido por `requireAdminSession()` dentro de `<Suspense>` e por `proxy.ts` (que também manda administrador já autenticado de `/admin/login` para o dashboard e limpa cookie inválido), com páginas-base `dashboard`, `carreiras`, `roadmaps`, `cursos`, `projetos`, `conteudos`, `analytics` (`PlannedSection`/`AdminPageHeader`, estado "Planejado", sem CRUD) e login em `/admin/login` fora do layout do painel.
- **Autenticação do painel**: Server Action `loginAction` com Zod, regra pura `authenticateAdmin` (fail-closed: sem `AUTH_SECRET` → sem banco → limite de tentativas → credenciais), sessão JWT HS256 (jose) em cookie `devpath_admin_session` httpOnly/SameSite=Lax/Secure em produção, senha com bcrypt (custo 12), limitador de tentativas em memória.
- **Camada de conteúdo**: interface `ContentRepository` com implementações `DemoContentRepository` (arquivos locais) e `PrismaContentRepository` (PostgreSQL), seleção por `CONTENT_SOURCE`/`DATABASE_URL`, fachada `content-service`. Ambas só devolvem conteúdo `PUBLISHED`.
- **Conteúdo demonstrativo** explícito em `src/features/{careers,roadmaps,courses,projects,market,legends}/demo-data.ts` — única fonte transitória, consumida pelo site em modo demo e pelo seed.
- **Prisma 7.10.1**: `prisma.config.ts`, `prisma/schema.prisma` (carreiras, roadmaps, etapas, tópicos como taxonomia compartilhada via `RoadmapStepTopic`, cursos, projetos, tecnologias, figuras históricas, conteúdo editorial, administradores, eventos e agregados de analytics; estados `DRAFT/PUBLISHED/ARCHIVED`, slugs únicos, timestamps) e `prisma/seed.ts` idempotente (admin só com `SEED_ADMIN_*` de ≥ 12 caracteres e fora de produção).
- **Analytics first-party**: schema Zod do evento (sem IP, sem user-agent, sem identificador), `trackEvent`, `PageViewTracker`, `TrackedLink`, `POST /api/analytics/events` (202 vazio; no-op sem banco; 400/413/429 com `error.code`) — desligado por padrão (`NEXT_PUBLIC_ANALYTICS_ENABLED=false`).
- **SEO**: `metadataBase`, títulos/descrições por página, Open Graph, canonical, `robots.ts` (bloqueia `/admin` e `/api`), `sitemap.ts`; rotas administrativas com `noindex` e `X-Robots-Tag`.
- **Cabeçalhos de segurança** em `next.config.ts` (nosniff, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy, `frame-ancestors 'none'`, HSTS; `/admin` com `Cache-Control: no-store`).
- **Infra local e CI**: `docker-compose.yml` (`postgres:17-alpine`), `.env.example` completo sem segredos, `.github/workflows/ci.yml` com job `quality` (install, `db:generate`, `db:validate`, lint, `format:check`, typecheck, test, build) e job `e2e` (Playwright/Chromium contra o build) — sem deploy; templates de issue e PR.
- **Testes**: Vitest (`vitest.config.mts`, jsdom, stub de `server-only`) com unitários de slug, schemas Zod, `resolveContentSource`, repositório demo, limitador, token de sessão, `authenticateAdmin` e `SectionHeading`, integração de `GET /api/health` e `POST /api/analytics/events`; Playwright (`tests/e2e/public-smoke.spec.ts`: home, carreiras, roadmap, 404, robots/sitemap, cabeçalhos, redirecionamento e bloqueio do admin).
- **Assets**: SVGs de `decorations/`, `branding/` e `objects/` recriados no estilo adesivo do logotipo oficial (halo creme, contorno tinta, cor chapada); PNGs oficiais de personagens (Ada Lovelace, Alan Turing, Grace Hopper, Margaret Hamilton, Linus Torvalds, Tim Berners-Lee, programador jovem) e objetos entregues pelo mantenedor em `public/assets/`; SVGs provisórios de ícones, decorações, objetos e texturas; inventário em `docs/assets/README.md`.
- **Ferramental**: pnpm 11.3.0 (`packageManager`, `allowBuilds` explícito), ESLint 9 flat config com regra que restringe o Prisma a `src/server/**`, Prettier 3 + plugin Tailwind, `.editorconfig`, `.nvmrc`.
- **Documentação**: `README.md`, `PROJECT_CONTEXT.md`, `AGENTS.md`, `CLAUDE.md`, `SECURITY.md`, `LICENSE` (decisão pendente), e `docs/` (PRD, ARCHITECTURE, API, DATABASE, DESIGN, DECISIONS com ADRs 0001–0014, INTEGRATION, DEPLOY, ENVIRONMENT, Code-Style, Security-Guide, CHECKLIST-E2E-STAGING, milestones M0/M1, spec e templates, inventário de assets).

### Alterado

- Cabeçalho público deixou de ser fixo com faixa própria: agora flutua transparente sobre o mural (hero na home; `.dp-mural-band` nas demais páginas).

### Removido

- Aviso amarelo "Base de desenvolvimento" (`DevNotice`) retirado do layout público a pedido do mantenedor; o componente segue disponível em `src/components/feedback/`.

- `README.md` inicial de uma linha substituído pela apresentação completa do projeto.

### Não feito (registrado para não parecer feito)

- Migrations não geradas (exigem banco acessível); Docker Compose validado por `docker compose config`, não executado.
- Deploy na Vercel não executado.
- Logo em paths, textura fotográfica de papel, ilustrações de cena e OG image: pendentes (o `logo-devpath.png` entregue não tem canal alfa, por isso `Logo` continua em texto + SVG).
- CSP estrita, rate limit compartilhado, agregação de analytics, CRUD do painel e telas finais: planejados.
- Comportamento conhecido: rota dinâmica com slug desconhecido responde `200` na primeira visita (App Shell + 404 em streaming) e `404` nas seguintes, porque `dynamicParams` é incompatível com `cacheComponents`.
