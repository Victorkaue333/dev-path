/* eslint-disable */
/**
 * Remove o fundo embutido ("xadrez" de transparência falsa ou preto chapado) de um PNG de adesivo.
 *
 * Como funciona: flood fill a partir das quatro bordas atravessando só pixels de fundo; o halo
 * creme do adesivo bloqueia o preenchimento, então o interior nunca é alterado. A saída é WebP
 * com alfa (quality 90), o formato usado em public/assets. O arquivo de entrada não é modificado.
 *
 * Uso:
 *   pnpm assets:remover-fundo <entrada.png> <saida.webp> [checker|black]
 *   ex.: pnpm assets:remover-fundo public/assets/objects/novo.png public/assets/objects/novo.webp checker
 *
 * Limitações: depende de o adesivo ter um halo contínuo e de cor não neutra (creme). Confira o
 * resultado visualmente sobre fundo escuro antes de usar. Registre o arquivo em docs/assets/README.md.
 */
const path = require("node:path");
const sharp = require("sharp");

const [, , input, output, mode = "checker"] = process.argv;

if (!input || !output) {
  console.error(
    "Uso: node scripts/remover-fundo-sticker.cjs <entrada.png> <saida.webp> [checker|black]",
  );
  process.exit(1);
}

function isBackground(r, g, b) {
  if (mode === "black") return r < 40 && g < 40 && b < 40;
  // Xadrez: cinzas neutros (claros ~200 e escuros ~135) e branco. O creme (#F8FAEC) tem o azul
  // ~15 abaixo do vermelho, logo não é neutro e bloqueia o preenchimento.
  const neutral = Math.abs(r - g) <= 7 && Math.abs(g - b) <= 7 && Math.abs(r - b) <= 7;
  return neutral && r >= 120;
}

(async () => {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const visited = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = y * w + x;
    if (visited[i]) return;
    const o = i * 4;
    if (!isBackground(data[o], data[o + 1], data[o + 2])) return;
    visited[i] = 1;
    stack.push(i);
  };
  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }
  let cleared = 0;
  while (stack.length) {
    const i = stack.pop();
    const x = i % w;
    const y = (i / w) | 0;
    data[i * 4 + 3] = 0;
    cleared++;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }
  // Suaviza a borda: vizinhos opacos de pixels limpos ficam semitransparentes.
  const out = Buffer.from(data);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (visited[i]) continue;
      const n = visited[i - 1] + visited[i + 1] + visited[i - w] + visited[i + w];
      if (n > 0) {
        const o = i * 4;
        out[o + 3] = isBackground(data[o], data[o + 1], data[o + 2])
          ? 0
          : Math.round(255 * (1 - n / 8));
      }
    }
  }
  const result = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .webp({ quality: 90, alphaQuality: 100, effort: 5 })
    .toFile(output);
  const pct = ((cleared / (w * h)) * 100).toFixed(1);
  console.log(
    `${path.basename(input)} -> ${path.basename(output)}: ${w}x${h}, ${pct}% de fundo removido, ${(result.size / 1024).toFixed(0)} KB`,
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
