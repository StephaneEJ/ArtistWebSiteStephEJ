#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import fg from 'fast-glob';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_GLOB = 'assets/raw/**/*.{png,jpg,jpeg}';
const OUTPUT_ROOT = 'public/images/works';
const MAP_PATH = 'data/works.map.json';
const MANIFEST_PATH = 'data/images.manifest.json';
const WORKS_JSON_PATH = 'data/works.json';
const PUBLIC_DATA_DIR = 'public/data';
const WIDTHS = [480, 800, 1200, 1600];
const WEBP_QUALITY = 82;
const JPG_QUALITY = 82;
const THUMB_SIZE = 600;

// --- Fallback prefixes par série (ajouter/adapter si tu crées d'autres séries)
const seriesSlugPrefix = {
  BLUE:  "blue-androgyne-no",
  GREEN: "green-vision-no",
  RED:   "red-vision-no",
};

// Nom attendu : BLUE-1-M3.png / GREEN-12-M7.jpg
const FILENAME_RE = /^(BLUE|GREEN|RED)-(\d+)-M(\d+)\.(png|jpe?g)$/i;
const FILENAME_REGEX = FILENAME_RE;

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function readJsonArray(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeJson(filePath, obj) {
  const json = JSON.stringify(obj, null, 2) + '\n';
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, json, 'utf8');
}

async function writeJsonBoth(primaryPath, obj) {
  await writeJson(primaryPath, obj);
  const filename = path.basename(primaryPath);
  await writeJson(path.join(PUBLIC_DATA_DIR, filename), obj);
}

function buildPublicPath(slug, filename) {
  return `/images/works/${slug}/${filename}`;
}

async function processImageVariant(rawFilePath, slug, mock, outputDir) {
  const baseName = `${slug}-M${mock}`;
  const srcsetWebp = [];
  const srcsetJpg = [];

  for (const width of WIDTHS) {
    const webpName = `${baseName}-w${width}.webp`;
    const jpgName = `${baseName}-w${width}.jpg`;
    const webpOut = path.join(outputDir, webpName);
    const jpgOut = path.join(outputDir, jpgName);

    await sharp(rawFilePath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpOut);
    srcsetWebp.push(buildPublicPath(slug, webpName));

    await sharp(rawFilePath)
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality: JPG_QUALITY, progressive: true })
      .toFile(jpgOut);
    srcsetJpg.push(buildPublicPath(slug, jpgName));
  }

  const thumbName = `${baseName}-thumb${THUMB_SIZE}.webp`;
  const thumbOut = path.join(outputDir, thumbName);
  await sharp(rawFilePath)
    .resize(THUMB_SIZE, THUMB_SIZE, { fit: 'cover', position: 'centre' })
    .webp({ quality: WEBP_QUALITY })
    .toFile(thumbOut);

  return { baseName, srcsetWebp, srcsetJpg, thumb: buildPublicPath(slug, thumbName) };
}

async function main() {
  const mapEntries = await readJsonArray(MAP_PATH);
  const keyToMeta = new Map();
  for (const entry of mapEntries) {
    if (!entry || !entry.key || !entry.slug) continue;
    keyToMeta.set(String(entry.key).toUpperCase(), {
      slug: entry.slug,
      title: entry.title || entry.slug,
      etsyId: entry.etsyId || ''
    });
  }

  const rawFiles = await fg(RAW_GLOB, { caseSensitiveMatch: false, onlyFiles: true, cwd: process.cwd() });
  const manifest = {};

  for (const raw of rawFiles) {
    const filename = path.basename(raw);
    const match = filename.match(FILENAME_REGEX);
    if (!match) {
      console.warn(`Skipping file with unrecognized name: ${filename}`);
      continue;
    }

    const series = match[1].toUpperCase();     // ex: BLUE
    const index = parseInt(match[2], 10);      // ex: 3
    const mock  = parseInt(match[3], 10);      // ex: 1
    const key   = `${series}-${index}`;        // ex: BLUE-3

    let meta = keyToMeta.get(key);

    if (!meta) {
      // Fallback automatique : construit un slug même si la clé n’est pas dans works.map.json
      const prefix = seriesSlugPrefix[series];
      const fallbackSlug = prefix ? `${prefix}${index}` : `${series.toLowerCase()}-${index}`;
      meta = {
        slug: fallbackSlug,
        title: fallbackSlug.replace(/-/g, ' '),
        etsyId: ''
      };

      // Mémoriser pour les autres mockups de la même œuvre durant ce run
      keyToMeta.set(key, meta);

      // Ajouter une entrée en mémoire afin que works.json inclue aussi ces œuvres fallback
      mapEntries.push({ key, slug: fallbackSlug, title: meta.title, etsyId: '' });

      console.warn(`[fallback] No mapping for "${key}" (file: ${filename}). Using slug "${fallbackSlug}".`);
    }

    const { slug, title, etsyId } = meta;
    const outDir = path.join(OUTPUT_ROOT, slug);
    await ensureDir(outDir);

    const variant = await processImageVariant(raw, slug, mock, outDir);

    if (!manifest[slug]) {
      manifest[slug] = { title, etsyId, variants: [] };
    }
    manifest[slug].variants.push({
      mock,
      baseName: variant.baseName,
      srcsetWebp: variant.srcsetWebp,
      srcsetJpg: variant.srcsetJpg,
      thumb: variant.thumb
    });
  }

  // Si aucun RAW n'a été trouvé, construire un manifest à partir de public/images/works (fallback)
  if (rawFiles.length === 0) {
    const publicRoot = path.join(process.cwd(), 'public', 'images', 'works');
    const slugDirs = await fg('*', { cwd: publicRoot, onlyDirectories: true });

    // Charger works.json existant pour récupérer titres/etsyId si disponibles
    let existingWorks = [];
    try {
      const raw = await fs.readFile(path.join(process.cwd(), 'data', 'works.json'), 'utf8');
      existingWorks = JSON.parse(raw);
    } catch (_) {}
    const slugToMeta = new Map(existingWorks.map(w => [w.slug, { title: w.title || w.slug, etsyId: w.etsyId || '' }]));

    for (const slug of slugDirs) {
      const files = await fg('*', { cwd: path.join(publicRoot, slug), onlyFiles: true });
      const thumbByBase = new Map();
      const bases = new Set();

      for (const f of files) {
        const thumbMatch = f.match(new RegExp(`^${slug}-M(\\d+)-thumb(\\d+)\\.webp$`));
        if (thumbMatch) {
          const mock = parseInt(thumbMatch[1], 10);
          const baseName = `${slug}-M${mock}`;
          thumbByBase.set(baseName, f);
        }
        const baseMatch = f.match(new RegExp(`^(${slug}-M\\d+)-w(\\d+)\\.(webp|jpg)$`));
        if (baseMatch) {
          bases.add(baseMatch[1]);
        }
      }

      const meta = slugToMeta.get(slug) || { title: slug, etsyId: '' };
      if (!manifest[slug]) manifest[slug] = { title: meta.title, etsyId: meta.etsyId, variants: [] };

      for (const baseName of Array.from(bases)) {
        const mockMatch = baseName.match(/-M(\d+)$/);
        const mock = mockMatch ? parseInt(mockMatch[1], 10) : 0;
        const thumbFile = thumbByBase.get(baseName) || null;
        manifest[slug].variants.push({
          mock,
          baseName,
          // srcsets ne sont pas nécessaires pour l’UI actuelle; ResponsiveImage les reconstruit
          srcsetWebp: [],
          srcsetJpg: [],
          thumb: thumbFile ? buildPublicPath(slug, thumbFile) : buildPublicPath(slug, `${baseName}-w800.jpg`)
        });
      }
    }
  }

  // Trier les variants par n° de mock pour stabilité
  for (const slug of Object.keys(manifest)) {
    manifest[slug].variants.sort((a, b) => a.mock - b.mock);
  }

  await writeJsonBoth(MANIFEST_PATH, manifest);

  // Construire works.json à partir de mapEntries (y compris les fallbacks ajoutés plus haut)
  const works = [];
  for (const entry of mapEntries) {
    const slug = entry.slug;
    const title = entry.title || slug;
    const etsyId = entry.etsyId || '';
    const buyUrl = etsyId ? `https://www.etsy.com/listing/${etsyId}?utm_source=site&utm_medium=product&utm_campaign=buy_on_etsy` : '';
    works.push({
      slug,
      title,
      year: '2024',
      size: 'Various',
      price: '—',
      forSale: true,
      etsyId,
      buyUrl,
      alt: 'Studio figure, backlit, no visible face; paint texture and gesture emphasized.'
    });
  }
  works.sort((a, b) => a.slug.localeCompare(b.slug));
  await writeJsonBoth(WORKS_JSON_PATH, works);

  console.log(`Ingestion complete. Processed ${rawFiles.length} RAW file(s). Manifest and works.json updated.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
