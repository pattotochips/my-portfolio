/**
 * Converts the overlay PNGs in public/assets to WebP and generates the
 * social-preview image. The source PNGs were 6.6 MB committed and shipped as-is;
 * they are overlay art drawn onto a canvas, so lossy WebP is fine.
 *
 * Run with: npm run assets:optimize
 */
import sharp from 'sharp';
import { readdir, stat, unlink } from 'node:fs/promises';
import { join, dirname, parse } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = join(root, 'public', 'assets');
const publicDir = join(root, 'public');

/** Nothing in this app draws an overlay wider than this on screen. */
const MAX_DIMENSION = 1080;
const WEBP_QUALITY = 82;

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

async function convertOverlays({ removeSource }) {
  const files = (await readdir(assetsDir)).filter((f) => f.endsWith('.png'));
  if (files.length === 0) {
    console.log('No PNGs left in public/assets — already converted.');
    return;
  }

  let before = 0;
  let after = 0;

  for (const file of files) {
    const source = join(assetsDir, file);
    const target = join(assetsDir, `${parse(file).name}.webp`);

    const { size: sourceSize } = await stat(source);
    await sharp(source)
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY, alphaQuality: 90, effort: 6 })
      .toFile(target);

    const { size: targetSize } = await stat(target);
    before += sourceSize;
    after += targetSize;

    const saved = (100 - (targetSize / sourceSize) * 100).toFixed(0);
    console.log(`${file.padEnd(22)} ${kb(sourceSize).padStart(8)} → ${kb(targetSize).padStart(8)}  (-${saved}%)`);

    if (removeSource) await unlink(source);
  }

  console.log(`\nOverlays: ${kb(before)} → ${kb(after)} (-${(100 - (after / before) * 100).toFixed(0)}%)`);
}

/**
 * 1200x630 social card. Built from an SVG so it stays in sync with the site
 * palette and needs no design tool.
 */
async function buildOgImage() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0e27"/>
      <stop offset="100%" stop-color="#1a1f3a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#667eea"/>
      <stop offset="100%" stop-color="#764ba2"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1080" cy="90" r="230" fill="#667eea" opacity="0.14"/>
  <circle cx="120" cy="560" r="200" fill="#00CEC9" opacity="0.10"/>
  <rect x="80" y="150" width="88" height="6" rx="3" fill="url(#accent)"/>
  <text x="80" y="252" font-family="Helvetica, Arial, sans-serif" font-size="72" font-weight="bold" fill="#ffffff">Prabhat Kumar Singh</text>
  <text x="80" y="322" font-family="Helvetica, Arial, sans-serif" font-size="38" font-weight="600" fill="#a5b4ff">Full-Stack Software Engineer</text>
  <text x="80" y="392" font-family="Helvetica, Arial, sans-serif" font-size="27" fill="#c9d1e8">8+ years · React · TypeScript · Node.js · Java · Spring Boot</text>
  <text x="80" y="500" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#8b95b5">Projects with written case studies — problem, approach, trade-offs</text>
  <text x="80" y="552" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="#667eea">github.com/pattotochips</text>
</svg>`;

  const target = join(publicDir, 'og-image.png');
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(target);
  const { size } = await stat(target);
  console.log(`\nog-image.png generated (${kb(size)})`);
}

const removeSource = !process.argv.includes('--keep-png');
await convertOverlays({ removeSource });
await buildOgImage();
