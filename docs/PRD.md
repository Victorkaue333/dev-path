# PRD — DevPath

> Requisitos do produto. Nível 1 da hierarquia documental junto com [`PROJECT_CONTEXT.md`](../PROJECT_CONTEXT.md). Estado de cada requisito: **Implementado** (há código) · **Planejado** (desenhado, sem código) · **Pendente** (depende de decisão/configuração).

## Visão

Ser o ponto de partida gratuito e confiável de quem quer entrar em tecnologia no Brasil: escolher uma carreira, seguir um roadmap claro, estudar por recursos gratuitos e construir projetos — sem cadastro, sem venda e sem números inventados.

## Personas

| Persona | Objetivo principal | Cenário típico |
|---|---|---|
| **Iniciante absoluto** | Descobrir se tecnologia é para si e por onde começar. | Entra pela home, lê "Carreiras", escolhe uma, abre o roadmap e começa pela etapa 1. |
| **Em transição de carreira** | Trilha objetiva com recursos gratuitos e projetos que viram portfólio. | Vai direto a "Roadmaps", compara trilhas, salva links de cursos no navegador. |
| **Estudante de TI** | Prática orientada ao que o mercado pede. | Usa "Projetos" filtrando por nível e "Mercado" para ver tecnologias por carreira. |
| **Curioso(a) pela história** | Contexto humano da computação. | Lê "Lendas da TI". |
| **Administrador(a) de conteúdo** | Manter o conteúdo publicado e acompanhar uso agregado. | Entra em `/admin`, edita um roadmap, publica, vê métricas de navegação. |

## Requisitos funcionais

### Site público

| ID | Requisito | Estado |
|---|---|---|
| RF-01 | Página inicial apresenta o DevPath, as carreiras publicadas e destaques (roadmaps, lendas). | Implementado (página-base com conteúdo demo; hero final Planejado — [M1](milestones/M1-hero-e-paginas-publicas.md)) |
| RF-02 | Listagem de carreiras publicadas com nome, descrição curta, ícone e cor de destaque; detalhe por slug com descrição, roadmaps, tecnologias e projetos relacionados. | Implementado (página-base) |
| RF-03 | Listagem de roadmaps publicados por carreira; detalhe por slug com etapas ordenadas, tópicos por etapa e nível. | Implementado (página-base) |
| RF-04 | Listagem de cursos gratuitos/documentação oficial com provedor, idioma, nível, se é documentação oficial e tópicos relacionados; link externo abre em nova aba com `rel="noopener noreferrer"`. | Implementado (página-base) |
| RF-05 | Listagem de projetos práticos por nível com tecnologias e carreira relacionada; detalhe com critérios de conclusão. | Implementado (listagem-base); detalhe Planejado |
| RF-06 | Página "Mercado" lista tecnologias/habilidades por categoria e sua relação com carreiras. **Nenhuma estatística** (salário, % de vagas) sem fonte citada e data. | Implementado (listagem-base, sem estatísticas) |
| RF-07 | "Lendas da TI": galeria de figuras históricas publicadas e detalhe por slug com resumo, biografia, contribuições e imagem quando existir. | Implementado (página-base; imagens Pendentes) |
| RF-08 | Página "Sobre" explica o propósito, o que o DevPath não faz e como o conteúdo é curado. | Implementado (página-base) |
| RF-09 | Página 404 própria e navegação de volta. | Implementado (em rotas dinâmicas, slug desconhecido mostra a 404 mas responde `200` na primeira visita — comportamento conhecido em [`ARCHITECTURE.md`](ARCHITECTURE.md#comportamentos-conhecidos)) |
| RF-10 | Conteúdo em rascunho ou arquivado **nunca** aparece no site, em nenhuma rota, incluindo sitemap. | Implementado (filtro `PUBLISHED` nos repositórios) |
| RF-11 | O site funciona em modo demonstrativo sem banco, com o conteúdo identificado como tal na interface de desenvolvimento. | Implementado |
| RF-12 | Busca global por cursos e tecnologias. | **Fora do MVP** (aparece nos mockups; sem requisito fechado) |

### Painel administrativo

| ID | Requisito | Estado |
|---|---|---|
| RF-20 | Login exclusivo de administradores com e-mail e senha; mensagens de erro genéricas; bloqueio por tentativas. | Implementado (fail-closed; exige banco e `AUTH_SECRET`) |
| RF-21 | Sessão segura em cookie httpOnly com expiração configurável; logout. | Implementado |
| RF-22 | Toda rota `/admin/*` exige sessão válida verificada no servidor; sem sessão, redireciona para o login. | Implementado (`proxy.ts` + `requireAdminSession()`) |
| RF-23 | CRUD de carreiras, roadmaps/etapas/tópicos, cursos, projetos, tecnologias, figuras históricas e conteúdo editorial, com transição rascunho → publicado → arquivado. | Planejado (páginas-base existem; nenhuma operação de escrita) |
| RF-24 | Papéis `OWNER` e `EDITOR`; só `OWNER` gerencia administradores. | Planejado (enum e `requireOwnerSession()` existem; gestão de usuários não) |
| RF-25 | Dashboard com métricas agregadas de navegação, sem dados pessoais e sem números fictícios; estado vazio explícito quando não há coleta. | Planejado (página-base com estado vazio) |
| RF-26 | Criação do primeiro administrador fora da interface (seed local com variáveis explícitas ou procedimento operacional documentado). | Implementado (seed) |

### Analytics

| ID | Requisito | Estado |
|---|---|---|
| RF-30 | Registrar visualizações de página, cliques em roadmaps, cursos, projetos, navegação entre carreiras e cliques em links externos (apenas host). | Implementado (coleta) |
| RF-31 | Coleta desligada por padrão; ativação por variável de ambiente após revisão de privacidade. | Implementado |
| RF-32 | Agregação diária para consumo do painel. | Planejado |

## Requisitos não funcionais

| ID | Requisito | Medida / verificação | Estado |
|---|---|---|---|
| RNF-01 | **Privacidade (LGPD):** nenhum IP, user-agent completo, identificador de visitante ou e-mail é armazenado pelo analytics; nenhum cookie é definido para visitantes. | Schema `strict` do evento; modelo `AnalyticsEvent` sem esses campos; revisão em [`Security-Guide.md`](Security-Guide.md#12-privacidade-lgpd). | Implementado |
| RNF-02 | **Sem números fictícios:** nenhuma tela exibe contadores, estatísticas de mercado ou métricas sem fonte real. | Revisão de PR; conteúdo demo não contém estatísticas. | Implementado (regra) |
| RNF-03 | **Performance:** páginas públicas renderizadas no servidor com shell estático (Cache Components); imagens via `next/image`; fontes com `display: swap`. | Lighthouse ≥ 90 em performance nas páginas públicas (meta; medição Pendente). | Implementado (base) / Pendente (medição) |
| RNF-04 | **Acessibilidade:** navegação completa por teclado, foco visível, contraste AA, `prefers-reduced-motion` respeitado, landmarks e `lang="pt-BR"`. | Checklist em [`DESIGN.md`](DESIGN.md#10-acessibilidade); auditoria axe Pendente. | Implementado (base) / Pendente (auditoria) |
| RNF-05 | **SEO:** título e descrição por página, canonical, Open Graph, sitemap, robots; admin não indexável; dados estruturados só com conteúdo real. | `robots.ts`, `sitemap.ts`, `buildPageMetadata`. | Implementado; JSON-LD Pendente |
| RNF-06 | **Segurança do painel:** senha com bcrypt (custo 12), JWT HS256 com emissor/audiência, cookie httpOnly/SameSite=Lax/Secure, limite de tentativas, validação Zod, segredos só no servidor. | [`Security-Guide.md`](Security-Guide.md). | Implementado; rate limit compartilhado Pendente |
| RNF-07 | **Disponibilidade sem banco:** o site público nunca depende do banco para responder em modo demo; o endpoint de analytics responde 202 mesmo sem banco. | Testes do repositório demo e do handler. | Implementado |
| RNF-08 | **Qualidade:** TypeScript strict, lint e testes no CI; build de produção verde a cada PR. | `.github/workflows/ci.yml`. | Implementado |
| RNF-09 | **Responsividade:** layout funcional de 320 px a 1440 px+, sem rolagem horizontal. | Checklist E2E. | Implementado (base) / Pendente (verificação) |
| RNF-10 | **Idioma:** interface e conteúdo em pt-BR; recursos em outro idioma sinalizados (`language`). | Campo `language` no curso. | Implementado |

## Critérios de aceite (MVP)

O MVP está pronto quando:

1. As quatro carreiras iniciais têm roadmap **publicado** com etapas, tópicos, cursos relacionados e ao menos um projeto por nível — conteúdo real, revisado editorialmente (**Pendente**: curadoria).
2. Todas as páginas públicas renderizam no servidor, passam no checklist de acessibilidade e de SEO ([`CHECKLIST-E2E-STAGING.md`](CHECKLIST-E2E-STAGING.md)).
3. O painel permite criar, editar, publicar e arquivar cada tipo de conteúdo, só com sessão de administrador (**Planejado**).
4. Analytics agregado aparece no dashboard somente quando a coleta está ligada e revisada; caso contrário, estado vazio honesto (**Planejado**).
5. Produção na Vercel com PostgreSQL externo, migrations aplicadas por `prisma migrate deploy`, segredos só no painel da Vercel (**Planejado**).
6. Assets da identidade visual presentes conforme [`assets/README.md`](assets/README.md) (**Pendente**).

## Fora de escopo

Ver [`PROJECT_CONTEXT.md`](../PROJECT_CONTEXT.md#fora-do-escopo-decisão-de-produto): login/cadastro/perfil de visitante, progresso em conta, pagamentos, comunidade, estatísticas sem fonte, busca global.
