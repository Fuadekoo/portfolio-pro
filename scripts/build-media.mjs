/**
 * Turns raw screenshots in data/ into optimized web assets.
 *
 *   npm run media
 *
 * - Crops browser chrome / OS taskbars from desktop captures
 * - Frames mobile screenshots in a phone bezel (transparent WebP)
 * - Composes a 16:10 cover for mobile projects
 * - Crops the portrait
 * - Writes content/media.generated.ts (sizes + blur placeholders)
 *
 * To add screenshots: drop them in data/projectsImage/<folder>/, list them
 * below, and run the script again.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "data", "projectsImage");
const OUT = path.join(ROOT, "public", "projects");
const MANIFEST = path.join(ROOT, "content", "media.generated.ts");

// Browser chrome + taskbar sizes measured on the source captures.
const CHROME_1280 = { top: 68, bottom: 40 };
const CHROME_1920 = { top: 176, bottom: 72 };

/**
 * Screens deliberately NOT published because they show personal data:
 *   melaschools/m3.png        – student ID cards with children's photos and names
 *   mindcare/md10–16, 18–20   – named students with case notes, diagnoses, phone numbers
 *   lms/lm5.jpg               – user profile with a phone number
 */
const projects = {
  "darulkubra-lms": {
    dir: "lms",
    device: "desktop",
    images: [
      ["lm6.jpg", "Video lesson player with course outline and progress"],
      ["lm3.jpg", "Lesson view with section navigation and final exam"],
      ["16.jpg", "Course Q&A tab in dark mode", CHROME_1280],
      ["lm4.jpg", "Student dashboard with enrolled courses and catalogue", { top: 36 }],
      ["14.jpg", "Course management table for administrators", CHROME_1280],
      ["13.jpg", "Create-course flow with media upload", CHROME_1280],
    ],
  },
  melaschools: {
    dir: "melaschools",
    device: "desktop",
    images: [
      ["m2.png", "School admin dashboard with KPIs and AI insights"],
      ["m1.png", "Sign-in screen for the school management system"],
    ],
  },
  mindcare: {
    dir: "mindcare",
    device: "desktop",
    images: [
      ["md7.png", "Dashboard with case summary chart and appointment status", CHROME_1920],
      ["md3.png", "Landing page introducing the wellbeing platform", CHROME_1920],
      ["md5.png", "Feature overview: case management, scheduling, outcome tracking", CHROME_1920],
      ["md6.png", "How-it-works section of the landing page", CHROME_1920],
      ["md9.png", "Patient types and today's appointments", CHROME_1920],
      ["md17.png", "Staff to-do list", CHROME_1920],
      ["md1.png", "Phone-number sign-in screen", CHROME_1920],
    ],
  },
  "prime-card": {
    dir: "primecard",
    device: "mobile",
    // Source images are already phone mockups on a flat background.
    mockup: true,
    cover: ["c0.png", "c3.png", "c4.png"],
    images: [
      ["card1.png", "Scanning a Prime card QR code with a phone", { photo: true }],
      ["c0.png", "Digital card landing page with social links"],
      ["c3.png", "Admin dashboard with cards, scans and users"],
      ["c4.png", "Scan analytics chart and guest tracking"],
      ["c5.png", "Scan log with distance from location"],
      ["c1.png", "Location permission prompt"],
      ["c2.png", "Admin sign-in"],
    ],
  },
  "prime-rentals": {
    dir: "primerental",
    device: "desktop",
    images: [["image.png", "Property search home page with rent and sale listings"]],
  },
  "terbia-learning": {
    dir: "terbialearning",
    device: "mobile",
    cover: ["1.png", "4.png", "3.png"],
    images: [
      ["1.png", "Course list with progress and continue buttons"],
      ["4.png", "Lesson player with section outline"],
      ["3.png", "Learner dashboard with progress stats"],
      ["2.png", "Course home screen"],
    ],
  },
};

const PORTRAIT = {
  src: path.join(ROOT, "data", "fufu.jpg"),
  // 4:5 crop centred on the face (source is 6960x3904).
  crop: { left: 2018, top: 0, width: 3122, height: 3904 },
  alt: "Portrait of Fuad",
};

/* ------------------------------------------------------------------ */

async function blur(input) {
  const buf = await sharp(input).resize(16).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function save(buffer, rel, { maxWidth = 1600, quality = 80 } = {}) {
  const file = path.join(OUT, rel);
  await fs.mkdir(path.dirname(file), { recursive: true });
  const { data, info } = await sharp(buffer)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, alphaQuality: 90 })
    .toBuffer({ resolveWithObject: true });
  await fs.writeFile(file, data);
  return { src: `/projects/${rel.replaceAll("\\", "/")}`, width: info.width, height: info.height, blurDataURL: await blur(data) };
}

async function cropChrome(file, { top = 0, bottom = 0 } = {}) {
  const meta = await sharp(file).metadata();
  return sharp(file)
    .extract({ left: 0, top, width: meta.width, height: meta.height - top - bottom })
    .toBuffer();
}

function roundedMask(w, h, r) {
  return Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" ry="${r}"/></svg>`);
}

/** Wraps a raw phone screenshot in a dark bezel with rounded corners (transparent PNG). */
async function phoneFrame(file, height = 1200) {
  const screen = sharp(file).resize({ height });
  const { width } = await screen.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  const r = Math.round(width * 0.11);
  const pad = Math.round(width * 0.035);
  const rounded = await screen
    .composite([{ input: roundedMask(width, height, r), blend: "dest-in" }])
    .png()
    .toBuffer();
  const W = width + pad * 2;
  const H = height + pad * 2;
  const bezel = Buffer.from(
    `<svg width="${W}" height="${H}"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${r + pad}" fill="#0b0b10" stroke="#3a3a48" stroke-width="2"/></svg>`,
  );
  return sharp(bezel).composite([{ input: rounded, left: pad, top: pad }]).png().toBuffer();
}

/** Trims the flat background around an existing mockup and rounds its corners. */
async function trimMockup(file) {
  const trimmed = await sharp(file).trim({ threshold: 28 }).png().toBuffer({ resolveWithObject: true });
  const { width, height } = trimmed.info;
  return sharp(trimmed.data)
    .composite([{ input: roundedMask(width, height, Math.round(width * 0.14)), blend: "dest-in" }])
    .png()
    .toBuffer();
}

/** 16:10 cover with three phones fanned over a soft gradient. */
async function phoneCover(phones, hue) {
  const W = 1600;
  const H = 1000;
  const bg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="a" cx="25%" cy="0%" r="80%"><stop offset="0" stop-color="hsl(${hue},85%,58%)" stop-opacity=".45"/><stop offset="1" stop-color="#0b0b12" stop-opacity="0"/></radialGradient>
      <radialGradient id="b" cx="100%" cy="100%" r="70%"><stop offset="0" stop-color="hsl(${hue + 40},85%,60%)" stop-opacity=".28"/><stop offset="1" stop-color="#0b0b12" stop-opacity="0"/></radialGradient>
      <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#fff" stroke-opacity=".05"/></pattern>
    </defs>
    <rect width="100%" height="100%" fill="#0b0b12"/><rect width="100%" height="100%" fill="url(#g)"/>
    <rect width="100%" height="100%" fill="url(#a)"/><rect width="100%" height="100%" fill="url(#b)"/>
  </svg>`);

  const layout = [
    { h: 760, x: 0.24, y: 150 },
    { h: 860, x: 0.5, y: 90 },
    { h: 760, x: 0.76, y: 150 },
  ];
  const layers = [];
  for (const [i, phone] of phones.entries()) {
    const { h, x, y } = layout[[0, 2, 1][i] ?? i] ?? layout[1];
    const img = await sharp(phone).resize({ height: h }).png().toBuffer({ resolveWithObject: true });
    const left = Math.round(W * x - img.info.width / 2);
    const shadow = await sharp({
      create: { width: img.info.width + 80, height: img.info.height + 80, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([{ input: Buffer.from(`<svg width="${img.info.width + 80}" height="${img.info.height + 80}"><rect x="40" y="56" width="${img.info.width}" height="${img.info.height}" rx="60" fill="#000" fill-opacity=".6"/></svg>`) }])
      .blur(28)
      .png()
      .toBuffer();
    layers.push({ order: i === 1 ? 2 : 1, items: [{ input: shadow, left: left - 40, top: y - 40 }, { input: img.data, left, top: y }] });
  }
  layers.sort((a, b) => a.order - b.order);
  // Phones extend past the bottom edge, so render tall and crop.
  const canvas = await sharp(bg).resize(W, H + 200, { fit: "cover" }).png().toBuffer();
  return sharp(canvas)
    .composite(layers.flatMap((l) => l.items))
    .extract({ left: 0, top: 0, width: W, height: H })
    .png()
    .toBuffer();
}

/* ------------------------------------------------------------------ */

const hues = { "prime-card": 150, "terbia-learning": 210 };
const manifest = {};

await fs.rm(OUT, { recursive: true, force: true });

for (const [slug, cfg] of Object.entries(projects)) {
  const gallery = [];
  for (const [i, [file, alt, opts = {}]] of cfg.images.entries()) {
    const srcFile = path.join(SRC, cfg.dir, file);
    const name = `${slug}/${String(i + 1).padStart(2, "0")}.webp`;
    let buffer;
    let device = cfg.device;
    if (opts.photo) {
      buffer = await sharp(srcFile).toBuffer();
      device = "desktop";
    } else if (cfg.device === "mobile") {
      buffer = cfg.mockup ? await trimMockup(srcFile) : await phoneFrame(srcFile);
    } else {
      buffer = await cropChrome(srcFile, opts);
    }
    gallery.push({ ...(await save(buffer, name, { maxWidth: cfg.device === "mobile" && !opts.photo ? 720 : 1600 })), alt, device });
  }

  let cover = gallery[0];
  if (cfg.cover) {
    const phones = await Promise.all(
      cfg.cover.map((f) => (cfg.mockup ? trimMockup(path.join(SRC, cfg.dir, f)) : phoneFrame(path.join(SRC, cfg.dir, f)))),
    );
    cover = { ...(await save(await phoneCover(phones, hues[slug] ?? 220), `${slug}/cover.webp`)), alt: `${cfg.images[0][1]}`, device: "desktop", composed: true };
  }
  manifest[slug] = { cover, gallery };
  console.log(`✓ ${slug}: ${gallery.length} images`);
}

// Portrait
const portraitBuf = await sharp(PORTRAIT.src).rotate().extract(PORTRAIT.crop).toBuffer();
const portrait = { ...(await save(portraitBuf, "../me/portrait.webp", { maxWidth: 960, quality: 82 })), alt: PORTRAIT.alt };
portrait.src = "/me/portrait.webp";
// JPEG copy for the Open Graph image (ImageResponse doesn't decode WebP).
await sharp(portraitBuf).resize(480).jpeg({ quality: 80 }).toFile(path.join(ROOT, "public", "me", "portrait-og.jpg"));
console.log("✓ portrait");

// Background-removed portrait for the hero. data/fufu-cutout.png was produced once with
// @imgly/background-removal-node (model: "medium") from the same photo.
// The model leaves a faint 1-10% alpha haze over the removed background (invisible on dark,
// a grey box on light). Remap alpha so that haze becomes fully transparent.
const { data: px, info: pxInfo } = await sharp(path.join(ROOT, "data", "fufu-cutout.png"))
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
for (let i = 3; i < px.length; i += 4) px[i] = Math.max(0, Math.min(255, Math.round(px[i] * 1.12 - 28)));
const cutoutBuf = await sharp(px, { raw: { width: pxInfo.width, height: pxInfo.height, channels: 4 } })
  .trim({ threshold: 0 })
  .png()
  .toBuffer();
const cutout = { ...(await save(cutoutBuf, "../me/portrait-cutout.webp", { maxWidth: 900, quality: 86 })), alt: PORTRAIT.alt };
cutout.src = "/me/portrait-cutout.webp";
console.log("✓ portrait cutout");

const ts = `// Generated by scripts/build-media.mjs. Do not edit by hand; run \`npm run media\`.

export type MediaImage = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  alt: string;
  device?: "desktop" | "mobile";
  /** A generated multi-device composition rather than a single screenshot. */
  composed?: boolean;
};

export type ProjectMedia = { cover: MediaImage; gallery: MediaImage[] };

export const projectMedia = ${JSON.stringify(manifest, null, 2)} satisfies Record<string, ProjectMedia>;

export const portrait: MediaImage = ${JSON.stringify(portrait, null, 2)};

/** Same portrait with the background removed (transparent). */
export const portraitCutout: MediaImage = ${JSON.stringify(cutout, null, 2)};
`;
await fs.writeFile(MANIFEST, ts);

// Next.js caches optimized images by URL, not content; drop the cache so updated files show up.
await fs.rm(path.join(ROOT, ".next", "cache", "images"), { recursive: true, force: true });
console.log(`✓ wrote ${path.relative(ROOT, MANIFEST)}`);
