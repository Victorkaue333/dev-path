# Política de Segurança — DevPath

> Como reportar uma vulnerabilidade no DevPath e o que esperar depois. Controles técnicos e modelo de ameaça estão em [`docs/Security-Guide.md`](docs/Security-Guide.md).

O DevPath é um site educacional público, sem cadastro de visitantes. A superfície sensível é o **painel administrativo** (`/admin/*`), o endpoint de analytics e a cadeia de build/deploy. Mesmo sem dados pessoais de visitantes, levamos a sério qualquer falha que permita alterar conteúdo, obter sessão administrativa, expor segredos ou degradar a disponibilidade.

## Versões e ambientes cobertos

| Ambiente | Cobertura |
|---|---|
| Branch `main` do repositório | Coberta |
| Produção na Vercel | **Ainda não existe** (deploy é Planejado — [`docs/DEPLOY.md`](docs/DEPLOY.md)). Quando existir, este documento será atualizado com o domínio. |
| Ambientes locais de desenvolvedores | Fora da cobertura (configuração de cada máquina) |
| Versões antigas / forks | Fora da cobertura |

## Como reportar

**Não abra issue pública** para vulnerabilidade.

1. Use a funcionalidade **"Report a vulnerability"** (Security Advisories) do repositório no GitHub, se estiver habilitada.
2. Alternativa: abra uma issue com o título `[SEGURANÇA] contato` **sem detalhes técnicos**, pedindo um canal privado; o mantenedor responde com o meio de contato.

Inclua, quando possível:

- Descrição do problema e impacto esperado (o que um atacante consegue).
- Passos para reproduzir, URL/rota afetada, payload mínimo.
- Versão/commit testado e ambiente.
- Se já houve exposição acidental (ex.: segredo em commit), o identificador do commit.

Não inclua dados de terceiros nem segredos reais no relato; descreva onde estão.

## O que acontece depois

| Etapa | Prazo-alvo | Observação |
|---|---|---|
| Confirmação de recebimento | 3 dias úteis | — |
| Triagem e classificação (crítica/alta/média/baixa) | 7 dias úteis | Pode haver pedido de informação adicional. |
| Correção | Conforme severidade; críticas têm prioridade sobre qualquer outro trabalho | Projeto mantido em regime voluntário: prazos são metas, não SLA contratual. |
| Divulgação coordenada | Após a correção estar publicada | Crédito ao pesquisador, se desejar. |

### Divulgação coordenada

Pedimos que o relato permaneça privado até a correção ser publicada ou até 90 dias após a confirmação, o que vier primeiro. Se o prazo precisar ser estendido (por exemplo, correção que depende de provedor externo), avisaremos com justificativa.

## Regras para testar

Permitido, em instância **própria** (clone local ou deploy pessoal):

- Testes de autenticação e autorização do painel, incluindo tentativas de bypass do `proxy.ts` e de `requireAdminSession()`.
- Testes de validação de entrada em Server Actions e Route Handlers.
- Análise estática do código e de dependências.

Não permitido, em qualquer instância que não seja sua:

- Negação de serviço, carga ou varredura agressiva.
- Acesso, alteração ou exfiltração de dados que não sejam seus.
- Engenharia social contra mantenedores ou contribuidores.
- Testes contra provedores de terceiros (Vercel, provedor do banco, Google Fonts) fora dos termos deles.

## Fora do escopo

- Relatos de ferramentas automatizadas sem prova de exploração.
- Ausência de cabeçalhos ou flags sem impacto demonstrável (ex.: CSP estrita é uma pendência **conhecida e registrada**, [ADR 0009](docs/DECISIONS.md#0009--cabeçalhos-de-segurança-no-nextconfig-csp-estrita-pendente)).
- Rate limit em memória ser por instância — limitação **conhecida e registrada** ([ADR 0008](docs/DECISIONS.md#0008--rate-limit-em-memória-como-medida-provisória)).
- Vulnerabilidades em dependências já publicadas pelo mantenedor da dependência, sem vetor específico no DevPath (abra issue normal pedindo a atualização).
- Links externos de cursos/documentação apontarem para sites de terceiros com problemas próprios.
- Conteúdo demonstrativo ser visível em ambiente de desenvolvimento (é intencional e marcado).

## Recompensa

Não há programa de recompensa financeira. Reconhecimento público (com consentimento) no `CHANGELOG.md` e nos agradecimentos do projeto.
