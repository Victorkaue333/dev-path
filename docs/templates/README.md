# Templates — DevPath

> Processo: [`../spec/README.md`](../spec/README.md). Guardrails: [`../../AGENTS.md`](../../AGENTS.md). Decisões: [`../DECISIONS.md`](../DECISIONS.md).

Dois templates, um por estágio:

| Estágio | Template | Destino |
|---|---|---|
| Spec (antes do código) | [`TEMPLATE-spec-feature.md`](TEMPLATE-spec-feature.md) | `docs/spec/features/<slug>.md` |
| Milestone (durante/depois do código) | [`TEMPLATE-milestone.md`](TEMPLATE-milestone.md) | `docs/milestones/M<N>-<slug>.md` |

## Regras que não são estilo

- **Não inventar.** Lacuna vira `[PRECISA ESCLARECER: <pergunta>]`, marcador literal e procurável (`grep -rn "PRECISA ESCLARECER" docs/`). Spec com marcador aberto não passa no gate.
- **Constituição do DevPath** conferida no início e no fim: sem cadastro público, sem número fictício, Prisma só em `src/server`, Suspense para dados de requisição, só `PUBLISHED` no site, Zod em toda entrada, pt-BR na interface.
- **Dependência nova = ADR** no mesmo PR.
- **Evidência com âncora** (`arquivo` + função) para qualquer afirmação sobre o código atual.
- **Objetivos e não-objetivos.**
- **Diagramas em mermaid** quando há tela, fluxo ou dado; `N/A` com motivo é aceito.
- **Pendência declarada**, nunca implícita.

## Quando pular a spec

Não cria tabela/coluna/rota/action, não toca decisão registrada, cabe em uma sessão → milestone ou PR direto.
