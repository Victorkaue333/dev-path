# DESIGN — DevPath

> Identidade visual, tokens, tipografia, componentes, responsividade, acessibilidade e estratégia de assets. Nível 2 da hierarquia documental. Fonte da verdade dos tokens: [`src/app/globals.css`](../src/app/globals.css). Este documento registra a **direção** e as decisões; o CSS registra os valores.

## 1. Princípios

1. **Colagem editorial, não template.** A identidade lembra um mural: papel rasgado, fita adesiva, post-its, rabiscos à mão, fotos recortadas de figuras históricas, computadores retrô — sobre um fundo verde-escuro quadriculado. Cada página deve parecer montada à mão, mas o layout por baixo é rigoroso (grade, espaçamentos e tokens).
2. **Conteúdo primeiro.** A decoração nunca compete com o texto. Papéis são superfícies de leitura; rabiscos e stickers são `aria-hidden` e nunca carregam informação única.
3. **Verde + papel + tinta.** Poucas cores, muito contraste. O verde (#22C55E) é ação e destaque; o papel (#F8FAEC) é superfície; a tinta (#0F172A) é texto.
4. **Acessível por padrão.** Teclado, foco visível, contraste AA, `prefers-reduced-motion`, textos alternativos reais. Efeito que fere isso não entra.
5. **Honesto.** Sem números fictícios, sem avatar de "usuário", sem contador de pessoas. Se o mockup mostra e o produto não tem, não vai para a tela.

## 2. Fontes da verdade

| Assunto | Onde |
|---|---|
| Tokens (cor, fonte, raio, sombra, movimento) | `src/app/globals.css` (`:root`, `.dark`, `@theme inline`) |
| Componentes base | `src/components/ui/*` (shadcn/ui 4, preset `radix-nova`, gerados pela CLI) |
| Componentes do DevPath | `src/components/design-system/*`, `src/features/*/components/*` |
| Assets | `public/assets/*` e inventário em [`assets/README.md`](assets/README.md) |
| Decisão de stack visual | [ADR 0010](DECISIONS.md#0010--design-system-tailwind-v4--shadcnui-fontes-google) |

## 3. Direção visual (dos mockups de referência)

Os mockups recebidos no bootstrap (home/hero, lista de roadmaps, detalhe de roadmap, brand board com variações de logo e aplicações) mostram:

| Elemento | Descrição | Tratamento no código |
|---|---|---|
| Fundo | Verde-escuro com grade fina (quadriculado de caderno) e textura | Token `--dp-ink` + utilitário `.dp-paper-texture` (gradientes puros); texturas base `textures/grade-verde.svg` e `papel-ruido.svg`; textura fotográfica de papel Pendente |
| Papéis rasgados | Blocos de conteúdo em papel creme com borda irregular, leve rotação | `PaperCard` com `.dp-torn-edge` (clip-path), `textured` e `tilt`; `decorations/papel-rasgado.svg` como alternativa |
| Fita adesiva | Tiras semitransparentes segurando papéis | `Tape` (decorativo, `aria-hidden`); SVGs base em `decorations/fita-adesiva*.svg` |
| Post-its amarelos | Frases curtas em letra de marcador | `StickyNote` com `marker` (`font-marker`) e `taped` |
| Rabiscos | Coroas, setas, sublinhados, smileys em branco/amarelo | `Doodle` (SVG inline por `kind`) e `.dp-marker-underline`; SVGs provisórios em `decorations/` |
| Figuras históricas | Retratos ilustrados recortados com legenda em papel | PNGs oficiais entregues em `characters/` (Ada Lovelace, Alan Turing, Grace Hopper, Margaret Hamilton, Linus Torvalds, Tim Berners-Lee, programador jovem); `CharacterSticker` exibe o PNG via `next/image` e, sem `imageSrc`, mostra placeholder explícito "ilustração pendente" |
| Objetos retrô | Computador CRT com terminal verde, disquete, livros, cartões perfurados, teclado | `RetroTerminal` (CSS); PNGs em `objects/` (`computador-retro`, `terminal-retro-v320`, `tux-e-livros-sticker`) e SVGs provisórios (`monitor-crt`, `janela-terminal`, `cartao-perfurado`) |
| Logotipo | Lettering marker "Dev" (branco/preto) + "Path" (verde) com seta sublinhada e coroa; ícone "P" com seta; variações principal, horizontal, ícone, monocromática | `Logo` renderiza wordmark em texto (`font-marker`) + seta SVG inline. O `branding/logo-devpath.png` entregue não tem canal alfa, por isso não substitui o componente; SVG em paths é Pendente. Ícones `icone-p-*.svg` e `favicon-*.svg` provisórios existem |
| Cartões de carreira | Papel com ícone de linha, título, frase curta, seta verde | `CareerCard` |
| Linha de etapas | Numeração circular verde, conectada por tracejado, etapa ativa com brilho | `RoadmapStep` |

### O que os mockups mostram e **não** entra

| Elemento no mockup | Por quê não |
|---|---|
| Busca global ("O que você quer aprender?") | Fora do MVP ([`PRD.md`](PRD.md) RF-12) |
| Avatar / menu de usuário no cabeçalho | Não há login público ([`PROJECT_CONTEXT.md`](../PROJECT_CONTEXT.md#fora-do-escopo-decisão-de-produto)) |
| "Meu progresso", checkboxes de conclusão com percentual, "0 de 6 concluídos" | Exige conta; progresso local no navegador é decisão futura e explícita |
| "+10.000 pessoas já estão evoluindo", "7+ carreiras", "100% gratuito" como estatística | Números fictícios são proibidos; só com fonte real |
| Faixa salarial, "% de vagas", gráficos de "habilidades mais exigidas" | Só com fonte citada e data; até lá a página Mercado lista tecnologias sem percentuais |
| "Assistir apresentação", "Baixar roadmap (PDF)" | Sem conteúdo nem requisito; podem virar features depois |
| Página "Perfil do usuário" | Fora do escopo definitivamente |

## 4. Cor

### Paleta base (`--dp-*`) — referência inicial, não especificação final

| Token | Valor | Uso |
|---|---|---|
| `--dp-green` | `#22C55E` | Ação primária, destaques, etapa ativa |
| `--dp-green-strong` | `#16A34A` | Texto/ícone verde sobre papel (contraste AA) |
| `--dp-green-soft` | `#DCFCE7` | Fundos sutis de sucesso/destaque |
| `--dp-green-dark` = `--dp-ink` | `#0F172A` | Fundo escuro do mural, texto sobre papel |
| `--dp-ink-soft` | `#334155` | Texto secundário |
| `--dp-paper` | `#F8FAEC` | Superfície de leitura, fundo claro |
| `--dp-paper-strong` / `--dp-paper-line` | `#EEF2D8` / `#D9DDC4` | Fundos secundários, bordas |
| `--dp-yellow` / `--dp-yellow-soft` | `#FBBF24` / `#FEF3C7` | Post-its, rabiscos, destaque editorial |
| `--dp-coral` / `--dp-coral-soft` | `#FB7171` / `#FEE2E2` | Atenção, carimbos, acentos |

Utilitários gerados: `bg-dp-green`, `text-dp-ink`, `border-dp-paper-line`, etc.

### Mapeamento semântico (shadcn)

| Token semântico | Claro | Escuro (`.dark`, não priorizado) |
|---|---|---|
| `--background` / `--foreground` | papel / tinta | tinta / papel |
| `--primary` / `--primary-foreground` | verde / **tinta** | verde / tinta |
| `--secondary`, `--muted` | papel forte | `#1E293B` |
| `--accent` | amarelo suave | `#334155` |
| `--destructive` | `#DC2626` | `#F87171` |
| `--border`, `--input` | linha de papel | papel a 12–16 % |
| `--ring` | verde forte | verde |

**Contraste:** texto tinta sobre verde (#0F172A em #22C55E) ≈ 8:1; por isso `--primary-foreground` é tinta, não branco (branco sobre #22C55E fica abaixo de AA para texto pequeno). Texto verde sobre papel usa `--dp-green-strong`.

## 5. Tipografia

| Papel | Fonte | Token | Carregamento |
|---|---|---|---|
| Interface e texto | **Inter** | `--font-inter` → `font-sans` | `next/font/google`, subsets `latin`, `latin-ext`, `display: swap` |
| Destaques expressivos (post-its, títulos de seção, logo provisório) | **Permanent Marker** | `--font-permanent-marker` → `font-marker` | `next/font/google`, peso 400 |
| Código / terminal | pilha de sistema (`ui-monospace`, Menlo, Consolas) | `font-mono` | — |

Regras: Permanent Marker só em frases curtas (≤ 6 palavras) e nunca em corpo de texto; tamanho mínimo de corpo 16 px; títulos com `text-balance`. Alternativa registrada: self-hosting das fontes (`next/font/local`) se o build sem rede virar requisito — [`PROJECT_CONTEXT.md`](../PROJECT_CONTEXT.md#riscos-e-dependências).

## 6. Forma, espaço, sombra e movimento

| Token | Valor | Uso |
|---|---|---|
| `--radius` (shadcn) | `0.625rem` | Raio base dos componentes |
| `--dp-radius-paper` | `0.75rem 0.5rem 0.875rem 0.375rem` | Cantos irregulares de papel |
| `--shadow-paper`, `--shadow-paper-lift`, `--shadow-sticky` | ver CSS | Papel em repouso, papel elevado (hover), post-it |
| `--dp-section-y` | `clamp(3rem, 8vw, 6rem)` | Espaçamento vertical de seção (`.dp-section`) |
| `--dp-container` | `72rem` | Largura máxima (`.dp-container`) |
| `--duration-fast/base/slow` | 150 / 260 / 480 ms | Transições |
| `--ease-out-soft`, `--ease-doodle` | cúbicas | Entrada suave; "pulo" de sticker |
| `--dp-tilt-1..3` | −1.5°, 1°, −0.75° | Rotações sutis de papel |

Movimento: entradas com Motion (`motion/react`) só em Client Components pequenos (`Reveal`), sempre lendo `useReducedMotion`; o CSS global zera animações em `prefers-reduced-motion: reduce`. Nada de parallax, autoplay ou animação contínua.

## 7. Componentes

### Camada shadcn (`src/components/ui/`) — Implementado

`button`, `card`, `input`, `label`, `badge`, `alert`, `separator`, `skeleton`, `table`, `sheet`, `textarea`. Gerados pela CLI (`pnpm dlx shadcn add <nome>`); ajustes de estilo entram pelos tokens, não editando os arquivos. Componente novo do shadcn = adicionar pela CLI e registrar aqui.

### Camada DevPath (`src/components/design-system/`) — Implementado (contratos e versão inicial)

| Componente | Contrato (props principais) | Notas |
|---|---|---|
| `PaperCard` | `as?: ElementType`, `tilt?`, `torn?: boolean`, `textured?: boolean`, `interactive?: boolean` + props de `div` | Superfície de leitura; `shadow-paper`; `torn` aplica `.dp-torn-edge`; `interactive` eleva no hover |
| `StickyNote` | `color?`, `tilt?: "left"\|"right"\|"none"`, `taped?: boolean`, `marker?: boolean` + props de `aside` | Texto curto; `marker` usa `font-marker`; `shadow-sticky` |
| `Tape` | `color?`, `angle?: number`, `className?` | Decorativo, `aria-hidden` |
| `Doodle` | `kind`, `className?` (cor via utilitário), `strokeWidth?`, `title?` | SVG inline; decorativo por padrão, `title` só quando o rabisco carrega significado |
| `CharacterSticker` | `name`, `imageSrc?`, `caption?`, `size?: "sm"\|"md"\|"lg"`, `tilt?` | Com `imageSrc`, PNG recortado via `next/image` (`alt="Ilustração de <nome>"`); sem, moldura com iniciais e rótulo "ilustração pendente" |
| `RetroTerminal` | `title?` (padrão "devpath"), `lines: readonly string[]`, `className?` | Painel escuro com texto verde monoespaçado; prefixo `$`/`>` é visual |
| `SectionHeading` | `eyebrow?`, `title`, `description?`, `as?: "h1"\|"h2"\|"h3"`, `marker?`, `align?`, `actions?` | `marker` usa `font-marker`; `actions` à direita para filtros/botões |
| `CareerCard` (`features/careers`) | `career: CareerSummary` | Ícone Lucide por `icon` (fallback `Sparkles`), fita e cor por `accent`, link para `/carreiras/<slug>` |
| `RoadmapStep` (`features/roadmaps`) | `step: RoadmapStepItem`, `isLast?: boolean` | Numeração, conector tracejado (exceto na última), lista de tópicos |
| `Reveal` (`components/motion`) | `children`, `delay?`, `className?` | Client Component com `motion/react`; sem animação quando `useReducedMotion()` é verdadeiro |

Regras: componente do DS não acessa dados nem `server-only`; recebe tudo por props; estados vazio/carregando/erro são responsabilidade de `components/feedback` (`EmptyState`, `DevNotice`).

### Anatomia de uma página pública

1. `SectionHeading` com eyebrow (ex.: "Carreiras") e título.
2. Grade responsiva de `PaperCard`/`CareerCard` (1 coluna em celular, 2 em tablet, 3–4 em desktop).
3. Decoração (`Tape`, `Doodle`, `StickyNote`) posicionada por `absolute` dentro de um contêiner `relative`, oculta em telas < 640 px quando atrapalha a leitura.
4. Dados dentro de `<Suspense fallback={<Skeleton/>}>`.

## 8. Estados de tela

| Estado | Componente | Regra |
|---|---|---|
| Carregando | `Skeleton` (shadcn) no `fallback` do `Suspense` | Mesma silhueta do conteúdo |
| Vazio | `EmptyState` | Frase honesta ("Ainda não há roadmaps publicados nesta carreira") + ação quando houver |
| Erro | `src/app/(public)/error.tsx` (Client Component com `reset`) | Mensagem em pt-BR; mostra só o `digest`, nunca stack |
| Não encontrado | `not-found.tsx` | Volta para a home e para a seção |
| Base de desenvolvimento | `DevNotice` (`role="status"`) | **Não montado** desde 30/out/2026 (retirado do layout público a pedido do mantenedor); disponível para reuso. |
| Funcionalidade planejada (admin) | `PlannedSection` + `StatusBadge` | Diz explicitamente "Planejado" em vez de simular a funcionalidade |

## 9. Layout e responsividade

| Faixa | Comportamento |
|---|---|
| < 640 px | 1 coluna; navegação em `Sheet`; decorações pesadas ocultas; sem rolagem horizontal; alvo de toque ≥ 44 px |
| 640–1023 px | 2 colunas; decorações leves |
| ≥ 1024 px | Grade completa até `--dp-container` (72 rem); colagem com stickers nas margens |

Cabeçalho público: logo, navegação (`publicNav`), sem busca e sem avatar. Rodapé: links das seções, "Sobre", repositório, aviso de conteúdo gratuito. Painel: `AdminShell` com barra lateral escura (`--sidebar-*`), navegação `adminNav` e logout.

## 10. Acessibilidade

Checklist aplicado a todo componente e página (verificação por auditoria axe/Lighthouse: **Pendente**):

- [ ] `lang="pt-BR"` no `<html>`; títulos únicos por página.
- [ ] Landmarks: `header`, `nav` (com `aria-label`), `main`, `footer`; `SkipLink` para `#conteudo`.
- [ ] Ordem de foco lógica; foco visível (`outline-ring`, 2 px, offset 2 px); nenhum `outline: none` sem substituto.
- [ ] Contraste ≥ 4.5:1 em texto, ≥ 3:1 em ícones/bordas significativas.
- [ ] Decoração (`Tape`, `Doodle`, texturas) com `aria-hidden="true"`; imagens de conteúdo com `alt` descritivo.
- [ ] Links externos anunciam que abrem em nova aba (ícone + `sr-only`).
- [ ] Formulários: `label` associado, `aria-invalid`, `aria-describedby` para erro, erro em texto (não só cor).
- [ ] `prefers-reduced-motion` respeitado globalmente.
- [ ] Nenhuma informação só por cor (nível de dificuldade tem texto, não só badge colorido).

## 11. Idioma, número e data

Português brasileiro em toda a interface. Datas por `Intl.DateTimeFormat("pt-BR")`; números por `Intl.NumberFormat("pt-BR")`. Níveis exibidos pelos rótulos de `skillLevelLabel` ("Iniciante", "Intermediário", "Avançado"); categorias por `technologyCategoryLabel`.

## 12. Ícones

Lucide React. Tamanho padrão 16 px em botões (classe do shadcn), 20–24 px em cartões. O campo `Career.icon` guarda o nome do ícone Lucide; a resolução nome → componente fica em `CareerCard` com fallback para `Compass` quando o nome não existe.

## 13. Tema

Tema claro é o padrão e o único priorizado no MVP. O bloco `.dark` existe com contraste mínimo para não quebrar quem forçar a classe, mas **não há alternador** e nenhuma tela é validada em escuro ([ADR 0010](DECISIONS.md#0010--design-system-tailwind-v4--shadcnui-fontes-google)).

## 14. Marca e assets

Estratégia:

1. **Nenhum placeholder que pareça definitivo.** Enquanto um asset não existe, o componente mostra texto/moldura explicitamente marcada como pendente.
2. **Inventário único** em [`assets/README.md`](assets/README.md): o que existe, o que falta, formato e dimensões recomendadas por pasta (`branding`, `characters`, `objects`, `decorations`, `textures`, `illustrations`).
3. **Formatos:** SVG para logo, rabiscos, fitas e setas; WebP/AVIF para ilustrações e retratos (com `next/image`); PNG só quando transparência com gradiente complexo exigir.
4. **Direitos:** retratos de figuras históricas devem ser ilustrações próprias ou obras em domínio público/licença compatível, com crédito no inventário. Nada é copiado dos mockups gerados sem revisão de direitos.
5. **Logo:** quando o SVG oficial em paths existir, `Logo` passa a renderizá-lo com `alt="DevPath"`; variações (principal, horizontal, ícone, monocromática) seguem a nomenclatura do inventário. O `logo-devpath.png` entregue serve de referência, não de asset de interface (sem transparência).

Estado atual (bootstrap): PNGs oficiais de personagens e objetos entregues pelo mantenedor; SVGs provisórios de decoração, ícones e texturas desenhados a partir dos mockups; logo em paths, textura fotográfica, ilustrações de cena e OG image **Pendentes**. Detalhe por arquivo em [`assets/README.md`](assets/README.md).

## 15. Nunca faça

- Texto sobre textura sem superfície de papel por baixo.
- Permanent Marker em parágrafos ou em menos de 18 px.
- Rotação acima de 2° em blocos com texto corrido.
- Decoração que recebe foco ou é lida por leitor de tela.
- Cor como única diferença entre estados.
- Contador, estatística ou "pessoas estudando" sem fonte real.
- Avatar, login ou "meu progresso" no site público.
- Editar `src/components/ui/*` à mão para mudar estilo global — ajuste o token.

## 16. Divergências conhecidas e pendências

| Item | Estado |
|---|---|
| Assets | **Parcial**: PNGs oficiais de personagens/objetos e SVGs provisórios presentes; logo em paths, textura fotográfica, ilustrações de cena e OG image Pendentes ([`assets/README.md`](assets/README.md)) |
| Auditoria de acessibilidade (axe/Lighthouse) | Pendente |
| Hero da home seguindo o mockup (logo oficial, fundo do mural, Ada e Turing, cartões de papel, computador e Tux, dimensionada por `svh`) | **Implementado** (v1, 30/out/2026) |
| Demais telas finais seguindo os mockups | Planejado ([M1](milestones/M1-hero-e-paginas-publicas.md)) |
| Tema escuro validado | Não priorizado |
| `Reveal` (Motion) e `error.tsx` público | Implementados; `error.tsx` por segmento de detalhe e `loading.tsx`: a avaliar na M1 |
