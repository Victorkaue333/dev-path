/* eslint-disable */
/**
 * Recorta cada adesivo de uma "folha de adesivos" (vários objetos numa única imagem) em arquivos
 * WebP individuais com fundo transparente, prontos para `next/image`.
 *
 * Como funciona:
 *  1. Fundo (--fundo): `alfa` (folha já transparente: fundo = alfa < --alfa-min), `bege` (gradiente
 *     cinza/bege claro, caso da folha de objetos retrô opaca) ou `verde` (mural verde-escuro do
 *     DevPath: fundo = escuro com verde dominante; interiores pretos/neutros de adesivos NÃO contam
 *     como fundo). `auto` escolhe alfa quando > 5% dos pixels são transparentes, senão verde.
 *  2. Dilata a máscara de "não fundo" por --raio px para unir halo e desenho; depois erode por
 *     --erosao px para quebrar pontes finas entre vizinhos (fitas) e apagar rabiscos; os rótulos
 *     crescem de volta dentro da máscara dilatada.
 *  3. Componentes conexos; descarta os pequenos (rabiscos, fitas soltas) pelo --min-area; ordena
 *     por linha e coluna (ordem de leitura) e nomeia pelos --nomes ou --nomes-arquivo (uma linha por
 *     componente; a linha `-` pula o componente, útil quando a detecção fundiu vizinhos).
 *  4. Em cada recorte, torna transparente tudo que não pertence ao componente (fundo, vizinhos,
 *     pontes, rabiscos) e suaviza 1 px de borda.
 *  5. Modo manual: --caixas="x,y,w,h[,erosao];..." recorta caixas dadas (sem detecção global).
 *     Dentro de cada caixa roda o mesmo pipeline (dilata, erode com a erosão da caixa, rotula) e
 *     mantém só o componente que contém o centro da caixa (ou o maior). Use para vizinhos
 *     encostados que a detecção global fundiu; aumente a erosão da caixa para separá-los.
 *  6. --grade-apenas: não recorta; só monta a grade de conferência com os .webp do diretório.
 *
 * Uso:
 *   pnpm assets:recortar-folha <folha.png> <dir-saida> [--fundo=auto|alfa|bege|verde]
 *        [--min-area=8000] [--pad=14] [--raio=1] [--erosao=8] [--alfa-min=96]
 *        [--nomes=a,b,c,...] [--nomes-arquivo=nomes.txt] [--esperados=12] [--debug=<dir>]
 *        [--caixas="x,y,w,h[,e];..."] [--prefixo=<nome>] [--grade-apenas]
 *
 * Com --debug grava `<prefixo>-deteccao.png` (folha com caixas numeradas) e `<prefixo>-recortes.png`
 * (grade dos recortes sobre verde). Confira visualmente antes de usar e registre os arquivos em
 * docs/assets/README.md como "Derivado".
 */
const path = require("node:path");
const fs = require("node:fs");
const sharp = require("sharp");

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith("--"));
const flags = Object.fromEntries(
  args
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const [k, ...rest] = a.slice(2).split("=");
      return [k, rest.length ? rest.join("=") : "true"];
    }),
);

const [input, outDir] = positional;
if (!input || !outDir) {
  console.error(
    "Uso: node scripts/recortar-folha-stickers.cjs <folha.png> <dir-saida> [--fundo=auto|alfa|bege|verde] [--min-area=N] [--pad=N] [--raio=N] [--erosao=N] [--alfa-min=N] [--nomes=a,b,...] [--nomes-arquivo=f] [--esperados=N] [--debug=<dir>] [--caixas=x,y,w,h[,e];...] [--prefixo=p] [--grade-apenas]",
  );
  process.exit(1);
}
const MIN_AREA = Number(flags["min-area"] ?? 8000);
const PAD = Number(flags.pad ?? 14);
const RADIUS = Number(flags.raio ?? 1);
const EROSION = Number(flags.erosao ?? 8);
const ALPHA_MIN = Number(flags["alfa-min"] ?? 96);
const FUNDO = flags.fundo ?? "auto";
const GRID_ONLY = flags["grade-apenas"] === "true";
let NAMES = flags.nomes ? flags.nomes.split(",").map((s) => s.trim()).filter(Boolean) : [];
if (flags["nomes-arquivo"]) {
  NAMES = fs
    .readFileSync(flags["nomes-arquivo"], "utf8")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith("#"));
}
const EXPECTED = flags.esperados ? Number(flags.esperados) : NAMES.length || null;
const DEBUG_DIR = flags.debug && flags.debug !== "true" ? flags.debug : null;
const BOXES = flags.caixas
  ? flags.caixas
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const [x, y, w, h, e] = s.split(",").map(Number);
        return { x, y, w, h, erosion: Number.isFinite(e) ? e : EROSION };
      })
  : null;
const prefix = flags.prefixo ?? path.basename(input).replace(/\.[^.]+$/, "");

let mode = FUNDO;

/** Matiz em graus (0–360) a partir de RGB. */
function hue(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const c = max - min;
  if (c === 0) return 0;
  let h;
  if (max === r) h = ((g - b) / c) % 6;
  else if (max === g) h = (b - r) / c + 2;
  else h = (r - g) / c + 4;
  h *= 60;
  return h < 0 ? h + 360 : h;
}

function isBackground(r, g, b, a) {
  if (mode === "alfa") return a < ALPHA_MIN;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  if (mode === "verde") {
    // Mural verde-escuro: escuro e com verde dominante. Preto/cinza neutro (interior de terminais,
    // círculos pretos) fica de fora porque g - r é pequeno.
    if (max > 100) return false;
    return g - r >= 12 && g - b >= 4;
  }
  // bege: gradiente cinza/cáqui claro
  if (max > 218) return false; // halo creme / branco
  if (max < 45) return false; // tinta / contornos
  if (chroma <= 28) return true; // cinzas e beges dessaturados
  const h = hue(r, g, b);
  return h >= 18 && h <= 62; // amarelo-marrom do gradiente
}

/** Dilatação (erode=false) ou erosão (erode=true) com janela quadrada de raio r, separável. */
function morph(mask, W, H, r, erode) {
  if (r <= 0) return mask;
  const tmp = new Uint8Array(mask.length);
  const out = new Uint8Array(mask.length);
  for (let y = 0; y < H; y++) {
    const row = y * W;
    for (let x = 0; x < W; x++) {
      let v = erode ? 1 : 0;
      for (let dx = -r; dx <= r; dx++) {
        const xx = x + dx;
        const m = xx < 0 || xx >= W ? (erode ? 1 : 0) : mask[row + xx];
        if (erode ? !m : m) {
          v = erode ? 0 : 1;
          break;
        }
      }
      tmp[row + x] = v;
    }
  }
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      let v = erode ? 1 : 0;
      for (let dy = -r; dy <= r; dy++) {
        const yy = y + dy;
        const m = yy < 0 || yy >= H ? (erode ? 1 : 0) : tmp[yy * W + x];
        if (erode ? !m : m) {
          v = erode ? 0 : 1;
          break;
        }
      }
      out[y * W + x] = v;
    }
  }
  return out;
}

/** Componentes conexos (4-viz.) de uma máscara; devolve rótulos (0 = nada) e contagem. */
function labelComponents(mask, W, H) {
  const label = new Int32Array(W * H);
  const stack = new Int32Array(W * H);
  let next = 1;
  for (let s = 0; s < W * H; s++) {
    if (!mask[s] || label[s]) continue;
    const id = next++;
    let sp = 0;
    stack[sp++] = s;
    label[s] = id;
    while (sp) {
      const i = stack[--sp];
      const x = i % W;
      const nb = [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i - W, i + W];
      for (const j of nb) {
        if (j < 0 || j >= W * H || !mask[j] || label[j]) continue;
        label[j] = id;
        stack[sp++] = j;
      }
    }
  }
  return { label, count: next - 1 };
}

/**
 * Preenche "buracos" da máscara de fundo (regiões de fundo que não tocam a borda da folha) quando
 * forem pequenos ou menos verdes que o mural: interiores escuros de janelas de terminal com leve
 * tom verde seriam classificados como fundo e virariam furos. Fundo verde cercado por laços
 * (média de g-r alta) continua fundo.
 */
function fillHoles(fg, bg, data, W, H) {
  const { label, count } = labelComponents(bg, W, H);
  const touches = new Uint8Array(count + 1);
  const area = new Int32Array(count + 1);
  const sumGR = new Float64Array(count + 1);
  for (let i = 0; i < W * H; i++) {
    const id = label[i];
    if (!id) continue;
    area[id]++;
    sumGR[id] += data[i * 4 + 1] - data[i * 4];
    const x = i % W;
    const y = (i / W) | 0;
    if (x === 0 || y === 0 || x === W - 1 || y === H - 1) touches[id] = 1;
  }
  let filled = 0;
  for (let i = 0; i < W * H; i++) {
    const id = label[i];
    if (!id || touches[id]) continue;
    if (area[id] < 64 || sumGR[id] / area[id] < 22) {
      fg[i] = 1;
      bg[i] = 0;
      filled++;
    }
  }
  return filled;
}

/** Pipeline dilata → erode → rotula → cresce de volta. Devolve rótulos sobre a máscara dilatada. */
function segment(fg, W, H, radius, erosion) {
  const fgD = morph(fg, W, H, radius, false);
  const seed = erosion > 0 ? morph(fgD, W, H, erosion, true) : fgD;
  const { label, count } = labelComponents(seed, W, H);
  if (erosion > 0) {
    const N = W * H;
    for (let iter = 0; iter < erosion + 1; iter++) {
      const next = Int32Array.from(label);
      let changed = 0;
      for (let i = 0; i < N; i++) {
        if (!fgD[i] || label[i]) continue;
        const x = i % W;
        const cands = [x > 0 ? label[i - 1] : 0, x < W - 1 ? label[i + 1] : 0, i >= W ? label[i - W] : 0, i + W < N ? label[i + W] : 0];
        const l = cands.find((v) => v > 0);
        if (l) {
          next[i] = l;
          changed++;
        }
      }
      label.set(next);
      if (!changed) break;
    }
  }
  return { label, count };
}

function stats(label, W, H) {
  const map = new Map();
  for (let i = 0; i < W * H; i++) {
    const id = label[i];
    if (!id) continue;
    const x = i % W;
    const y = (i / W) | 0;
    let c = map.get(id);
    if (!c) {
      c = { id, area: 0, minX: x, minY: y, maxX: x, maxY: y };
      map.set(id, c);
    }
    c.area++;
    if (x < c.minX) c.minX = x;
    if (x > c.maxX) c.maxX = x;
    if (y < c.minY) c.minY = y;
    if (y > c.maxY) c.maxY = y;
  }
  return [...map.values()];
}

/** Flood fill a partir da borda sobre `passable`; marca `cleared`. */
function clearFromBorder(passable, w, h) {
  const cleared = new Uint8Array(w * h);
  const st = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const d = y * w + x;
    if (cleared[d] || !passable[d]) return;
    cleared[d] = 1;
    st.push(d);
  };
  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }
  while (st.length) {
    const d = st.pop();
    const x = d % w;
    const y = (d / w) | 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }
  return cleared;
}

/** Suaviza 1 px de borda e exporta WebP. */
async function exportCrop(out, cleared, w, h, file) {
  for (let d = 0; d < w * h; d++) if (cleared[d]) out[d * 4 + 3] = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const d = y * w + x;
      if (cleared[d]) continue;
      const n = cleared[d - 1] + cleared[d + 1] + cleared[d - w] + cleared[d + w];
      if (n > 0) out[d * 4 + 3] = Math.min(out[d * 4 + 3], Math.round(255 * (1 - n / 6)));
    }
  }
  return sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .webp({ quality: 90, alphaQuality: 100, effort: 5 })
    .toFile(file);
}

/** Copia um retângulo da folha para um buffer RGBA. */
function cropRaw(data, W, x0, y0, w, h) {
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const src = ((y0 + y) * W + x0) * 4;
    out.set(data.subarray(src, src + w * 4), y * w * 4);
  }
  return out;
}

async function writeGrid(files, dir, name) {
  const cols = files.length > 24 ? 8 : 4;
  const cell = files.length > 24 ? 200 : 360;
  const tiles = [];
  for (let i = 0; i < files.length; i++) {
    const buf = await sharp(files[i])
      .resize({ width: cell - 16, height: cell - 44, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    const fontSize = cols === 8 ? 12 : 20;
    const text = `${i + 1}. ${path.basename(files[i], ".webp")}`.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    const labelSvg = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${cell}" height="30"><text x="6" y="20" font-family="Arial" font-size="${fontSize}" fill="#F8FAEC">${text}</text></svg>`,
    );
    tiles.push({ input: buf, left: (i % cols) * cell + 8, top: Math.floor(i / cols) * cell + 8 });
    tiles.push({ input: labelSvg, left: (i % cols) * cell, top: Math.floor(i / cols) * cell + cell - 30 });
  }
  const rowsN = Math.max(1, Math.ceil(files.length / cols));
  const file = path.join(dir, name);
  await sharp({ create: { width: cols * cell, height: rowsN * cell, channels: 4, background: "#0d2b20" } })
    .composite(tiles)
    .png()
    .toFile(file);
  console.log(`Grade dos recortes (${files.length}): ${file}`);
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  if (DEBUG_DIR) fs.mkdirSync(DEBUG_DIR, { recursive: true });

  if (GRID_ONLY) {
    const files = fs
      .readdirSync(outDir)
      .filter((f) => f.endsWith(".webp"))
      .sort()
      .map((f) => path.join(outDir, f));
    await writeGrid(files, DEBUG_DIR ?? outDir, `${prefix}-recortes.png`);
    return;
  }

  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const N = W * H;

  if (mode === "auto") {
    let lowAlpha = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] < ALPHA_MIN) lowAlpha++;
    mode = lowAlpha / N > 0.05 ? "alfa" : "verde";
  }

  const bg = new Uint8Array(N);
  const fg = new Uint8Array(N);
  let bgCount = 0;
  for (let i = 0; i < N; i++) {
    const o = i * 4;
    if (isBackground(data[o], data[o + 1], data[o + 2], data[o + 3])) {
      bg[i] = 1;
      bgCount++;
    } else fg[i] = 1;
  }
  if (mode === "verde") {
    const filled = fillHoles(fg, bg, data, W, H);
    console.log("Buracos preenchidos (interiores escuros de adesivos): " + filled + " px");
  }
  console.log(
    `Folha ${W}x${H}; fundo=${mode}; fundo: ${((100 * bgCount) / N).toFixed(1)}%; raio=${RADIUS} erosao=${EROSION} min-area=${MIN_AREA} pad=${PAD}`,
  );

  const results = [];

  if (BOXES) {
    // ---------- modo manual ----------
    console.log(`Modo manual: ${BOXES.length} caixas.`);
    for (let k = 0; k < BOXES.length; k++) {
      const bx = BOXES[k];
      const name = NAMES[k] ?? `caixa-${String(k + 1).padStart(2, "0")}`;
      if (name === "-") continue;
      const x0 = Math.max(0, bx.x);
      const y0 = Math.max(0, bx.y);
      const x1 = Math.min(W - 1, bx.x + bx.w - 1);
      const y1 = Math.min(H - 1, bx.y + bx.h - 1);
      const w = x1 - x0 + 1;
      const h = y1 - y0 + 1;
      const out = cropRaw(data, W, x0, y0, w, h);
      const fgL = new Uint8Array(w * h);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) fgL[y * w + x] = fg[(y0 + y) * W + (x0 + x)];
      const { label } = segment(fgL, w, h, RADIUS, bx.erosion);
      const comps = stats(label, w, h);
      if (!comps.length) {
        console.warn(`  ${name}: nenhum componente na caixa; pulado.`);
        continue;
      }
      const cx = w >> 1;
      const cy = h >> 1;
      const center = label[cy * w + cx];
      const chosen = center ? comps.find((c) => c.id === center) : comps.sort((a, b) => b.area - a.area)[0];
      const cleared = new Uint8Array(w * h);
      for (let d = 0; d < w * h; d++) if (label[d] !== chosen.id) cleared[d] = 1;
      const file = path.join(outDir, `${name}.webp`);
      const res = await exportCrop(out, cleared, w, h, file);
      results.push(file);
      console.log(
        `  ${name}.webp  ${w}x${h}  ${(res.size / 1024).toFixed(0)} KB  (caixa ${x0},${y0},${w},${h} erosao=${bx.erosion}; ${comps.length} comp., mantido ${center ? "o do centro" : "o maior"})`,
      );
    }
  } else {
    // ---------- modo automático ----------
    const { label, count } = segment(fg, W, H, RADIUS, EROSION);
    const comps = stats(label, W, H);
    const kept = comps.filter((c) => c.area >= MIN_AREA);

    const heights = kept.map((c) => c.maxY - c.minY + 1).sort((a, b) => a - b);
    const medH = heights[heights.length >> 1] ?? 1;
    const tol = medH * 0.45;
    const sorted = [...kept].sort((a, b) => (a.minY + a.maxY) / 2 - (b.minY + b.maxY) / 2);
    const rows = [];
    for (const c of sorted) {
      const cy = (c.minY + c.maxY) / 2;
      const row = rows.find((r) => Math.abs(r.cy - cy) <= tol);
      if (row) {
        row.items.push(c);
        row.cy = row.items.reduce((s, i) => s + (i.minY + i.maxY) / 2, 0) / row.items.length;
      } else rows.push({ cy, items: [c] });
    }
    rows.sort((a, b) => a.cy - b.cy);
    const ordered = rows.flatMap((r) => r.items.sort((a, b) => a.minX - b.minX));

    console.log(
      `Componentes: ${count} (descartados < ${MIN_AREA} px: ${comps.length - kept.length}); mantidos: ${ordered.length}; linhas: ${rows.map((r) => r.items.length).join("+")}`,
    );
    ordered.forEach((c, i) =>
      console.log(`  #${i + 1}: x=${c.minX} y=${c.minY} w=${c.maxX - c.minX + 1} h=${c.maxY - c.minY + 1} area=${c.area}`),
    );

    if (DEBUG_DIR) {
      const boxes = ordered
        .map(
          (c, i) =>
            `<rect x="${c.minX}" y="${c.minY}" width="${c.maxX - c.minX + 1}" height="${c.maxY - c.minY + 1}" fill="none" stroke="#22C55E" stroke-width="3"/>` +
            `<rect x="${c.minX}" y="${c.minY}" width="40" height="26" fill="#0F172A"/>` +
            `<text x="${c.minX + 5}" y="${c.minY + 20}" font-family="Arial" font-size="20" font-weight="bold" fill="#FBBF24">${i + 1}</text>`,
        )
        .join("");
      const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${boxes}</svg>`);
      await sharp(input)
        .flatten({ background: "#0d2b20" })
        .composite([{ input: svg }])
        .png()
        .toFile(path.join(DEBUG_DIR, `${prefix}-deteccao.png`));
      console.log(`Folha de contato da detecção: ${path.join(DEBUG_DIR, `${prefix}-deteccao.png`)}`);
    }

    if (EXPECTED && ordered.length !== EXPECTED) {
      console.error(
        `Esperava ${EXPECTED} objetos e detectei ${ordered.length}. Ajuste --min-area, --raio ou --erosao, confira a folha de contato ou use --caixas.`,
      );
      process.exit(2);
    }

    for (let k = 0; k < ordered.length; k++) {
      const c = ordered[k];
      const name = NAMES[k] ?? `objeto-${String(k + 1).padStart(2, "0")}`;
      if (name === "-") continue;
      const x0 = Math.max(0, c.minX - PAD);
      const y0 = Math.max(0, c.minY - PAD);
      const x1 = Math.min(W - 1, c.maxX + PAD);
      const y1 = Math.min(H - 1, c.maxY + PAD);
      const w = x1 - x0 + 1;
      const h = y1 - y0 + 1;
      const out = cropRaw(data, W, x0, y0, w, h);
      const cleared = new Uint8Array(w * h);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (label[(y0 + y) * W + (x0 + x)] !== c.id) cleared[y * w + x] = 1;
        }
      }
      const file = path.join(outDir, `${name}.webp`);
      const res = await exportCrop(out, cleared, w, h, file);
      results.push(file);
      console.log(`  ${name}.webp  ${w}x${h}  ${(res.size / 1024).toFixed(0)} KB`);
    }
  }

  if (DEBUG_DIR && results.length) await writeGrid(results, DEBUG_DIR, `${prefix}-recortes.png`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
