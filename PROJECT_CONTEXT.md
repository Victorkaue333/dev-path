# PROJECT_CONTEXT — DevPath

> Documento de produto de nível mais alto. Quando outro documento contrariar este, este vence (hierarquia em [`AGENTS.md`](AGENTS.md#hierarquia-documental)). Requisitos detalhados: [`docs/PRD.md`](docs/PRD.md).

## Problema

Quem quer entrar em tecnologia encontra informação demais e orientação de menos: dezenas de "roadmaps" contraditórios, cursos pagos vendidos como atalho, listas de tecnologias sem contexto de carreira e nenhum lugar que diga **por onde começar, em que ordem e com quais recursos gratuitos**. O resultado é desistência precoce ou tempo perdido em conteúdo fora de ordem.

## Para quem

| Persona | Situação | O que precisa do DevPath |
|---|---|---|
| **Iniciante absoluto** | Nunca programou; está decidindo se tecnologia é para ele(a). | Entender as carreiras, escolher uma e dar o primeiro passo sem gastar dinheiro. |
| **Em transição de carreira** | Trabalha em outra área, tem pouco tempo livre. | Um caminho claro por carreira, com recursos gratuitos confiáveis e projetos que viram portfólio. |
| **Estudante de TI** | Cursa técnico ou graduação; vê teoria, falta prática orientada ao mercado. | Projetos práticos por nível e as tecnologias que o mercado pede em cada trilha. |
| **Curioso(a) pela história** | Quer contexto humano da computação. | Perfis das figuras históricas ("Lendas da TI") com fatos verificáveis. |
| **Administrador(a) de conteúdo** (interno) | Mantém roadmaps, cursos e projetos. | Painel com autenticação, edição de conteúdo e métricas de navegação respeitando privacidade. |

O DevPath é feito para o Brasil: interface e conteúdo em português brasileiro, com recursos em inglês sinalizados como tal.

## Proposta de valor

Um **guia público, gratuito e sem cadastro** que organiza o caminho de entrada em tecnologia por carreira: roadmap → recursos gratuitos → projeto prático → o que o mercado exige — com curadoria editorial e sem venda de nada.

## Objetivos

| # | Objetivo | Como se reconhece |
|---|---|---|
| O1 | Publicar roadmaps completos para as carreiras iniciais (front-end, back-end, dados e infraestrutura/DevOps). | Roadmap publicado com etapas, tópicos, cursos relacionados e projeto por etapa. |
| O2 | Só recomendar recursos gratuitos ou documentação oficial. | Nenhum curso pago listado; cada curso tem `isFree = true` e provedor identificado. |
| O3 | Ser rápido, acessível e indexável. | Páginas públicas renderizadas no servidor, navegáveis por teclado, com metadata e sitemap. |
| O4 | Manter o conteúdo por um painel administrativo seguro. | CRUD editorial com estados rascunho/publicado/arquivado, só para administradores. |
| O5 | Medir uso sem coletar dados pessoais. | Eventos de navegação sem IP, sem identificador de visitante, desligados até revisão de privacidade. |

## Métricas

Métricas são **Planejadas**: o painel de analytics ainda não agrega nada e nenhum número deve ser exibido sem a coleta estar ligada e revisada (LGPD, [`docs/INTEGRATION.md`](docs/INTEGRATION.md#analytics)).

| Métrica | Fonte prevista | Estado |
|---|---|---|
| Visualizações por página e por carreira | `AnalyticsDailyAggregate` (tipo `PAGE_VIEW`) | Planejado |
| Cliques em roadmaps, cursos e projetos | `ROADMAP_CLICK`, `COURSE_CLICK`, `PROJECT_CLICK` | Planejado |
| Cliques em links externos por host | `EXTERNAL_LINK_CLICK` (`externalHost`) | Planejado |
| Carreiras publicadas / roadmaps publicados | Contagem no banco | Planejado |

O que **não** será medido: usuários únicos, retorno, tempo de sessão ou qualquer métrica que exija identificar o visitante.

## Escopo

### Dentro do MVP

- Site público: início, carreiras, roadmaps, cursos, projetos, mercado (tecnologias/habilidades), lendas da TI, sobre.
- Conteúdo com estados editoriais (rascunho, publicado, arquivado) e slugs únicos.
- Painel administrativo com autenticação própria, para gerenciar conteúdo e ver métricas agregadas.
- Analytics first-party, opcional, sem dados pessoais.
- SEO técnico: metadata por página, Open Graph, canonical, sitemap, robots.
- Identidade visual "colagem editorial" (papel, fita, rabiscos, retrô) em Design System próprio.

### Fora do escopo (decisão de produto)

| Exclusão | Motivo |
|---|---|
| Login, cadastro e perfil de visitante | O site é aberto; identificar pessoas não agrega ao propósito e cria obrigação de privacidade. |
| Progresso persistido em conta, "meu progresso", favoritos sincronizados | Depende de cadastro. Qualquer progresso futuro será local ao navegador e explícito. |
| Assinaturas, pagamentos, cursos pagos | O DevPath não vende nada. |
| Fórum, comentários, comunidade | Moderação e dados pessoais fora do alcance do MVP. |
| Dados de mercado inventados (salários, "% de vagas", "+N pessoas") | Só com fonte citada e data; até lá não aparecem. |
| Busca global | Fora do MVP; os mockups a mostram, mas não há índice nem requisito fechado. |

## Plataforma

Aplicação única Next.js 16 (App Router) publicada na Vercel, PostgreSQL externo via Prisma 7, sem backend separado. Detalhes e justificativas em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) e [`docs/DECISIONS.md`](docs/DECISIONS.md).

## Riscos e dependências

| Risco / dependência | Impacto | Mitigação | Estado |
|---|---|---|---|
| Banco PostgreSQL externo ainda não contratado | Painel e conteúdo real bloqueados | Modo demo mantém o site público funcional; seed reproduz o conteúdo quando o banco existir | Pendente |
| Assets visuais incompletos (logo em paths, textura fotográfica, ilustrações de cena) | Identidade visual parcial | PNGs oficiais de personagens/objetos e SVGs provisórios já existem; componentes aceitam ausência de asset e sinalizam "ilustração pendente"; inventário em [`docs/assets/README.md`](docs/assets/README.md) | Parcial |
| Curadoria editorial (quem escreve e valida roadmaps) | Sem conteúdo real o site não cumpre o objetivo | Conteúdo demo é explícito e transitório; processo editorial a definir | Pendente |
| Licença indefinida | Insegurança jurídica para contribuição e reuso | ADR 0011 registra a pendência; nada é concedido até a decisão | Pendente |
| Rate limit em memória no serverless | Proteção parcial contra força bruta no login | Documentado; versão com armazenamento compartilhado planejada | Planejado |
| Google Fonts no build (`next/font/google`) | Build depende de rede | Alternativa de self-hosting registrada em [`docs/DESIGN.md`](docs/DESIGN.md#5-tipografia) | Aceito |
| Mockups mostram funcionalidades fora do escopo | Expectativa desalinhada | [`docs/DESIGN.md`](docs/DESIGN.md#o-que-os-mockups-mostram-e-não-entra) lista o que não será implementado | Documentado |
