# Specs de features — DevPath

Uma spec por feature, nomeada pelo slug (`<slug>.md`), criada a partir de [`../../templates/TEMPLATE-spec-feature.md`](../../templates/TEMPLATE-spec-feature.md) e regida por [`../README.md`](../README.md).

Telas públicas: comece pelo guarda-chuva [`paginas-publicas-v1.md`](paginas-publicas-v1.md) (princípios de layout, breakpoints, padrões compartilhados, ordem de implementação) e siga para a spec da tela.

| Spec | Status | Milestone | Resumo |
|---|---|---|---|
| [`painel-admin-autenticacao.md`](painel-admin-autenticacao.md) | implementada | M0 | Login exclusivo de administradores, sessão em cookie httpOnly, barreira do `proxy.ts`, fail-closed sem configuração |
| [`paginas-publicas-v1.md`](paginas-publicas-v1.md) | proposta | M1 | Guarda-chuva das telas públicas: layout sobre o mural, componentes compartilhados, regras de conteúdo, tabela de telas |
| [`home.md`](home.md) | hero implementada; seções abaixo propostas | M1 | Página inicial: hero (feita) + destaques de roadmaps, lendas, "como funciona" e chamada final |
| [`carreiras-lista.md`](carreiras-lista.md) | proposta | M1 | `/carreiras`: grade de carreiras publicadas |
| [`carreira-detalhe.md`](carreira-detalhe.md) | proposta | M1 | `/carreiras/[slug]`: roadmaps, tecnologias e projetos da carreira |
| [`roadmaps-lista.md`](roadmaps-lista.md) | proposta | M1 | `/roadmaps`: roadmaps por carreira e nível |
| [`roadmap-detalhe.md`](roadmap-detalhe.md) | proposta | M1 | `/roadmaps/[slug]`: linha de etapas, tópicos, cursos relacionados; sem progresso/PDF |
| [`cursos-lista.md`](cursos-lista.md) | proposta | M1 | `/cursos`: filtros por nível/idioma/carreira, badge "Documentação oficial" |
| [`projetos-lista.md`](projetos-lista.md) | proposta | M1 | `/projetos`: projetos por nível |
| [`projeto-detalhe.md`](projeto-detalhe.md) | proposta (rota nova) | M1 | `/projetos/[slug]`: critérios de conclusão com renderização segura de Markdown |

Specs ainda **a escrever** (sessão de 30/out/2026 interrompida pelo mantenedor; retomar na próxima rodada): `mercado.md`, `lendas-galeria.md`, `lenda-detalhe.md`, `sobre.md`, `nao-encontrado.md`, `erro.md` (M1); `admin-dashboard.md`, `admin-crud-conteudo.md`, `admin-analytics.md` (M3/M4); `banco-e-seed.md` (M2).
