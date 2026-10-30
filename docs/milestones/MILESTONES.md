# Milestones — DevPath

> **Camada macro.** Marcos do projeto. Cada milestone em execução tem um documento próprio nesta pasta, criado a partir de [`../templates/TEMPLATE-milestone.md`](../templates/TEMPLATE-milestone.md). O número da próxima milestone é o próximo livre em `ls docs/milestones/`.
>
> Estado do repositório: **M0 (bootstrap) implementada, não commitada.** Base compilável, páginas-base públicas e administrativas, auth fail-closed, schema Prisma, CI sem deploy, documentação. Nenhuma tela final, nenhuma migration gerada, nenhum deploy.

Contexto: [`../../PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) · Requisitos: [`../PRD.md`](../PRD.md) · Processo de feature: [`../spec/README.md`](../spec/README.md)

## Roadmap

| # | Milestone | Objetivo | RF do PRD | Status | Doc |
|---|---|---|---|---|---|
| M0 | Bootstrap | Base técnica e documental compilável, sem telas finais | RF-09, RF-10, RF-11, RF-20, RF-21, RF-22, RF-26, RF-30, RF-31 | Implementada — não commitada | [M0-bootstrap.md](M0-bootstrap.md) |
| M1 | Hero e páginas públicas | Home com hero da identidade visual e as sete seções com layout final sobre conteúdo demo | RF-01 a RF-08 | Em andamento — hero (v1) entregue no bootstrap; listagens e detalhes finais pendentes | [M1-hero-e-paginas-publicas.md](M1-hero-e-paginas-publicas.md) |
| M2 | Banco e seed em ambiente real | Migration inicial, seed validado, `CONTENT_SOURCE=database` em dev, provedor de produção escolhido | RNF-07, RF-26 | Planejada | — |
| M3 | CRUD do painel | Server Actions de conteúdo com estados editoriais, repositórios administrativos, primeiro fluxo de publicação | RF-23, RF-24 | Planejada | — |
| M4 | Analytics agregado | Agregação diária, expurgo, dashboard com estado honesto, revisão de privacidade e ativação | RF-25, RF-32 | Planejada | — |
| M5 | Produção | Projeto Vercel, banco externo, migrations, primeiro admin, checklist de produção | — | Planejada | — |
| M6 | Curadoria de conteúdo | Roadmaps reais das quatro carreiras, substituição do conteúdo demo | Critério de aceite 1 | Planejada | — |

Itens transversais sem milestone própria (entram onde fizer sentido): rate limit compartilhado (ADR 0008), CSP estrita (ADR 0009), licença (ADR 0011), assets visuais ([`../assets/README.md`](../assets/README.md)), auditoria de acessibilidade.

## Como uma milestone fecha

1. Critérios de aceite do doc da milestone verdes, cada um com teste ou evidência.
2. `pnpm check` verde.
3. Documentação afetada atualizada no mesmo PR; `CHANGELOG.md` com o porquê.
4. Pendências declaradas no doc da milestone (nunca implícitas).
5. Status atualizado nesta tabela.
