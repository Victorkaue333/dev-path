# Checklist E2E de homologação — DevPath

> Roteiro de homologação manual antes de publicar. Nível 5 da hierarquia documental. **Status inicial de todos os cenários: `Pendente`.** Nada aqui foi executado em staging porque não existe staging ([`DEPLOY.md`](DEPLOY.md#executado-vs-planejado)). A coluna "Automação Playwright" do §4 indica o que o e2e já cobre localmente (8 testes executados com sucesso nesta rodada contra `next start`); isso não substitui a homologação manual registrada aqui.

> **Executado automaticamente no bootstrap (30/out/2026):** suíte E2E `tests/e2e/public-smoke.spec.ts` (8 testes: home, carreiras, roadmap, 404, robots/sitemap, cabeçalhos de segurança, redirecionamento e bloqueio do login) contra `next start` local em modo demo. Isso cobre parte de PUB-* e SEC-*; os cenários abaixo continuam **Pendente** até a execução manual em staging com evidências.

## 1. Pré-requisitos

### 1.1 Serviços

| Serviço | Necessário para | Estado |
|---|---|---|
| Aplicação publicada (preview ou produção na Vercel) ou `pnpm build && pnpm start` local | Todos os cenários | Local: Implementado · Remoto: Pendente |
| PostgreSQL com migrations aplicadas e seed/conteúdo | Cenários ADM-* e CONT-* em modo `database` | Pendente |
| `AUTH_SECRET` configurado e um administrador criado | ADM-* | Pendente |
| Chromium para Playwright | Automação | `pnpm exec playwright install chromium` |

### 1.2 URLs

| Ambiente | URL | Estado |
|---|---|---|
| Local | `http://localhost:3000` | Disponível |
| Preview | — | Pendente |
| Produção | — | Pendente |

### 1.3 Variáveis (só nomes; valores nunca neste documento)

`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ANALYTICS_ENABLED`, `CONTENT_SOURCE`, `DATABASE_URL`, `AUTH_SECRET`, `AUTH_SESSION_TTL_HOURS`. Para cenários de modo demo: `CONTENT_SOURCE=demo` e `AUTH_SECRET` vazio. Para cenários de painel: `CONTENT_SOURCE=database`, `AUTH_SECRET` definido.

### 1.4 Usuários de teste (sem senha neste documento)

| Perfil | Como obter |
|---|---|
| Administrador `OWNER` | Seed local com `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` ou procedimento de [`DEPLOY.md`](DEPLOY.md#primeiro-administrador-em-produção) |
| Administrador `EDITOR` | Pendente (gestão de administradores é Planejada) |
| Visitante | Janela anônima do navegador |

### 1.5 Comandos

```bash
pnpm build && pnpm start        # servidor de produção local
pnpm test:e2e                   # automação (sobe o servidor sozinha)
curl -I http://localhost:3000   # cabeçalhos
```

### 1.6 Ordem de execução

INF → PUB → SEO → A11Y → RESP → SEG → ADM (quando houver banco) → ANA.

## 2. Como preencher

Cada cenário tem **ID · Funcionalidade**, Objetivo, Pré-requisitos, Passos, Resultado esperado, Resultado obtido, Status, Evidências, Observações. Ao executar, preencha Resultado obtido, Status (`Aprovado`, `Reprovado`, `Bloqueado`, `Não aplicável`) e Evidências (identificador do §5) e atualize a [matriz do §4](#4-matriz-de-cobertura). Cenário dependente de algo inexistente fica `Bloqueado` com a dependência do §6. Até a homologação real, tudo permanece `Pendente`.

## 3. Cenários

### 3.1 Infraestrutura (INF)

**INF-01 · Health**
- Objetivo: a aplicação responde e informa a origem do conteúdo.
- Passos: `GET /api/health`.
- Resultado esperado: `200`, JSON com `status: "ok"`, `service: "devpath"`, `contentSource`, `database` (`configured`/`not_configured`), `timestamp`; `Cache-Control: no-store`; sem segredos.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: `src/app/api/health/route.ts`.

**INF-02 · Cabeçalhos de segurança**
- Passos: `curl -I` na home e em `/admin/login`.
- Resultado esperado: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Content-Security-Policy: frame-ancestors 'none'`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`; em `/admin/*` também `X-Robots-Tag: noindex…` e `Cache-Control: private, no-store`; sem `X-Powered-By`.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: `next.config.ts`.

**INF-03 · Modo demo sem banco**
- Pré-requisitos: `DATABASE_URL` vazia.
- Passos: subir a aplicação; abrir `/`, `/carreiras`, `/roadmaps`.
- Resultado esperado: páginas renderizam com conteúdo demonstrativo; sem aviso de "base de desenvolvimento" no layout (removido em 30/out/2026); visível; nenhum erro 500.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**INF-04 · `CONTENT_SOURCE=database` sem `DATABASE_URL`**
- Resultado esperado: a aplicação falha de forma explícita com `ContentSourceConfigurationError` (não cai silenciosamente em demo).
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: comportamento intencional ([ADR 0005](DECISIONS.md#0005--conteúdo-demonstrativo-como-fonte-transitória-única)).

### 3.2 Site público (PUB)

**PUB-01 · Home**
- Passos: abrir `/`.
- Resultado esperado: título com "DevPath", carreiras publicadas listadas, navegação para as sete seções, sem avatar/login/busca, sem contadores de pessoas, rodapé com links.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**PUB-02 · Carreiras e detalhe**
- Passos: `/carreiras` → clicar em uma carreira → `/carreiras/<slug>`.
- Resultado esperado: lista só carreiras `PUBLISHED` (a carreira demo em rascunho **não** aparece); detalhe mostra descrição, roadmaps, tecnologias e projetos; slug inexistente → 404.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: `DemoContentRepository` filtra `status`.

**PUB-03 · Roadmaps e detalhe**
- Resultado esperado: lista roadmaps publicados com carreira e número de etapas; detalhe com etapas em ordem e tópicos; roadmap em rascunho não aparece nem por URL direta.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**PUB-04 · Cursos**
- Resultado esperado: só cursos publicados e gratuitos; provedor, idioma e nível visíveis; link externo abre em nova aba com `rel="noopener noreferrer"`; curso em rascunho ausente.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**PUB-05 · Projetos, Mercado, Lendas, Sobre**
- Resultado esperado: cada página renderiza; Mercado **não** mostra salários/percentuais; Lendas lista as figuras publicadas com placeholder explícito quando não há imagem; detalhe de lenda por slug; Sobre descreve o que o DevPath não faz.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**PUB-06 · 404 de rota estática**
- Passos: abrir `/nao-existe`.
- Resultado esperado: página 404 própria ("Esse caminho não existe"), em pt-BR, com link para a home; status HTTP 404.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: coberto pelo e2e.

**PUB-07 · Slug desconhecido em rota dinâmica (comportamento conhecido)**
- Passos: abrir `/carreiras/nao-existe` duas vezes, observando o status na aba Rede.
- Resultado esperado: o visitante vê a página 404 nas duas visitas; o status HTTP é `200` na **primeira** (App Shell + `not-found` em streaming) e `404` nas seguintes (ISR). Não é regressão: `dynamicParams = false` é incompatível com `cacheComponents` ([`ARCHITECTURE.md`](ARCHITECTURE.md#comportamentos-conhecidos)).
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

### 3.3 SEO (SEO)

**SEO-01 · Metadata por página**
- Passos: ver fonte de `/`, `/carreiras`, `/carreiras/<slug>`.
- Resultado esperado: `<title>` único por página com sufixo "| DevPath", `meta description`, `link rel="canonical"` com `NEXT_PUBLIC_SITE_URL`, `og:*` e `twitter:*`, `html lang="pt-BR"`.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: `buildPageMetadata`.

**SEO-02 · robots e sitemap**
- Passos: `GET /robots.txt`, `GET /sitemap.xml`.
- Resultado esperado: robots permite `/` e bloqueia `/admin` e `/api`, aponta o sitemap; sitemap lista as rotas estáticas e `/carreiras/<slug>` publicadas, nenhuma rota admin.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**SEO-03 · Admin não indexável**
- Passos: ver fonte de `/admin/login`.
- Resultado esperado: `meta name="robots" content="noindex, nofollow"` e cabeçalho `X-Robots-Tag`.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**SEO-04 · Sem dados estruturados fictícios**
- Resultado esperado: nenhum JSON-LD até existir conteúdo real (Pendente por decisão).
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

### 3.4 Acessibilidade (A11Y)

**A11Y-01 · Teclado**
- Passos: navegar a home e o detalhe de carreira só com Tab/Shift+Tab/Enter.
- Resultado esperado: `SkipLink` é o primeiro foco e leva ao conteúdo; foco visível em todos os controles; ordem lógica; menu móvel (`Sheet`) abre/fecha e prende o foco.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**A11Y-02 · Leitor de tela e semântica**
- Resultado esperado: landmarks `header/nav/main/footer`; decoração (`Tape`, `Doodle`) ignorada; imagens de conteúdo com `alt`; links externos anunciam nova aba.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**A11Y-03 · Contraste e movimento**
- Passos: auditoria axe/Lighthouse; ativar "reduzir movimento" no SO.
- Resultado esperado: sem violação de contraste AA; animações desligadas com `prefers-reduced-motion`.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**A11Y-04 · Formulário de login**
- Resultado esperado: labels associados, erro anunciado (`role="alert"`), `aria-invalid`/`aria-describedby` corretos, funciona sem JavaScript.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

### 3.5 Responsividade (RESP)

**RESP-01 · 320–414 px**
- Resultado esperado: sem rolagem horizontal; 1 coluna; navegação em `Sheet`; decorações pesadas ocultas; alvos ≥ 44 px.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**RESP-02 · 768 px e 1024 px+**
- Resultado esperado: 2 colunas em tablet; grade completa até 72 rem em desktop; stickers nas margens sem sobrepor texto.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

### 3.6 Segurança (SEG)

**SEG-01 · Acesso ao painel sem sessão**
- Passos: janela anônima → `/admin`, `/admin/dashboard`, `/admin/carreiras`.
- Resultado esperado: redirecionamento `307` para `/admin/login` em todas; nenhum conteúdo administrativo no corpo da resposta.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: `proxy.ts` + `requireAdminSession()`.

**SEG-02 · Login fail-closed sem configuração**
- Pré-requisitos: `AUTH_SECRET` vazio.
- Resultado esperado: mensagem "Autenticação indisponível: AUTH_SECRET não configurado…"; com `AUTH_SECRET` e sem banco: "Painel indisponível: banco de dados não configurado…". Nunca entra.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**SEG-03 · Credenciais inválidas e enumeração**
- Pré-requisitos: banco com admin.
- Passos: e-mail inexistente + senha qualquer; e-mail existente + senha errada.
- Resultado esperado: mesma mensagem "E-mail ou senha inválidos." nos dois casos; tempo de resposta semelhante.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**SEG-04 · Limite de tentativas**
- Passos: 6 tentativas erradas em sequência.
- Resultado esperado: a 6ª responde "Muitas tentativas…" sem consultar o banco; após login correto (quando permitido) o contador zera.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: limite por instância ([ADR 0008](DECISIONS.md#0008--rate-limit-em-memória-como-medida-provisória)).

**SEG-05 · Cookie de sessão**
- Passos: login válido; inspecionar o cookie no DevTools.
- Resultado esperado: `devpath_admin_session` com `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` em HTTPS, expiração = TTL; não legível por `document.cookie`.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**SEG-06 · Token adulterado/expirado**
- Passos: editar o valor do cookie; ou esperar o TTL (ou reduzir `AUTH_SESSION_TTL_HOURS=1` em teste).
- Resultado esperado: redirecionamento para o login; nenhum erro 500.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**SEG-07 · Logout**
- Resultado esperado: cookie removido; `/admin/dashboard` volta a redirecionar.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**SEG-08 · Analytics: payload inválido e flood**
- Passos: `POST /api/analytics/events` com campo extra (`{"type":"PAGE_VIEW","path":"/","ip":"1.2.3.4"}`), com `path` contendo `?`, com corpo não-JSON, com `Content-Length` > 2 048 bytes, e 130 requisições em um minuto.
- Resultado esperado: `400` (`validation_error`) para os dois primeiros, `400` (`invalid_json`) para o terceiro, `413` (`payload_too_large`) para o quarto, `429` (`rate_limited`) com `Retry-After` no flood; payload válido → `202` sem corpo.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**SEG-09 · Nenhum cookie para visitantes**
- Passos: navegar o site público em janela anônima; inspecionar cookies.
- Resultado esperado: nenhum cookie definido.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

### 3.7 Painel (ADM) — depende de banco

**ADM-01 · Login e dashboard**
- Resultado esperado: após login, `/admin/dashboard` mostra navegação administrativa, nome do admin, estado da coleta de analytics (vazio honesto) e botão de logout.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**ADM-02 · Páginas-base**
- Passos: visitar `carreiras`, `roadmaps`, `cursos`, `projetos`, `conteudos`, `analytics`.
- Resultado esperado: cada página renderiza com o estado "Planejado" e nenhuma operação de escrita disponível.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: CRUD é Planejado ([`PRD.md`](PRD.md) RF-23).

**ADM-03 · CRUD de conteúdo**
- Status: **Bloqueado** — funcionalidade Planejada; cenários serão escritos com a spec.

### 3.8 Conteúdo em modo banco (CONT)

**CONT-01 · Seed e paridade com o demo**
- Passos: `pnpm db:migrate`, `pnpm db:seed`, `CONTENT_SOURCE=database`, comparar `/carreiras` com o modo demo.
- Resultado esperado: mesmas carreiras publicadas; rascunhos continuam ocultos; seed idempotente (rodar duas vezes não duplica).
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

### 3.9 Analytics (ANA)

**ANA-01 · Coleta desligada por padrão**
- Pré-requisitos: `NEXT_PUBLIC_ANALYTICS_ENABLED` ausente/`false`.
- Passos: navegar com a aba Rede aberta.
- Resultado esperado: nenhuma requisição a `/api/analytics/events`.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

**ANA-02 · Coleta ligada**
- Pré-requisitos: `NEXT_PUBLIC_ANALYTICS_ENABLED=true` no build; banco opcional.
- Passos: navegar; clicar em curso externo.
- Resultado esperado: `PAGE_VIEW` por rota e `COURSE_CLICK` com `externalHost` (só host); payload sem IP/UA/identificador; `202`; com banco, linha em `AnalyticsEvent`.
- Resultado obtido: — · Status: **Pendente** · Evidências: — · Observações: —

## 4. Matriz de cobertura

| Área | Cenários | Automação Playwright | Local | Staging |
|---|---|---|---|---|
| INF | 01–04 | 02 (cabeçalhos) | Pendente | Pendente |
| PUB | 01–07 | 01, 02, 03, 06 | Pendente | Pendente |
| SEO | 01–04 | 02, 03 | Pendente | Pendente |
| A11Y | 01–04 | — | Pendente | Pendente |
| RESP | 01–02 | — | Pendente | Pendente |
| SEG | 01–09 | 01, 02 | Pendente | Pendente |
| ADM | 01–03 | — | Bloqueado (banco) | Bloqueado |
| CONT | 01 | — | Bloqueado (banco) | Bloqueado |
| ANA | 01–02 | — | Pendente | Pendente |

## 5. Registro de evidências

### 5.1 Onde guardar

`docs/evidencias/<AAAA-MM-DD>-<ambiente>/` (pasta criada na primeira execução; não versionar capturas com dados sensíveis). Cada evidência recebe identificador `EV-<n>`.

### 5.2 Modelo (copiar por execução)

```text
Execução: <AAAA-MM-DD> · Ambiente: <local|preview|produção> · Commit: <sha> · Executor: <nome>
Cenário: <ID> · Status: <Aprovado|Reprovado|Bloqueado|Não aplicável>
Resultado obtido: <texto>
Evidências: EV-<n> (<arquivo ou comando + saída>)
Observações: <texto>
```

## 6. Dependências, bloqueios e fora de escopo

### 6.1 Bloqueiam a execução inteira em staging

- Não existe ambiente de staging/preview ([`DEPLOY.md`](DEPLOY.md)).

### 6.2 Bloqueiam cenários isolados

- Banco PostgreSQL com migrations e seed (ADM-*, CONT-*, SEG-03..07, ANA-02 com persistência).
- `AUTH_SECRET` definido (SEG-03..07, ADM-*).
- Assets visuais (PUB-05 verifica apenas o placeholder explícito).

### 6.3 A executar pelo mantenedor

- Criação do banco, do `AUTH_SECRET` e do primeiro administrador.
- Decisão sobre ligar o analytics (ANA-02).

### 6.4 Fora de escopo deste checklist

- Testes de carga.
- Pentest externo.
- Telas finais (hero, listagens completas) — entram no checklist quando a [M1](milestones/M1-hero-e-paginas-publicas.md) fechar.
