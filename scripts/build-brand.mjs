/**
 * Builds the logo mark and every icon from public/logo.svg.
 *
 *   npm run brand
 *
 * The source logo stacks the "<F>." mark over the "Fuad" wordmark. Icons and
 * the navbar use only the mark: the wordmark is unreadable at favicon sizes and
 * the name is already set in type next to the mark.
 *
 * Outputs:
 *   public/brand/mark.png        – mark in its original colours (light theme)
 *   public/brand/mark-dark.png   – same mark with a light "F" (dark theme)
 *   public/brand/icon-*.png      – PWA manifest icons
 *   app/favicon.ico, app/icon.png, app/apple-icon.png – picked up by Next.js
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "public", "logo.svg");
const OUT = path.join(ROOT, "public", "brand");
const APP = path.join(ROOT, "app");

// Measured on the SVG rendered at 2000px: the mark, and the column band of the "F".
const RENDER = 2000;
const MARK = { left: 379, top: 523, width: 1619 - 379 + 1, height: 1173 - 523 + 1 };
const F_COLUMNS = [819, 1208];
const TILE = "#ffffff";
const LIGHT_F = [243, 243, 246]; // --foreground in the dark theme

async function renderMark() {
  const { data, info } = await sharp(SRC, { density: (72 * RENDER) / 500 })
    .ensureAlpha()
    .extract(MARK)
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, info };
}

function toPng({ data, info }) {
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

/** Recolours the near-black "F" so the mark reads on dark backgrounds; the chevrons keep their colour. */
function lightenF({ data, info }) {
  const out = Buffer.from(data);
  const [x0, x1] = [F_COLUMNS[0] - MARK.left, F_COLUMNS[1] - MARK.left];
  for (let y = 0; y < info.height; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * info.width + x) * 4;
      if (out[i + 3] === 0) continue;
      const [r, g, b] = [out[i], out[i + 1], out[i + 2]];
      if (Math.max(r, g, b) < 140 && Math.max(r, g, b) - Math.min(r, g, b) < 40) {
        [out[i], out[i + 1], out[i + 2]] = LIGHT_F;
      }
    }
  }
  return { data: out, info };
}

/** Square icon: the mark centred on a white tile. `radius` is a fraction of the size (0 = square). */
async function icon(mark, size, { scale, radius = 0 }) {
  const markPng = await sharp(mark).resize({ width: Math.round(size * scale) }).png().toBuffer();
  const meta = await sharp(markPng).metadata();
  const r = Math.round(size * radius);
  const tile = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" rx="${r}" fill="${TILE}"/></svg>`,
  );
  return sharp(tile)
    .composite([{ input: markPng, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) }])
    .png()
    .toBuffer();
}

/** Multi-size .ico with PNG-encoded entries (supported by every current browser). */
function ico(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, png }, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt16LE(1, e + 4); // colour planes
    header.writeUInt16LE(32, e + 6); // bits per pixel
    header.writeUInt32LE(png.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...images.map((i) => i.png)]);
}

/* ------------------------------------------------------------------ */

await fs.mkdir(OUT, { recursive: true });
const raw = await renderMark();
const mark = await toPng(raw);

// Navbar / footer marks at 4x their 28px display height.
const navHeight = 112;
await sharp(mark).resize({ height: navHeight }).png().toFile(path.join(OUT, "mark.png"));
await sharp(await toPng(lightenF(raw))).resize({ height: navHeight }).png().toFile(path.join(OUT, "mark-dark.png"));
console.log("✓ marks");

// Favicons: a rounded tile so the mark stays visible on light and dark browser tabs.
const fav = await Promise.all([16, 32, 48].map(async (size) => ({ size, png: await icon(mark, size, { scale: 0.9, radius: 0.22 }) })));
await fs.writeFile(path.join(APP, "favicon.ico"), ico(fav));
await fs.writeFile(path.join(APP, "icon.png"), await icon(mark, 512, { scale: 0.8, radius: 0.22 }));
// iOS rounds the corners itself and fills transparency with black, so this one is a full square.
await fs.writeFile(path.join(APP, "apple-icon.png"), await icon(mark, 180, { scale: 0.72 }));
console.log("✓ favicon.ico, icon.png, apple-icon.png");

for (const size of [192, 512]) {
  await fs.writeFile(path.join(OUT, `icon-${size}.png`), await icon(mark, size, { scale: 0.8, radius: 0.22 }));
}
// Maskable icons are cropped to a circle; keep the mark inside the 80% safe zone.
await fs.writeFile(path.join(OUT, "icon-maskable-512.png"), await icon(mark, 512, { scale: 0.62 }));
console.log("✓ manifest icons");
