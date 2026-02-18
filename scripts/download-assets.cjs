#!/usr/bin/env node
/**
 * download-assets.js
 * Downloads all Figma MCP asset URLs locally to public/assets/
 * Run with: node scripts/download-assets.js
 *
 * After running, all pages/*.tsx files are auto-updated to use /assets/ paths.
 */

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const url   = require('url');

// ── Asset map: localName (no ext) → Figma URL ────────────────────────────────
// Extensions are detected from Content-Type header at download time.
const ASSETS = {
  // ── Shop: Characters ────────────────────────────────────────────────────────
  'shop-char-granny':     'https://www.figma.com/api/mcp/asset/c5f69a42-64d6-4500-823f-35de699ccb5c',
  'shop-char-cat':        'https://www.figma.com/api/mcp/asset/8728dcf9-0c71-45e8-853b-cb5ee99428d0',
  'shop-char-papers':     'https://www.figma.com/api/mcp/asset/ec2a1662-be1d-4aa8-adc7-bec443835f07',
  'shop-char-executive':  'https://www.figma.com/api/mcp/asset/204b3a88-8b6f-4045-92f9-a7104037a005',
  'shop-char-bubbletea':  'https://www.figma.com/api/mcp/asset/65b5ced1-424a-4a5d-9c12-16a8bb2a1ba6',
  'shop-char-effect':     'https://www.figma.com/api/mcp/asset/68ba61d8-f5dc-417a-b699-99580e3f28de',

  // ── Shop: Star Points coins ──────────────────────────────────────────────────
  'shop-coin-sm':         'https://www.figma.com/api/mcp/asset/8aecd2cf-dafd-4acb-a908-c388c86dc164',
  'shop-coin-md':         'https://www.figma.com/api/mcp/asset/b4f46be5-ce35-4db4-93db-4cc78f77b761',
  'shop-coin-lg':         'https://www.figma.com/api/mcp/asset/f5606cf3-d681-4a7d-8c10-73b9f66b57e0',
  'shop-coin-xl':         'https://www.figma.com/api/mcp/asset/3194d11f-7bbf-4c8d-9cca-56fcfe57da60',
  'shop-coin-xxl':        'https://www.figma.com/api/mcp/asset/efb6ff14-7f67-4fce-bd62-d80efb97a96b',

  // ── Shop: EXIT PASS ticket ───────────────────────────────────────────────────
  'shop-ticket-sparkle':  'https://www.figma.com/api/mcp/asset/36fb2386-d4ae-4afd-92df-d39e73cb9ad5',
  'shop-ticket-outer':    'https://www.figma.com/api/mcp/asset/557195a3-7147-4a90-9215-d5f8a4a15c8a',
  'shop-ticket-inner':    'https://www.figma.com/api/mcp/asset/b3deb298-77ce-41cc-8125-109a466af884',
  'shop-ticket-mark':     'https://www.figma.com/api/mcp/asset/55874cf3-3930-4f06-b8c2-60d687794b19',
  'shop-ticket-main':     'https://www.figma.com/api/mcp/asset/fcc8092a-1f56-48db-aa13-0845ba213dd2',

  // ── Streak ───────────────────────────────────────────────────────────────────
  'streak-hero':          'https://www.figma.com/api/mcp/asset/45064bf4-4c94-483b-bf71-b21ad758eadd',
  'streak-day-checked':   'https://www.figma.com/api/mcp/asset/8f16673b-999c-436e-8b6a-bfde61d1eb87',
  'streak-day-ring':      'https://www.figma.com/api/mcp/asset/c87dfd3d-8a4d-4ecb-b0f0-a415c1418b27',
};

// ── URL → local name reverse map (for updating source files) ─────────────────
// Built after download (once we know extensions).
const URL_TO_LOCAL = {};

// ── Dirs ─────────────────────────────────────────────────────────────────────
const ROOT      = path.join(__dirname, '..');
const OUT_DIR   = path.join(ROOT, 'public', 'assets');
const PAGES_DIR = path.join(ROOT, 'pages');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Helpers ───────────────────────────────────────────────────────────────────
function extFromContentType(ct) {
  if (!ct) return '.png';
  if (ct.includes('svg'))  return '.svg';
  if (ct.includes('webp')) return '.webp';
  if (ct.includes('jpeg') || ct.includes('jpg')) return '.jpg';
  if (ct.includes('gif'))  return '.gif';
  return '.png';
}

function download(name, figmaUrl) {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(figmaUrl);
    const proto = parsedUrl.protocol === 'https:' ? https : http;

    const req = proto.get(figmaUrl, { timeout: 20000 }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(name, res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${name}`));
      }

      const ext      = extFromContentType(res.headers['content-type']);
      const filename = `${name}${ext}`;
      const outPath  = path.join(OUT_DIR, filename);
      const localUrl = `/assets/${filename}`;

      URL_TO_LOCAL[figmaUrl] = localUrl;

      const ws = fs.createWriteStream(outPath);
      res.pipe(ws);
      ws.on('finish', () => {
        console.log(`  ✓ ${filename}`);
        resolve({ name, filename, localUrl, figmaUrl });
      });
      ws.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout: ${name}`)); });
  });
}

// ── Update source files ───────────────────────────────────────────────────────
function updateSourceFiles() {
  const files = fs.readdirSync(PAGES_DIR)
    .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
    .map(f => path.join(PAGES_DIR, f));

  let totalReplaced = 0;

  for (const file of files) {
    let src = fs.readFileSync(file, 'utf8');
    let changed = false;

    for (const [figmaUrl, localUrl] of Object.entries(URL_TO_LOCAL)) {
      if (src.includes(figmaUrl)) {
        src = src.split(figmaUrl).join(localUrl);
        changed = true;
        totalReplaced++;
      }
    }

    if (changed) {
      fs.writeFileSync(file, src, 'utf8');
      console.log(`  📝 Updated: ${path.relative(ROOT, file)}`);
    }
  }

  console.log(`\n  Replaced ${totalReplaced} URL(s) across source files.`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🎴 Mahjong Stars — Figma Asset Downloader`);
  console.log(`   Output: ${OUT_DIR}\n`);

  const entries = Object.entries(ASSETS);
  let ok = 0, fail = 0;

  for (const [name, figmaUrl] of entries) {
    // Check if any file with this name already exists (any extension)
    const existing = fs.readdirSync(OUT_DIR).find(f => f.startsWith(name + '.'));
    if (existing) {
      const localUrl = `/assets/${existing}`;
      URL_TO_LOCAL[figmaUrl] = localUrl;
      console.log(`  ⏭  ${existing} (already exists)`);
      ok++;
      continue;
    }

    try {
      await download(name, figmaUrl);
      ok++;
    } catch (err) {
      console.error(`  ✗ FAILED: ${name} — ${err.message}`);
      fail++;
    }

    // Small delay between requests to avoid rate-limiting
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n📦 Downloaded: ${ok}/${entries.length}  Failed: ${fail}`);

  if (ok > 0) {
    console.log('\n📝 Updating source files...');
    updateSourceFiles();
  }

  console.log('\n✅ Done! Restart the dev server to see changes.\n');
}

main().catch(err => { console.error(err); process.exit(1); });
