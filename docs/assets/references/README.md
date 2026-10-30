# Referências visuais (mockups)

Esta pasta guarda os **mockups de referência** que orientam a identidade visual do DevPath
(colagem editorial, papel rasgado, fitas adesivas, rabiscos, tecnologia retrô).

## Estado atual

**Os arquivos ainda não estão nesta pasta.** Os cinco mockups foram compartilhados apenas no chat
da sessão de bootstrap e o agente não consegue gravar imagens do chat em disco. Salve-os
manualmente aqui com os nomes abaixo para que o restante da documentação possa referenciá-los.

| Arquivo sugerido | Conteúdo | Existe? |
|---|---|---|
| `mockup-01-home-hero.png` | Página inicial: hero com wordmark DevPath, Ada Lovelace e Alan Turing, cartões de carreiras | Não |
| `mockup-02-roadmap-frontend.png` | Detalhe de roadmap (Frontend): sidebar de carreiras, etapas 1–7, lista de tópicos, recursos em destaque | Não |
| `mockup-03-guia-de-marca.png` | Guia de marca: variações do logo, ícones/favicon, paleta, tipografia, elementos, aplicações | Não |
| `mockup-04-visao-geral-telas.png` | Grade com 9 telas (home, roadmaps, roadmap, cursos, mercado, projetos, lendas, sobre, perfil) | Não |
| `mockup-05-roadmaps.png` | Página Roadmaps: cartões de carreira, etapa "Fundamentos da Web", cursos, projeto, mercado | Não |

## Avisos importantes sobre o conteúdo dos mockups

Os mockups são **referência estética**, não especificação funcional. Vários elementos neles
contrariam as regras do produto (`PROJECT_CONTEXT.md`, `docs/PRD.md`) e **não devem ser implementados**:

- Avatar/perfil de usuário no cabeçalho, tela "Meu progresso" e barras de progresso por conta
  (o DevPath não tem cadastro de visitantes).
- Números como "+10.000 pessoas já estão evoluindo", percentuais de habilidades exigidas e
  faixas salariais (não apresentar estatísticas sem fonte real e data).
- Botão "Assistir apresentação" e "Baixar roadmap (PDF)" (não existem ainda).
- Campo de busca global (não planejado para o MVP).

O que **deve** ser aproveitado: paleta, tipografia (Inter + Permanent Marker), composição em
colagem, cartões de papel, fitas, post-its, rabiscos, janela de terminal, monitor CRT, cartões
perfurados, pilha de livros e os retratos ilustrados das figuras históricas.

## Formato recomendado

- PNG ou WebP, largura mínima 1536 px (como enviados).
- Não otimizar nem recortar: são referência de trabalho, não assets do site.
- Esta pasta **não** é servida pelo Next.js (fica fora de `public/`).
