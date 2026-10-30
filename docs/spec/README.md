# Spec-Driven Development — DevPath

> Como uma feature nasce, é aprovada e vira código neste repositório. Nível 5 da hierarquia documental. Templates em [`../templates/README.md`](../templates/README.md). Specs de features em [`features/`](features/README.md).

## 0. Controle

### 0.1 Prevalência documental

Quando documentos divergem, vale a ordem de [`../../AGENTS.md`](../../AGENTS.md#hierarquia-documental): produto → técnico normativo → decisões → operação → execução. Uma spec nunca contraria um documento de nível superior sem antes propor a mudança nele (e, se for decisão, uma ADR).

### 0.2 Classificação usada nas specs

| Marcador | Significado |
|---|---|
| **FATO** | Comportamento que existe no código, com âncora `arquivo:linha` ou nome de função |
| **DECISÃO** | Escolha tomada e registrada (ADR ou doc normativo) |
| **PROPOSTA** | O que a spec sugere; vira DECISÃO no gate |
| `[PRECISA ESCLARECER: pergunta]` | Lacuna que o autor não pode preencher sozinho; bloqueia o gate |

### 0.3 Histórico

| Data | Mudança |
|---|---|
| 2026-10-29 | Processo criado no bootstrap (M0) |

## 1. Os três estágios

| Estágio | Artefato | Onde vive | Status da spec |
|---|---|---|---|
| **1. Spec** | O que a feature é, por quê, como se encaixa na arquitetura, como se prova | `docs/spec/features/<slug>.md` | `proposta` |
| **2. Gate** | Aval do mantenedor (inclusive quando toca decisão registrada) | — | `aprovada` |
| **3. Execução** | Doc da milestone + PR com código, testes e docs | `docs/milestones/M<N>-<slug>.md` | `implementada` |

A spec continua existindo depois da milestone: ela responde "por que é assim?"; o doc da milestone responde "o que de fato entrou".

### Estágio 1 — Spec

Copie [`../templates/TEMPLATE-spec-feature.md`](../templates/TEMPLATE-spec-feature.md) para `docs/spec/features/<slug>.md`.

Regras:

- **Não inventar.** Toda feature rastreia ao PRD, ao PROJECT_CONTEXT, aos mockups ou a um pedido do mantenedor. Sem origem → `[PRECISA ESCLARECER]`, nunca escolha silenciosa.
- **Não decidir stack sozinho.** Dependência, serviço externo ou mudança de arquitetura = ADR em [`../DECISIONS.md`](../DECISIONS.md) no mesmo PR.
- **Evidência com âncora.** Afirmação sobre o código atual cita arquivo e função.
- **Objetivos e não-objetivos.** O "fora de escopo" impede a feature de crescer no meio do PR.
- **Constituição do DevPath** conferida antes e depois de desenhar (seção 0 do template): sem cadastro público, sem número fictício, Prisma só em `src/server`, Suspense para dados de requisição, só conteúdo `PUBLISHED` no site, Zod em toda entrada, pt-BR na interface.
- **Diagramas quando houver tela ou fluxo:** wireframe (texto ou mermaid), sequência (mermaid), ER das tabelas tocadas (mermaid), fluxograma do visitante/admin. `N/A` com motivo é aceito; em branco não.
- **Produto junto da engenharia:** persona, dor, hipótese, como se mede (sem inventar métrica que o analytics não coleta), custo de não fazer.

### Estágio 2 — Gate (Definition of Ready)

- [ ] Zero `[PRECISA ESCLARECER]` aberto.
- [ ] Constituição conferida; violação tem justificativa escrita ou aval.
- [ ] Diagramas presentes ou `N/A` com motivo.
- [ ] Cada requisito funcional (formato EARS: `QUANDO <evento> O SISTEMA DEVE <comportamento>`) tem ao menos um critério de aceite Given/When/Then.
- [ ] Cada NFR aplicável tem limiar e forma de verificação.
- [ ] Modelo de dados fechado: tabela/coluna nova ou reuso justificado; migration necessária ou não; impacto em `DATABASE.md`.
- [ ] Contrato fechado: Server Action/Route Handler com schema Zod e estados de erro; impacto em `API.md`.
- [ ] Impacto em docs listado (quais arquivos mudam).
- [ ] Dependência nova → ADR aberta.
- [ ] Número da milestone conferido em `ls docs/milestones/`.

### Estágio 3 — Execução

1. Doc da milestone a partir de [`../templates/TEMPLATE-milestone.md`](../templates/TEMPLATE-milestone.md).
2. Cada tarefa aponta para os RF que fecha (rastreabilidade nos dois sentidos).
3. PR: código + testes + documentação afetada, juntos.
4. Definition of Done:
   - [ ] Critérios de aceite verdes, cada um com teste ou evidência.
   - [ ] `pnpm check` verde.
   - [ ] `CHANGELOG.md` com o porquê.
   - [ ] `DECISIONS.md`, `DATABASE.md`, `API.md`, `ENVIRONMENT.md`, `DESIGN.md` atualizados **se** tocados.
   - [ ] Pendências declaradas no doc da milestone.

## 2. Quando pular a spec

Pule direto para a milestone (ou para um PR simples) quando **as três** valem: não cria tabela, coluna, rota nem Server Action; não toca decisão registrada nem abre ADR; cabe em uma sessão de trabalho. Correção de bug, ajuste visual e refactor local entram aqui. Na dúvida, escreva a spec.

## 3. Specs existentes

| Spec | Status | Milestone |
|---|---|---|
| [`painel-admin-autenticacao.md`](features/painel-admin-autenticacao.md) | implementada (retroativa, documenta o que a M0 entregou) | M0 |

## 4. Por que este formato

Síntese do que se repete em processos de design doc e spec-driven development: contexto, objetivos **e não-objetivos**, alternativas, segurança e testes como seções obrigatórias; marcador de lacuna que bloqueia em vez de deixar o autor inventar; verificação de "constituição" antes e depois do desenho; requisitos em forma EARS; critérios de aceite Given/When/Then; distinção entre "posso começar?" (DoR) e "terminei?" (DoD); diagramas em texto (mermaid) que vivem no diff. Um documento por estágio, dois estágios — para um time pequeno, mais arquivos viram mais arquivos desatualizados.
