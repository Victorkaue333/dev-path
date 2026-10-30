# Security Guide — DevPath

> Controles de segurança: o que existe, como funciona e o que falta. Nível 4 da hierarquia documental. Divulgação de vulnerabilidades: [`SECURITY.md`](../SECURITY.md). Decisões: [ADR 0004](DECISIONS.md#0004--autenticação-própria-do-painel-jose--bcrypt--cookie-httponly), [0007](DECISIONS.md#0007--analytics-first-party-sem-identificadores-desligado-por-padrão), [0008](DECISIONS.md#0008--rate-limit-em-memória-como-medida-provisória), [0009](DECISIONS.md#0009--cabeçalhos-de-segurança-no-nextconfig-csp-estrita-pendente).

## 1. O que protegemos

| Ativo | Por quê importa | Onde vive |
|---|---|---|
| Sessão administrativa | Dá poder de alterar todo o conteúdo publicado | Cookie `devpath_admin_session` + `AUTH_SECRET` |
| Credenciais de administradores | Única identidade no sistema | `AdminUser.passwordHash` (bcrypt) |
| `AUTH_SECRET`, `DATABASE_URL` | Comprometem sessão e banco | Painel da Vercel / `.env` local |
| Integridade do conteúdo | É o produto | PostgreSQL via Prisma, só por Server Actions autenticadas |
| Disponibilidade do site público | Missão do projeto | Vercel + shell estático; funciona sem banco em modo demo |
| Privacidade dos visitantes | Compromisso de produto e LGPD | Nenhum cookie, nenhum identificador no analytics |

## 2. Superfícies e modelo de ameaça

| Superfície | Ameaças consideradas | Controles |
|---|---|---|
| `/admin/login` | Força bruta, credential stuffing, enumeração de e-mail, CSRF | Rate limit, bcrypt, mensagem única, comparação em tempo constante, SameSite=Lax + Origin check |
| `/admin/*` | Acesso sem sessão, sessão forjada/expirada, escalada de papel | `proxy.ts` + `requireAdminSession()` + JWT com emissor/audiência/expiração; `requireOwnerSession()` para operações de `OWNER` |
| `POST /api/analytics/events` | Flood, payload malicioso, coleta indevida | Zod `strict`, limite de 2 KB, rate limit, nenhum campo pessoal |
| Site público | XSS via conteúdo editorial, clickjacking, indexação de admin | React escapa por padrão; Markdown renderizado com sanitização (Planejado quando houver renderer); `X-Frame-Options`/`frame-ancestors`; `robots` + `X-Robots-Tag` |
| Build/CI | Dependência maliciosa, segredo em log | `--frozen-lockfile`, `allowBuilds` explícito no pnpm, sem segredo real no CI |
| Repositório | Segredo commitado | `.gitignore` de `.env*`, revisão de diff, `.env.example` sem valores reais |

Fora do modelo: ataques ao provedor (Vercel, banco), comprometimento da máquina do mantenedor.

## 3. Autenticação do painel

### Fluxo

1. `LoginForm` valida com `loginSchema` e envia à Server Action `loginAction` (mesma origem; o Next verifica `Origin`).
2. `loginAction` revalida (Zod), deriva a chave do cliente (`x-forwarded-for`) e chama `authenticateAdmin()`.
3. `authenticateAdmin()` — **fail-closed, nesta ordem**:
   1. `AUTH_SECRET` ausente → `auth_not_configured`.
   2. `DATABASE_URL` ausente → `db_unavailable`.
   3. Limite excedido → `rate_limited` (sem consultar o banco).
   4. Busca por e-mail normalizado; `bcrypt.compare` roda **sempre** (contra hash fictício se o e-mail não existe) para igualar o tempo de resposta.
   5. Sem usuário, inativo ou senha errada → `invalid_credentials` (mensagem única).
4. Sucesso: reset do limitador para a chave, `lastLoginAt` atualizado, sessão criada, redirect para `/admin/dashboard`.

### Sessão

| Propriedade | Valor |
|---|---|
| Formato | JWT HS256 (jose), claims `sub` (id), `email`, `name`, `role`, `iss=devpath`, `aud=devpath-admin`, `iat`, `exp` |
| Cookie | `devpath_admin_session`; `httpOnly`; `SameSite=Lax`; `Secure` quando `NODE_ENV=production`; `Path=/`; `Max-Age` = TTL |
| TTL | `AUTH_SESSION_TTL_HOURS` (padrão 8 h, máx. 72 h) |
| Verificação | `verifySessionToken()` exige algoritmo, emissor, audiência, expiração e claims com tipo correto; qualquer falha → `null` |
| Revogação | Só por expiração ou troca de `AUTH_SECRET` (invalida todas). Revogação individual: Planejado (lista de revogação ou sessão opaca) |
| Logout | `logoutAction` apaga o cookie (`Max-Age=0`) |

### Guardas

| Guarda | Onde | O que faz |
|---|---|---|
| `src/proxy.ts` | `/admin/:path*` (inclui `/admin/login`) | Verifica o cookie com jose lendo `process.env.AUTH_SECRET`; sem sessão em rota protegida → redirect para o login, apagando cookie inválido/expirado; em `/admin/login` com sessão válida → redirect para o dashboard. É barreira de conveniência; não substitui a do servidor. |
| `requireAdminSession()` | `src/app/admin/layout.tsx` (dentro de `<Suspense>`) e toda Server Action administrativa | Lê e valida a sessão; redireciona se inválida. **É a verificação que vale.** |
| `requireOwnerSession()` | Operações de gestão de administradores (Planejadas) | Exige `role = OWNER` |

### Senhas

bcrypt custo 12 (`src/server/auth/password.ts`). Mínimo 8 caracteres no schema de login; o seed exige ≥ 12 para o administrador criado (política única mais forte é Planejada). Sem senha padrão, sem admin padrão: o primeiro admin nasce do seed com variáveis explícitas, fora de produção.

### MFA

Não implementado. Planejado para quando houver mais de um administrador ativo (TOTP sem provedor externo).

## 4. Rotas públicas

Tudo fora de `/admin/*` é público e **não lê cookies**. Página pública que precisar de dado da requisição deve justificar e ficar em `<Suspense>`. Não existe rota pública que escreva no banco além de `POST /api/analytics/events` (dados não pessoais).

## 5. Autorização

| Papel | Pode | Estado |
|---|---|---|
| Visitante | Ler conteúdo publicado; enviar evento de analytics | Implementado |
| `EDITOR` | Entrar no painel; CRUD de conteúdo (Planejado) | Login Implementado; CRUD Planejado |
| `OWNER` | Tudo do `EDITOR` + gerenciar administradores (Planejado) | `requireOwnerSession()` Implementado; gestão Planejada |

Regra: autorização é verificada **no servidor, dentro da action**, nunca só escondendo botão.

## 6. Entrada de dados

- Zod em toda fronteira: Server Actions (`FormData`), Route Handlers (`request.json()`), env.
- Analytics: schema `strict`, `path` com regex de caminho interno, `targetSlug` com regex de slug, `externalHost` só host; `Content-Length` máximo de 2 048 bytes (413) e JSON inválido rejeitado (400) antes da validação.
- Slugs validados por `isValidSlug` antes de consultar (evita consultas com entrada arbitrária).
- Conteúdo editorial com Markdown: renderização com sanitização (lista de tags permitida) é requisito **antes** de exibir `body`/`acceptance` como HTML — Planejado; hoje são exibidos como texto.
- Sem `dangerouslySetInnerHTML` fora de um renderer sanitizado revisado.

## 7. Rate limit e abuso

| Alvo | Limite | Implementação | Limitação |
|---|---|---|---|
| Login | 5 / 15 min por chave | `loginRateLimiter` (memória) | Por instância serverless |
| Analytics | 120 / min por chave | `analyticsRateLimiter` (memória) | Por instância |

Chave = primeiro IP de `X-Forwarded-For` (ou `x-real-ip`, ou `unknown`). **Não persistida, não logada.** Na Vercel, `X-Forwarded-For` é definido pela plataforma; fora dela, confie nesse cabeçalho só atrás de proxy confiável. Versão compartilhada (KV/Redis ou tabela): Planejada.

## 8. Cabeçalhos e transporte

Definidos em `next.config.ts` para `/:path*`:

| Cabeçalho | Valor | Protege contra |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | MIME sniffing |
| `X-Frame-Options` | `DENY` | Clickjacking (navegadores antigos) |
| `Content-Security-Policy` | `frame-ancestors 'none'` | Clickjacking (moderno). **CSP completa: Pendente** |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Vazamento de URL para terceiros |
| `Permissions-Policy` | câmera, microfone, geolocalização, pagamento desligados | APIs sensíveis |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Downgrade para HTTP (só efetivo em HTTPS) |

Para `/admin/:path*`: `X-Robots-Tag: noindex, nofollow, noarchive` e `Cache-Control: private, no-store`. `poweredByHeader: false`.

CSP estrita (nonces para scripts, `font-src` para as fontes servidas pelo próprio app, `img-src 'self' data:`) exige `proxy.ts` gerando nonce por requisição e validação com as fontes do Google — item planejado ([ADR 0009](DECISIONS.md#0009--cabeçalhos-de-segurança-no-nextconfig-csp-estrita-pendente)).

## 9. Segredos e configuração

- Segredos só em `.env` local (ignorado) e no painel da Vercel. Nunca em código, docs, testes, CI ou `vercel.json`.
- `src/config/env.ts` é `server-only`: nada de `AUTH_SECRET`/`DATABASE_URL` chega ao cliente. Só `NEXT_PUBLIC_*` é público — e nenhuma delas é segredo.
- `AUTH_SECRET` ≥ 32 caracteres, gerado aleatoriamente; rotação = trocar e redeploy (invalida sessões).
- `.env.example` contém apenas nomes e valores locais inofensivos (`devpath:devpath@localhost`).
- Verificação de segredos acidentais: `git diff` revisado + grep por padrões (`AUTH_SECRET=`, `postgresql://` com host não-local, `BEGIN PRIVATE KEY`) antes de cada PR; scanner automático no CI é Planejado.

## 10. Banco de dados

- Acesso só por Prisma em `src/server/**` (ESLint); nada de SQL cru no MVP.
- Usuário do banco de produção com privilégios mínimos para a aplicação; migrations com usuário separado quando o provedor permitir (Planejado na escolha do provedor).
- TLS obrigatório em produção (`sslmode=require`).
- Sem dados pessoais de visitantes; dados de administradores limitados a e-mail, nome, hash e timestamps.
- Seeds bloqueados em produção; `migrate reset`/`db push` proibidos fora do local.

## 11. Logs e observabilidade

- A aplicação não loga IP, corpo de eventos de analytics, senhas ou tokens.
- Erros de banco/analytics vão para `console.error` com contexto mínimo.
- Logs de função da Vercel registram IP por padrão (fora do controle da aplicação): considerar na avaliação de privacidade.
- Alertas e rastreamento de erros: Pendente de decisão.

## 12. Privacidade (LGPD)

| Tema | Estado |
|---|---|
| Nenhum cookie para visitantes | Implementado |
| Analytics sem identificadores, desligado por padrão | Implementado |
| Avaliação de base legal e texto de transparência antes de ligar a coleta | Pendente ([`INTEGRATION.md`](INTEGRATION.md#analytics)) |
| Retenção/expurgo de eventos | Pendente |
| Dados de administradores: mínimo necessário, sem compartilhamento | Implementado |
| Página de privacidade | Planejada |

Não afirmar "anônimo" em texto público até a avaliação.

## 13. Frontend

- React escapa saída por padrão; `dangerouslySetInnerHTML` proibido fora de renderer sanitizado.
- Links externos: `rel="noopener noreferrer"`, `target="_blank"` (`TrackedLink`).
- Nenhum segredo em `NEXT_PUBLIC_*`.
- Formulário de login: `autoComplete` correto, sem autopreencher senha em campo errado, erros em texto.
- Sem `localStorage` para dados sensíveis; o site público não persiste nada hoje.

## 14. Dependências e CI

- Versões fixadas para Prisma; `^` nas demais com lockfile congelado (`--frozen-lockfile`).
- pnpm 11 bloqueia scripts de pós-instalação; liberação explícita em `allowBuilds`.
- Dependabot/Renovate e auditoria (`pnpm audit`) no CI: Planejado.
- CI não tem acesso a segredo real; `DATABASE_URL` fictícia só para `prisma generate`.

## 15. Checklist de segurança do PR

- [ ] Nenhum segredo, URL privada ou credencial no diff.
- [ ] Entrada nova validada com Zod; mensagens em pt-BR; erro de credencial genérico.
- [ ] Operação de escrita passa por `requireAdminSession()` (ou `requireOwnerSession()`) **dentro** da action.
- [ ] Nenhuma leitura de banco/cookie fora de `src/server` ou fora de `<Suspense>`.
- [ ] Nenhum cookie novo para visitantes; nenhum campo pessoal novo no analytics.
- [ ] Link externo com `rel="noopener noreferrer"`.
- [ ] Sem `dangerouslySetInnerHTML` não sanitizado.
- [ ] Variável de ambiente nova em `.env.example` + `ENVIRONMENT.md`; segredo só no servidor.
- [ ] Mudança de auth/headers/rate limit refletida neste guia e, se for decisão, em ADR.

## 16. Quando achar uma vulnerabilidade

Siga [`SECURITY.md`](../SECURITY.md). Internamente: corrija em branch privada, adicione teste que reproduz, registre no `CHANGELOG.md` após publicar a correção.

## 17. Riscos conhecidos em aberto

| Risco | Severidade | Mitigação atual | Plano |
|---|---|---|---|
| Rate limit por instância | Média | bcrypt custo 12 encarece força bruta; mensagem única | KV/Redis ou tabela ([ADR 0008](DECISIONS.md#0008--rate-limit-em-memória-como-medida-provisória)) |
| Sem revogação individual de sessão | Média | TTL de 8 h; troca de `AUTH_SECRET` invalida tudo | Lista de revogação ou sessão opaca |
| Sem MFA | Média (sobe com mais admins) | Senha forte, rate limit | TOTP |
| CSP estrita ausente | Média | `frame-ancestors`, React escapa, sem scripts de terceiros | Nonces via `proxy.ts` |
| Markdown editorial sem renderer sanitizado | Alta **se** for renderizado como HTML | Hoje exibido como texto | Renderer com allowlist antes de qualquer HTML |
| Sem troca obrigatória de senha após seed/criação | Baixa | Procedimento manual | Flag `mustChangePassword` |
| Sem auditoria de ações administrativas | Baixa (MVP) | `lastLoginAt` | Tabela de auditoria quando o CRUD existir |
| Sem scanner de segredos/dependências no CI | Baixa | Revisão manual | Dependabot + `pnpm audit` |

### Divergências doc × código

Nenhuma conhecida no bootstrap. Ao encontrar uma, corrija o código ou este guia no mesmo PR e registre aqui enquanto a correção não entra.
