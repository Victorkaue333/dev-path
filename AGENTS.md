<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — DevPath

Instruções para agentes de IA (Claude Code, Cursor, Codex ou outros) que trabalham neste repositório. Vale também para pessoas: é o contrato mínimo de como o trabalho entra.

## Projeto

- **Produto:** DevPath — plataforma educacional pública e gratuita: "Seu caminho no mundo da tecnologia".
- **Estágio:** bootstrap. Base compilável, sem telas finais, sem deploy, sem migrations geradas. Estado detalhado no [`README.md`](README.md#estado-real-do-projeto).
- **Stack:** Next.js 16 (App Router, Cache Components, `proxy.ts`), React 19, TypeScript strict, Tailwind 4, shadcn/ui, Prisma 7 + PostgreSQL, pnpm 11. Sem backend separado.
- **Idioma:** interface, documentação, commits e mensagens em **português brasileiro**; identificadores de código em inglês.

## Hierarquia documental

Quando dois documentos divergem, o de nível mais alto vence e a divergência vira correção no outro.

| Nível | Documentos | Natureza |
|---|---|---|
| 1 — Produto | [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md), [`docs/PRD.md`](docs/PRD.md) | O que o DevPath é e não é |
| 2 — Técnico normativo | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/DATABASE.md`](docs/DATABASE.md), [`docs/API.md`](docs/API.md), [`docs/DESIGN.md`](docs/DESIGN.md) | Como se constrói |
| 3 — Decisões | [`docs/DECISIONS.md`](docs/DECISIONS.md) | Por que é assim (ADRs) |
| 4 — Operação | [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md), [`docs/DEPLOY.md`](docs/DEPLOY.md), [`docs/INTEGRATION.md`](docs/INTEGRATION.md), [`docs/Code-Style.md`](docs/Code-Style.md), [`docs/Security-Guide.md`](docs/Security-Guide.md) | Como se roda e se escreve |
| 5 — Execução | [`docs/CHECKLIST-E2E-STAGING.md`](docs/CHECKLIST-E2E-STAGING.md), [`docs/milestones/MILESTONES.md`](docs/milestones/MILESTONES.md), [`docs/spec/README.md`](docs/spec/README.md) | O que foi/será feito e como se prova |

Complementos: [`CLAUDE.md`](CLAUDE.md) (resumo técnico e comandos), [`SECURITY.md`](SECURITY.md) (divulgação de vulnerabilidades), [`CHANGELOG.md`](CHANGELOG.md), [`docs/assets/README.md`](docs/assets/README.md) (inventário de assets).

## Antes de escrever código

1. Leia o documento canônico da área (tabela acima) e o `node_modules/next/dist/docs/` para qualquer API do Next.js que for usar — a versão instalada tem mudanças em relação ao seu treinamento (bloco no topo deste arquivo).
2. Feature nova: siga [`docs/spec/README.md`](docs/spec/README.md). Spec antes de código quando a feature cria tabela, rota, dependência ou toca decisão registrada.
3. Dependência ou serviço novo = ADR em [`docs/DECISIONS.md`](docs/DECISIONS.md) no mesmo PR.
4. Confira o número da próxima milestone em `ls docs/milestones/`, não no `CLAUDE.md`.

## Convenções

- **Server Components por padrão.** `"use client"` só com interatividade real.
- **Nada de lógica em `page.tsx`.** Página compõe; regra fica em `src/features/*` (domínio) e `src/server/*` (infra, `server-only`).
- **Prisma só em `src/server/**`.** Regra ESLint `no-restricted-imports` bloqueia `@/generated/*` fora dali.
- **Cache Components:** `cookies()`, `headers()`, `searchParams` e consultas ao banco ficam dentro de `<Suspense>`; valores de `process.env` são lidos no escopo do módulo.
- **Zod em toda entrada** (Server Action, Route Handler, env). Mesmo schema no cliente e no servidor.
- **Conteúdo público só PUBLISHED.** Repositórios filtram `status`; nunca vazar rascunho.
- **Conteúdo demonstrativo** vive apenas em `src/features/*/demo-data.ts` e é marcado como tal. O seed importa esses módulos; não duplique dados.
- **Sem números fictícios** em nenhuma tela: contador, estatística ou métrica só com fonte real.
- Nomes de arquivo em kebab-case; componentes em PascalCase; detalhes em [`docs/Code-Style.md`](docs/Code-Style.md).

## Guardrails (nunca faça)

- Commit, push, merge, rebase, `reset --hard` ou criação de branch **sem pedido explícito** do mantenedor.
- Deploy, publicação na Vercel ou qualquer ação em ambiente remoto.
- Incluir credenciais, tokens, senhas ou URLs privadas em código, docs ou exemplos. `.env.example` só tem nomes e valores locais inofensivos.
- Implementar login público, cadastro, perfil, progresso em conta ou pagamento — são exclusões de produto ([`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md#fora-do-escopo-decisão-de-produto)).
- Criar bypass de autenticação, "login de desenvolvimento" ou administrador padrão com senha conhecida.
- Instalar NestJS, Express, Fastify ou criar uma segunda aplicação backend.
- Apagar ou sobrescrever documentação sem analisá-la; trocar o nome de arquivos canônicos.
- Descrever como implementado o que é planejado; inventar resultado de teste, data de aprovação ou integração operacional.
- Migrations destrutivas sem aval; `prisma migrate reset` em qualquer ambiente que não seja o local do próprio desenvolvedor.
- Executar seeds em produção.

## Critérios de conclusão

Trabalho está pronto quando **tudo** abaixo é verdade:

- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` passam localmente (ou o relatório diz exatamente qual falhou e por quê).
- [ ] Testes cobrem a regra nova (não só o caminho feliz).
- [ ] Documentação afetada atualizada **no mesmo PR**: `CHANGELOG.md` sempre; `DECISIONS.md`, `DATABASE.md`, `API.md`, `ENVIRONMENT.md` quando tocados.
- [ ] Variável de ambiente nova está em `.env.example` e em `docs/ENVIRONMENT.md`.
- [ ] Nenhum segredo no diff (`git diff` revisado).
- [ ] Alterações locais, sem staging e sem commit, salvo pedido em contrário.
- [ ] Relatório final separa: feito · verificado (com comando e resultado) · não executado · pendente.
