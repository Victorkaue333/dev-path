# Inventário de assets — DevPath

Fonte normativa para `public/assets/`. Complementa `docs/DESIGN.md` (identidade, tokens, componentes).
Mockups de referência: `docs/assets/references/README.md`.

Legenda de **Origem/Status**:

- **Oficial** — arquivo fornecido pelo mantenedor (bitmap). Origem/licença ainda a registrar (ver [Licenciamento](#licenciamento)).
- **Base** — forma geométrica simples, pode ser usada como está.
- **Provisório** — vetor desenhado à mão neste repositório a partir do logotipo oficial e dos mockups.
  Serve para desenvolvimento e pode ser trocado por arte final sem mudar o contrato dos componentes.
- **Pendente** — não existe. Não criar placeholder que pareça definitivo.

Paleta usada nos SVGs: `#22C55E` (verde), `#0F172A` (tinta/verde escuro), `#F8FAEC` (papel/creme),
`#FBBF24` (amarelo), `#FB7171` (coral), `#FFFFFF` (brilho). A textura de grade usa o fundo `#0D2B20`,
derivado visualmente dos mockups (decisão provisória; ver `docs/DESIGN.md`).

Todos os SVGs têm `viewBox`, `role="img"` e `<title>`; nenhum tem script, fonte embutida ou
dimensão fixa obrigatória. Tamanho máximo por SVG: 10 KB (maior arquivo atual: 1,9 KB).
Validação: 28 SVGs bem-formados (parser XML .NET), conferidos visualmente em folha de contato
renderizada no Chromium sobre fundo escuro e fundo papel.

---

## Atenção: bitmaps com fundo "falso"

A verificação de transparência foi feita de duas formas: (a) leitura do cabeçalho `IHDR` e dos chunks
do PNG (tipo de cor e presença de `tRNS`) e (b) amostragem de pixels nas bordas via System.Drawing.
Resultado: **cinco PNGs são truecolor RGB (tipo 2), sem canal alfa e sem chunk `tRNS`** — o fundo
quadriculado ou preto está gravado na imagem; não há paleta com transparência. Eles funcionam apenas
sobre fundo igual ao gravado e **precisam ser reexportados com alfa real** antes de uso em colagem:

| Arquivo | Fundo gravado | Observação |
|---|---|---|
| `branding/logo-devpath.png` | quadriculado cinza | **Oficial, mas inutilizável no site até exportação com fundo transparente (PNG-24/WebP com alfa ou SVG).** Bloqueia o uso no cabeçalho e na hero. |
| `characters/programador-jovem.png` | preto | Opaco (RGB, sem tRNS). Usável só sobre `#0F172A`/preto. |
| `characters/linus-torvalds.png` | quadriculado cinza | Opaco (RGB, sem tRNS). Reexportar. |
| `objects/tux-e-livros-sticker.png` | quadriculado cinza | Opaco (RGB, sem tRNS). Reexportar. |
| `objects/computador-retro.png` | preto | Opaco (RGB, sem tRNS). Usável só sobre fundo escuro. |

Os demais seis (`ada-lovelace`, `alan-turing`, `grace-hopper`, `margaret-hamilton`, `tim-berners-lee`,
`terminal-retro-v320`) são RGBA (tipo 6) com alfa real nas bordas.

`characters/grace-hopper.png` tem alfa, mas com um **halo cinza semitransparente** (gradiente do
fundo original, alfa ≈ 50% perto da borda do adesivo). Revisar o recorte antes da hero.

Peso: cada PNG tem entre 2,4 MB e 3,7 MB (≈ 32 MB no total). Antes de produção, gerar versões
otimizadas (WebP/AVIF, ~1200 px de lado maior) e manter os originais fora do bundle ou em LFS —
decisão pendente, registrar em `docs/DECISIONS.md`.

---

## `public/assets/branding/`

| Arquivo | Existe? | Origem/Status | Dimensões | Uso previsto |
|---|---|---|---|---|
| `logo-devpath.png` | Sim | **Oficial, mas inutilizável no site até exportação com fundo transparente** (PNG-24/WebP com alfa ou SVG); RGB truecolor sem alfa | 1536×1024 px, 2.619.655 B | `Logo` no cabeçalho e hero, OG image, README — **após** reexportação |
| `logo-devpath.webp` | Sim | **Derivado** (fundo removido por `scripts/remover-fundo-sticker.cjs` e recortado no limite do desenho) | 1552×1041 px, WebP com alfa, ~260 KB | hero (`HeroWordmark`) e README |
| `icone-p-seta.svg` | Sim | Provisório (estilo adesivo) | viewBox 104×104; 24–160 px | `Logo` variante ícone, app icon |
| `icone-p-coroa.svg` | Sim | Provisório (estilo adesivo) | viewBox 104×124 | destaques, selo |
| `favicon-escuro.svg` | Sim | Provisório (estilo adesivo) | viewBox 64×64; 16–64 px, fundo `#0F172A` | `src/app/icon.svg` quando aprovado |
| `favicon-claro.svg` | Sim | Provisório (estilo adesivo) | viewBox 64×64; fundo `#F8FAEC` | favicon em tema claro |
| `logo-devpath.png` **com transparência real** | Não | **Pendente** | PNG-32 ou WebP, 1536×1024 px | substitui o atual |
| Variações do logotipo (horizontal, monocromática, ícone isolado) em bitmap ou paths | Não | Pendente | conforme guia de marca dos mockups | rodapé escuro, painel admin, e-mail |
| `og-image.png` | Não | Pendente | 1200×630 px | Open Graph padrão |

**Decisão desta rodada:** os três wordmarks provisórios em `<text>` (`logo-devpath-principal.svg`,
`logo-devpath-horizontal.svg`, `logo-devpath-mono.svg`) foram **removidos** porque o logotipo oficial
passou a existir como PNG; manter um lettering em fonte substituta induziria ao uso errado. Enquanto
não houver versão vetorial oficial, o `Logo` em React (`src/components/branding/logo.tsx`) continua
sendo o fallback textual.

## `public/assets/characters/`

Retratos ilustrados em estilo gravura/adesivo (borda creme recortada). Nenhum retrato é gerado em SVG.

| Arquivo | Existe? | Origem/Status | Dimensões | Uso previsto |
|---|---|---|---|---|
| `ada-lovelace.png` | Sim | **Oficial** | 1145×1373 px, 2.531.021 B, transparente | `CharacterSticker`, hero, Lendas da TI |
| `alan-turing.png` | Sim | **Oficial** (inclui máquina Enigma e etiquetas "Alan Turing / Fundamentos da computação") | 1167×1347 px, 2.885.217 B, transparente | hero, Lendas da TI |
| `grace-hopper.png` | Sim | **Oficial** (halo cinza semitransparente — revisar recorte) | 1024×1536 px, 2.783.799 B, alfa parcial | Lendas da TI |
| `margaret-hamilton.png` | Sim | **Oficial** | 1024×1536 px, 3.703.032 B, transparente nas bordas | Lendas da TI |
| `tim-berners-lee.png` | Sim | **Oficial** | 1281×1227 px, 2.452.097 B, transparente | Lendas da TI (requer registro no conteúdo demo/banco) |
| `linus-torvalds.png` | Sim | **Oficial** (fundo quadriculado gravado) | 1254×1254 px, 3.149.899 B, sem alfa | Lendas da TI (requer registro no conteúdo demo/banco) |
| `linus-torvalds.webp` | Sim | **Derivado** (fundo removido) | 1254×1254 px, WebP com alfa, ~438 KB | Lendas da TI (`imagePath`) |
| `programador-jovem.png` | Sim | **Oficial** (fundo preto gravado; contém post-its com frases e livros Python/JS/TS) | 1536×1024 px, 2.558.327 B, sem alfa | página Sobre, estados vazios |
| `programador-jovem.webp` | Sim | **Derivado** (fundo preto removido) | 1536×1024 px, WebP com alfa, ~460 KB | página Sobre (planejado) |

Observações:

- `src/features/legends/demo-data.ts` ainda tem `imagePath` vazio para todas as figuras e não lista
  Tim Berners-Lee nem Linus Torvalds. Ligar os caminhos (`/assets/characters/<slug>.png`) e criar os
  registros é tarefa da próxima onda (fora do escopo deste inventário).
- As etiquetas de texto dentro de `alan-turing.png` e `programador-jovem.png` são parte da arte;
  não repetir o mesmo texto ao lado em HTML (redundância para leitores de tela) — usar `alt`
  descritivo.

## `public/assets/decorations/`

Todos reescritos nesta rodada no **estilo adesivo** (ver [Estilo dos SVGs](#estilo-dos-svgs)).
Os `viewBox` cresceram em relação à versão anterior para caber o halo; os nomes foram mantidos.

| Arquivo | Existe? | Origem/Status | Dimensões | Uso previsto |
|---|---|---|---|---|
| `coroa.svg` | Sim | Provisório | viewBox 96×84; 28–96 px | `Doodle kind="crown"`, selo em cartões |
| `coroa-branca.svg` | Sim | Provisório | viewBox 96×84 | sobre fundo escuro |
| `seta-marker.svg` | Sim | Provisório | viewBox 164×76; 80–200 px | `Doodle kind="arrow"`, CTA da hero |
| `seta-branca-rabisco.svg` | Sim | Provisório | viewBox 144×80 | sobre fundo escuro |
| `seta-amarela.svg` | Sim | Provisório | viewBox 164×68 | chamadas em post-it |
| `fita-adesiva.svg` | Sim | Base | viewBox 144×52; largura 90–180 px | `Tape` (padrão, kraft/creme) |
| `fita-adesiva-verde.svg` | Sim | Base | viewBox 144×52 | `Tape color="green"` |
| `fita-adesiva-coral.svg` | Sim | Base | viewBox 144×52 | `Tape color="coral"` |
| `fita-adesiva-amarela.svg` | Sim | Base | viewBox 144×52 | `Tape color="yellow"` |
| `post-it-amarelo.svg` | Sim | Base | viewBox 152×152; 130–240 px | `StickyNote` (fundo, com fita no topo) |
| `papel-rasgado.svg` | Sim | Base | viewBox 264×184; escalável | `PaperCard` (fundo alternativo ao `.dp-torn-edge`) |
| `smiley.svg` | Sim | Provisório | viewBox 80×80 | `Doodle kind="smiley"` |
| `asterisco.svg` | Sim | Provisório | viewBox 72×72 | `Doodle kind="asterisk"` |
| `chaves-codigo.svg` | Sim | Provisório | viewBox 128×72 | tag `</>` em cartões de carreira |
| `cursor-seta.svg` | Sim | Base | viewBox 60×68; 28–48 px | decoração junto ao logo/CTA |
| `sublinhado-marker.svg` | Sim | Provisório | viewBox 200×36 (`preserveAspectRatio="none"`) | `SectionHeading` (destaque de palavra) |
| `bulb-rabisco.svg` | Sim | Provisório | viewBox 80×104 | dicas em post-it |
| `fx-rabisco.svg` | Sim | Provisório | viewBox 100×68 | fundo da hero |
| `binario-rabisco.svg` | Sim | Provisório | viewBox 184×60 | fundo da hero |
| Clipe de papel, bússola, pin | Não | Pendente | SVG estilo adesivo, ~64×64 | decoração secundária (baixa prioridade) |

## `public/assets/objects/`

| Arquivo | Existe? | Origem/Status | Dimensões | Uso previsto |
|---|---|---|---|---|
| `terminal-retro-v320.png` | Sim | **Oficial** (tela com "$ devpath / > estudar / > construir / > evoluir / > conquistar") | 1305×1205 px, 2.895.916 B, transparente | hero, `RetroTerminal` como imagem |
| `computador-retro.png` | Sim | **Oficial** (fundo preto gravado; tela vazia) | 1391×1131 px, 3.009.639 B, sem alfa | página Sobre, seção retrô |
| `computador-retro.webp` | Sim | **Derivado** (fundo preto removido) | 1391×1131 px, WebP com alfa, ~479 KB | páginas públicas (planejado) |
| `nota-papel-rasgado.png` | Sim | **Oficial** (fornecido pelo mantenedor; origem/licença a registrar) | 1275×1234 px, RGB opaco (xadrez embutido), ~2,8 MB | fonte do `.webp` abaixo |
| `nota-papel-rasgado.webp` | Sim | **Derivado** (fundo removido) | 1275×1234 px, WebP com alfa, ~253 KB | fundo dos cartões de carreira da hero (`HeroCareerCard`) |
| `faixa-papel-rasgado.png` | Sim | **Oficial** (fornecido pelo mantenedor; origem/licença a registrar) | 2172×724 px, PNG RGBA (já transparente), ~? MB | fonte do `.webp` abaixo |
| `faixa-papel-rasgado.webp` | Sim | **Derivado** (recortada nas margens transparentes, WebP ~141 KB) | 2137×225 px | faixa de papel do cabeçalho (`SiteHeader`) |
| `disquetes.webp` | Sim | **Derivado** (recortado da folha `../../docs/assets/references/folha-objetos-retro.png`; origem/licença a registrar) | 344×325 px, WebP com alfa, ~45 KB | decoração de seções públicas (planejado) |
| `teclado-retro.webp` | Sim | **Derivado** (recortado da folha) | 462×403 px, ~63 KB | decoração de seções públicas (planejado) |
| `monitor-crt-terminal.webp` | Sim | **Derivado** (recortado da folha) | 395×378 px, ~64 KB | decoração de seções públicas (planejado) |
| `cartoes-perfurados.webp` | Sim | **Derivado** (recortado da folha) | 394×314 px, ~49 KB | decoração de seções públicas (planejado) |
| `placa-de-circuito.webp` | Sim | **Derivado** (recortado da folha; resta um toco mínimo da coroa no canto superior direito) | 363×376 px, ~63 KB | decoração de seções públicas (planejado) |
| `moldura-polaroid.webp` | Sim | **Derivado** (recortado da folha) | 339×387 px, ~45 KB | decoração de seções públicas (planejado) |
| `modem-acoplador.webp` | Sim | **Derivado** (recortado da folha) | 497×276 px, ~55 KB | decoração de seções públicas (planejado) |
| `impressora-matricial.webp` | Sim | **Derivado** (recortado da folha) | 438×376 px, ~62 KB | decoração de seções públicas (planejado) |
| `fita-cassete.webp` | Sim | **Derivado** (recortado da folha) | 368×282 px, ~43 KB | decoração de seções públicas (planejado) |
| `osciloscopio.webp` | Sim | **Derivado** (recortado da folha) | 456×317 px, ~62 KB | decoração de seções públicas (planejado) |
| `mouse-retro.webp` | Sim | **Derivado** (recortado da folha) | 415×331 px, ~42 KB | decoração de seções públicas (planejado) |
| `fita-perfurada.webp` | Sim | **Derivado** (recortado da folha) | 334×322 px, ~38 KB | decoração de seções públicas (planejado) |
| `tux-e-livros-sticker.png` | Sim | **Oficial** (fundo quadriculado gravado; lombadas "Computer Science / Algorithms / System Design / Good Code / Better People") | 1536×1024 px, 3.243.966 B, sem alfa | seção Cursos |
| `tux-e-livros-sticker.webp` | Sim | **Derivado** (fundo removido) | 1536×1024 px, WebP com alfa, ~496 KB | hero, canto inferior direito |
| `janela-terminal.svg` | Sim | Provisório (estilo adesivo, novo) | viewBox 184×140; 160–360 px | ícone/decoração do `RetroTerminal` |
| `monitor-crt.svg` | Sim | Provisório (estilo adesivo, novo) | viewBox 184×168 | ícone de carreira Frontend |
| `cartao-perfurado.svg` | Sim | Provisório (estilo anterior, linha fina) | viewBox 200×90 | decoração de fundo, Lendas da TI |
| `disquete.svg`, `livros-pilha.svg` | Não | — | — | constavam no inventário anterior mas não existem no disco; não serão recriados (os PNGs oficiais cobrem livros e computador). Disquete fica como Pendente de baixa prioridade. |
| Teclado, caneta, lápis | Não | Pendente | PNG/WebP com transparência | bordas da colagem |

## `public/assets/textures/`

| Arquivo | Existe? | Origem/Status | Dimensões | Uso previsto |
|---|---|---|---|---|
| `hero-background.png` | Sim | **Oficial** (fornecido pelo mantenedor; origem/licença a registrar) | 1672×941 px, RGB opaco (fundo, não precisa de alfa), ~2,4 MB — otimizar para WebP antes da produção | fundo da hero (`src/features/home/components/hero.tsx`, via `next/image` com `fill` + `priority`) |
| `hero-background.webp` | Sim | **Derivado** (redimensionado a partir do PNG, q75) | 1672×941 px, WebP, ~150–250 KB | faixa `.dp-mural-band` atrás do cabeçalho nas páginas sem hero (`globals.css`) |
| `grade-verde.svg` | Sim | Base | tile 240×240 (célula 24 px) | fallback CSS do fundo da hero (`.dp-hero-bg`) e cabeçalho escuro |
| `papel-ruido.svg` | Sim | Base | tile transparente 120×120 | sobreposição em `PaperCard`/`StickyNote` |
| Textura de papel real | Não | **Pendente** | JPG/WebP 2048×2048 px, sem emenda visível | fundo claro do site |
| Textura de papelão/kraft | Não | Pendente | JPG/WebP 2048×2048 px | etiquetas e selos |

## `public/assets/illustrations/`

Pasta reservada para ilustrações de cena (hero composta, estados vazios). Não criada (ficaria vazia).
**Pendente** de direção de arte.

## `docs/assets/references/`

Mockups de referência (5 PNGs). **Pendente**: salvar manualmente — ver `docs/assets/references/README.md`.

---

Folha de adesivos de objetos retrô (fonte dos 12 `objects/*.webp` recortados; não é asset de produção):

| Arquivo | Existe? | Origem/Status | Dimensões | Uso |
|---|---|---|---|---|
| `folha-objetos-retro.png` | Sim | **Oficial** (fornecida pelo mantenedor em 30/out/2026; origem/licença a registrar) | 1536×1024 px, PNG RGBA (já transparente entre adesivos), ~3.3 MB | fonte de `pnpm assets:recortar-folha` |
| `folha-objetos-retro-deteccao.png` | Sim | Derivado (saída `--debug`) | 1536×1024 px | conferência: caixas numeradas da detecção |
| `folha-objetos-retro-recortes.png` | Sim | Derivado (saída `--debug`) | 1440×1080 px | conferência: grade dos 12 recortes sobre verde |

## Mapeamento de renomeação

Arquivos recebidos do mantenedor em `public/assets/logos/`, `objects/` e `personas/` foram movidos
para a estrutura canônica com nomes kebab-case ASCII. Nenhum bitmap foi alterado.

| Nome original | Pasta original | Caminho novo |
|---|---|---|
| `Autocolante DevPath em estilo graffiti.png` | `logos/` | `branding/logo-devpath.png` |
| `Retrato Vintage de Ada Lovelace.png` | `personas/` | `characters/ada-lovelace.png` |
| `Alan Turing e a Máquina Enigma.png` | `personas/` | `characters/alan-turing.png` |
| `Retrato de Grace Hopper em Uniforme.png` | `personas/` | `characters/grace-hopper.png` |
| `Margaret Hamilton e a Torre de Código.png` | `personas/` | `characters/margaret-hamilton.png` |
| `Programador Jovem em Estilo Comic.png` | `personas/` | `characters/programador-jovem.png` |
| `Tim Berners-Lee_ A criação da Web.png` | `characters/` | `characters/tim-berners-lee.png` |
| `Linus Torvalds em Estilo Comic Retro.png` | `characters/` | `characters/linus-torvalds.png` |
| `Autocolante de Terminal Retro V-320.png` | `objects/` | `objects/terminal-retro-v320.png` |
| `Computador Retro Vintage em Estilo Sticker.png` | `objects/` | `objects/computador-retro.png` |
| `Autocolante Vintage_ Tux e Livros de Programação.png` | `objects/` | `objects/tux-e-livros-sticker.png` |

As pastas `logos/` e `personas/` foram removidas (vazias). Novos arquivos devem ir direto para a
pasta canônica, já com nome kebab-case.

## Estilo dos SVGs

Receita usada em `decorations/`, `branding/` e nos dois objetos novos, derivada do logotipo oficial:

1. **Halo de adesivo** — o mesmo path desenhado atrás com `stroke="#F8FAEC"`, `stroke-width` 12–24
   (e `fill="#F8FAEC"` em formas fechadas). Simula o recorte branco de sticker.
2. **Contorno de tinta** — `stroke="#0F172A"`, `stroke-width` 5–16 conforme o tamanho,
   sempre `stroke-linecap="round"` e `stroke-linejoin="round"`.
3. **Preenchimento chapado** — uma cor da paleta por elemento: verde `#22C55E`, amarelo `#FBBF24`,
   coral `#FB7171`, creme `#F8FAEC`, tinta `#0F172A`. Sem gradientes, sem filtros.
4. **Imperfeições de marcador** — uma linha fina de tinta com `stroke-opacity` 0,2–0,35 ligeiramente
   deslocada, ou um traço curto da cor principal "escapando" do contorno.
5. **Brilho** — um traço branco curto (`stroke-opacity` 0,55–0,85) no canto superior esquerdo.
6. Em traços (setas, letras), a ordem é: halo → tinta → cor, com larguras aproximadas 24 → 15 → 8.
7. Reservar 8–12 unidades de margem no `viewBox` para o halo não ser cortado.

Para criar um novo elemento, copie `decorations/coroa.svg` (forma fechada) ou `decorations/seta-marker.svg`
(traço) e troque os paths. Tamanho-alvo: menos de 2 KB.

---

## Pendências

- Reexportar com transparência real: `logo-devpath.png`, `programador-jovem.png`, `linus-torvalds.png`,
  `tux-e-livros-sticker.png`, `computador-retro.png`; revisar halo de `grace-hopper.png`.
- **Otimizar todos os bitmaps para WebP (< 300 KB cada) antes de usar em produção** — hoje cada PNG
  tem 2,4–3,7 MB (≈ 32 MB no total). Definir também a política de peso/LFS para os originais.
- Variações do logotipo (horizontal, monocromática) e ícone oficial em paths.
- `og-image.png` 1200×630.
- Texturas de papel e kraft reais.
- Ilustrações de cena (`illustrations/`).
- Os 5 PNGs de referência em `docs/assets/references/`.
- Registro de origem/licença de todos os bitmaps (seção abaixo).
- Ligar `imagePath` das figuras em `src/features/legends/demo-data.ts` e adicionar Tim Berners-Lee e
  Linus Torvalds ao conteúdo (próxima onda).

## Licenciamento

**Pendente.** Os bitmaps marcados como **Oficial** foram fornecidos pelo mantenedor; a origem
(ferramenta/artista), a licença ou o contrato e as restrições de uso ainda **não foram registrados**
— fazer isso aqui antes de publicar o site. Os SVGs desta pasta foram desenhados do zero para o
projeto e seguem a licença do repositório, que também **ainda não está definida** (ver `LICENSE`).
Fontes: Inter (SIL Open Font License) e Permanent Marker (Apache License 2.0), via `next/font/google`.

## A remover pelo mantenedor

Dois arquivos ficaram em `public/assets/` porque a remoção automática foi bloqueada nesta sessão; apague-os manualmente antes do primeiro commit:

| Arquivo | Motivo |
|---|---|
| `public/assets/background/Quadro Verde de Ideias e Inovação.png` | Duplicata byte a byte (mesmo SHA-256) de `textures/hero-background.png`; 2,4 MB a mais no git. |
| `public/assets/logotipos/image.png` | Print de 314×52 px da árvore do VS Code, salvo por engano no lugar do logotipo. |

## Remover fundo embutido de novos adesivos

Quando um PNG chegar com o "xadrez" de transparência ou fundo preto gravado na imagem, gere a versão com alfa sem tocar no original:

```bash
pnpm assets:remover-fundo public/assets/objects/novo.png public/assets/objects/novo.webp checker   # xadrez
pnpm assets:remover-fundo public/assets/characters/novo.png public/assets/characters/novo.webp black # fundo preto
```

O script (`scripts/remover-fundo-sticker.cjs`, usa `sharp`) faz flood fill a partir das bordas e para no halo creme do adesivo. Confira o resultado sobre fundo escuro antes de usar e registre o `.webp` nesta tabela como **Derivado**.

### Recortar uma folha de adesivos

Quando vários adesivos vierem numa única imagem (como a folha de objetos retrô), recorte todos de uma vez, cada um num `.webp` transparente:

```bash
pnpm assets:recortar-folha docs/assets/references/folha-objetos-retro.png public/assets/objects \n  --min-area=8000 --pad=14 --raio=1 --erosao=8 --esperados=12 --debug=docs/assets/references \n  --nomes=disquetes,teclado-retro,monitor-crt-terminal,cartoes-perfurados,placa-de-circuito,moldura-polaroid,modem-acoplador,impressora-matricial,fita-cassete,osciloscopio,mouse-retro,fita-perfurada
```

O script (`scripts/recortar-folha-stickers.cjs`, usa `sharp`) detecta o fundo (alfa baixo, ou cor bege/cinza se a folha for opaca), separa os adesivos por componentes conexos, descarta rabiscos pequenos (`--min-area`), quebra pontes finas entre vizinhos (`--erosao`) e nomeia na ordem de leitura. Se a contagem não bater com `--esperados`, ele para e grava `<folha>-deteccao.png` com as caixas numeradas para você ajustar os parâmetros. Confira `<folha>-recortes.png` antes de usar e registre cada arquivo na tabela de `objects/` como **Derivado**.

## Como usar

### Imagem de conteúdo (com texto alternativo)

```tsx
import Image from "next/image";

<Image
  src="/assets/characters/ada-lovelace.png"
  alt="Ilustração de Ada Lovelace em estilo gravura, com flores amarelas no cabelo"
  width={1145}
  height={1373}
  sizes="(min-width: 1024px) 320px, 60vw"
/>
```

### Decoração (ignorada por leitores de tela)

```tsx
<img
  src="/assets/decorations/coroa.svg"
  alt=""
  aria-hidden="true"
  width={48}
  height={42}
  className="pointer-events-none select-none"
/>
```

### Textura como fundo (CSS)

```css
.hero {
  background-color: #0d2b20;
  background-image: url("/assets/textures/grade-verde.svg");
  background-size: 240px 240px;
}
```

### Regras

- Decorativos sempre com `alt=""` e `aria-hidden="true"`; nunca transmitir informação só por eles.
- Respeitar `prefers-reduced-motion` ao animar qualquer asset (tokens em `src/app/globals.css`).
- Não referenciar arquivo que não existe neste inventário; se precisar de um novo, adicioná-lo
  aqui primeiro com status e dimensões.
- Não usar os PNGs com fundo gravado sobre fundo diferente do gravado até a reexportação.
- Antes de ir a produção: otimizar bitmaps e preencher a seção Licenciamento.
