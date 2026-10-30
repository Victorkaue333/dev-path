# M<N> — <título: o resultado, não a tarefa>

> Doc-pai da fase **M<N>**. **Status: planejada | em execução | implementada — não commitada | implementada.**
> Spec: [`docs/spec/features/<slug>.md`](../spec/features/<slug>.md) — <ou "sem spec: <por quê>">
> Origem: <quem pediu, quando, frase original entre aspas quando houver>
> Relação com ADRs: <estende ADR-NNNN sem contrariá-la / abre ADR-NNNN / não abre ADR>

> **Número da milestone:** confira em `ls docs/milestones/` antes de fixar.

---

## O problema, na tela

<O que estava errado ou faltando, do ponto de vista de quem usa (visitante ou administrador). Cite saída real quando houver. Enumere problemas separados.>

---

## A descoberta que mudou o desenho

> Opcional. Achado de investigação que alterou o plano: estrutura que já existia, comportamento já quebrado, suposição que caiu.

---

## O que foi entregue

### 1. <parte>

<O quê e por quê assim. Tabela quando houver campos/opções.>

### 2. <parte>

---

## Decisões que não são detalhe

**1. <decisão>.** <Escolhido, descartado, pior caso de cada lado.>

**2. <decisão>.**

---

## O que muda, por arquivo

### Aplicação (`src/`)

| Arquivo | O quê |
|---|---|
| `src/features/<dominio>/<arquivo>.ts` | <...> — **novo** |
| `src/server/<...>` | <...> |

### Banco

| Arquivo | O quê |
|---|---|
| `prisma/schema.prisma` | <...> |
| `prisma/migrations/<...>` | <ou: **sem migration** — <por quê>> |

### Testes

| Arquivo | O que trava |
|---|---|
| `tests/unit/<...>.test.ts` | <...> |
| `tests/e2e/<...>.spec.ts` | <...> |

### Documentação

`CHANGELOG.md` · <`DECISIONS.md` ADR-NNNN / `DATABASE.md` / `API.md` / `DESIGN.md` / `ENVIRONMENT.md` / `README.md`>

---

## Como verificar

| # | Critério de aceite | Onde se prova |
|---|---|---|
| 1 | DADO <...> QUANDO <...> ENTÃO <...> | `<arquivo de teste>` |
| 2 | | |

Comandos: `pnpm check` · `pnpm test:e2e`
Manual: <o que só se vê rodando — rota, variável, modo demo/banco>

---

## Pendências declaradas

> O que ficou de fora entra escrito.

1. **<pendência>.** <por que ficou fora e o que custaria>
2. **<limiar sem calibração>.** <o que medir primeiro>

---

## Fontes (<DD/mmm/AAAA>)

- [<título>](<url>)
