#!/usr/bin/env node
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fg from 'fast-glob';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Config ----
const CANVAS_DIR   = 'assets/raw/canvas';
const MOCKUPS_DIR  = 'assets/raw/mockups';
const OUTPUT_ROOT  = 'public/images/works';
const MANIFEST_PATH = 'data/images.manifest.json';
const WORKS_JSON_PATH = 'data/works.json';
const PUBLIC_DATA_DIR = 'public/data';

const HERO_WIDTHS  = [480, 800];                   // M0 only (small)
const MOCK_WIDTHS  = [480, 800, 1200, 1600];       // M1+
const HERO_QUALITY = 72;                           // lower quality for tiny hero
const MOCK_QUALITY = 82;
const STRIP_EXIF   = true;                         // sharp strips by default unless withMetadata is used
const SET_DPI_72   = true;                         // embed 72 DPI
const ADD_WATERMARK = false;                       // optional
const WATERMARK_TEXT = 'AURA ON CANVAS';           // change if needed

// ---- Filename patterns ----
// Canvas files (your screenshot shows "BLUE-1-1.jpeg" etc):
// Accepts "BLUE-1-1.jpg" or "BLUE-1.jpg" or "BLUE1-1.jpg"
const canvasRe = /^(BLUE|GREEN|RED)-?(\d+)-(?:1|C\d+)?\.(png|jpe?g)$/i;

// Mockups "BLUE-1-M3.png" etc.
const mockupRe = /^(BLUE|GREEN|RED)-?(\d+)-M(\d+)\.(png|jpe?g)$/i;

// Read mapping key -> slug/title/etsyId
let map = [];
try {
	map = JSON.parse(fsSync.readFileSync('data/works.map.json','utf8'));
} catch (e) {
	map = [];
}

// Fallback for slug if mapping is missing
const seriesSlugPrefix = { BLUE:'blue-androgyne-no', GREEN:'green-vision-no', RED:'red-vision-no' };

function buildPublicPath(slug, filename) {
	return `/images/works/${slug}/${filename}`;
}

async function ensureDir(dirPath) {
	await fs.mkdir(dirPath, { recursive: true });
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

// Helper: get {slug,title,etsyId} from series+idx
function resolveWork(series, idx){
	const key = `${series}-${idx}`;
	let entry = map.find(m => m && m.key && String(m.key).toUpperCase() === key.toUpperCase());
	if (!entry) {
		const prefix = seriesSlugPrefix[series] || series.toLowerCase();
		entry = { key, slug: `${prefix}${idx}`, title: `${prefix}${idx}`.replace(/-/g,' '), etsyId: '' };
		console.warn('[ingest] Missing map for', key, '→ using fallback slug', entry.slug);
	}
	return entry;
}

// Helper: pipeline for output derivatives with sharp
async function writeDerivatives(inputPath, outDir, baseName, widths, quality){
	await fs.mkdir(outDir, { recursive: true });
	const sharpBase = sharp(inputPath);
	// Strip EXIF by default; add 72dpi metadata if requested
	const base = SET_DPI_72 ? sharpBase.withMetadata({ density: 72 }) : sharpBase;

	// thumb 600 - garde le ratio original
	await base
		.clone()
		.resize(600, null, { fit: 'inside', withoutEnlargement: true })
		.webp({ quality: Math.min(quality, 80) })
		.toFile(path.join(outDir, `${baseName}-thumb600.webp`));

	for (const w of widths) {
		// WEBP
		await base
			.clone()
			.resize({ width: w, withoutEnlargement: true })
			.webp({ quality })
			.toFile(path.join(outDir, `${baseName}-w${w}.webp`));

		// JPG
		await base
			.clone()
			.resize({ width: w, withoutEnlargement: true })
			.jpeg({ quality, progressive: true, mozjpeg: true })
			.toFile(path.join(outDir, `${baseName}-w${w}.jpg`));
	}
}

// OPTIONAL: watermark on hero (M0)
function maybeWatermarkSvg(text){
	return `
	<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200">
		<rect width="100%" height="100%" fill="none"/>
		<text x="98%" y="90%" font-family="sans-serif" font-size="42" fill="rgba(255,255,255,0.25)" text-anchor="end">
			${text}
		</text>
	</svg>`;
}

async function writeHeroWithOptionalWatermark(inputPath, outDir, baseName){
	const base = sharp(inputPath).withMetadata({ density: 72 });
	const image = ADD_WATERMARK
		? base.composite([{ input: Buffer.from(maybeWatermarkSvg(WATERMARK_TEXT)), gravity: 'southeast' }])
		: base;
	// Generate derivatives for hero widths only
	await fs.mkdir(outDir, { recursive: true });
	// thumb - garde le ratio original
	await image.clone().resize(600, null, {fit:'inside', withoutEnlargement:true}).webp({quality:70}).toFile(path.join(outDir, `${baseName}-thumb600.webp`));
	for (const w of HERO_WIDTHS){
		await image.clone().resize({width:w, withoutEnlargement:true}).webp({quality:HERO_QUALITY}).toFile(path.join(outDir, `${baseName}-w${w}.webp`));
		await image.clone().resize({width:w, withoutEnlargement:true}).jpeg({quality:HERO_QUALITY, progressive:true, mozjpeg:true}).toFile(path.join(outDir, `${baseName}-w${w}.jpg`));
	}
}

// Accumulate manifest entries
const manifest = {};
const seenSlugs = new Set();
function upsertVariant(slug, title, etsyId, mock, outDir, baseName){
	if (!manifest[slug]) manifest[slug] = { title, etsyId, variants: [] };
	const thumb = buildPublicPath(slug, `${baseName}-thumb600.webp`);
	manifest[slug].variants.push({ mock, baseName, srcsetWebp: [], srcsetJpg: [], thumb });
	seenSlugs.add(slug);
}

async function main() {
	// ---- Scan CANVAS (make M0)
	const canvasFiles = await fg([`${CANVAS_DIR}/**/*.{jpg,jpeg,png}`], { dot:false });
	for (const file of canvasFiles){
		const name = path.basename(file);
		const m = name.match(canvasRe);
		if (!m) { console.warn('[ingest] skip canvas', name); continue; }
		const series = m[1].toUpperCase();
		const idx = parseInt(m[2], 10);
		const { slug, title, etsyId } = resolveWork(series, idx);
		const outDir = path.join(OUTPUT_ROOT, slug);
		const baseName = `${slug}-M0`;
		await writeHeroWithOptionalWatermark(file, outDir, baseName);
		upsertVariant(slug, title, etsyId, 0, outDir, baseName);
	}

	// ---- Scan MOCKUPS (M1+)
	const mockupFiles = await fg([`${MOCKUPS_DIR}/**/*.{jpg,jpeg,png}`], { dot:false });
	for (const file of mockupFiles){
		const name = path.basename(file);
		const m = name.match(mockupRe);
		if (!m) { console.warn('[ingest] skip mockup', name); continue; }
		const series = m[1].toUpperCase();
		const idx    = parseInt(m[2], 10);
		const mock   = parseInt(m[3], 10);
		const { slug, title, etsyId } = resolveWork(series, idx);
		const outDir = path.join(OUTPUT_ROOT, slug);
		const baseName = `${slug}-M${mock}`;
		await writeDerivatives(file, outDir, baseName, MOCK_WIDTHS, MOCK_QUALITY);
		upsertVariant(slug, title, etsyId, mock, outDir, baseName);
	}

	// ---- Fallback: if no RAW present, build manifest from public/images/works
	if (canvasFiles.length === 0 && mockupFiles.length === 0) {
		const publicRoot = path.join(process.cwd(), 'public', 'images', 'works');
		const slugDirs = await fg('*', { cwd: publicRoot, onlyDirectories: true });
		// Load existing works to enrich meta
		let existingWorks = [];
		try { existingWorks = JSON.parse(fsSync.readFileSync(path.join(process.cwd(), 'data', 'works.json'), 'utf8')); } catch(_) {}
		const slugToMeta = new Map(existingWorks.map(w => [w.slug, { title: w.title || w.slug, etsyId: w.etsyId || '' }]));

		for (const slug of slugDirs) {
			const files = await fg('*', { cwd: path.join(publicRoot, slug), onlyFiles: true });
			const bases = new Set();
			const thumbs = new Map();
			for (const f of files) {
				const mThumb = f.match(new RegExp(`^${slug}-M(\\d+)-thumb600\\.webp$`));
				if (mThumb) { thumbs.set(`${slug}-M${mThumb[1]}`, f); }
				const mBase = f.match(new RegExp(`^(${slug}-M\\d+)-w(\\d+)\\.(webp|jpg)$`));
				if (mBase) { bases.add(mBase[1]); }
			}
			const meta = slugToMeta.get(slug) || { title: slug, etsyId: '' };
			for (const baseName of Array.from(bases)) {
				const mockMatch = baseName.match(/-M(\d+)$/);
				const mock = mockMatch ? parseInt(mockMatch[1], 10) : 0;
				if (!manifest[slug]) manifest[slug] = { title: meta.title, etsyId: meta.etsyId, variants: [] };
				const thumbFile = thumbs.get(baseName) || `${baseName}-w800.jpg`;
				manifest[slug].variants.push({ mock, baseName, srcsetWebp: [], srcsetJpg: [], thumb: buildPublicPath(slug, thumbFile) });
				seenSlugs.add(slug);
			}
		}
	}

	// Sort variants by mock asc
	for (const slug of Object.keys(manifest)) {
		manifest[slug].variants.sort((a, b) => a.mock - b.mock);
	}
	await writeJsonBoth(MANIFEST_PATH, manifest);

	// Build works.json from mapping (for all seen slugs and mapping entries)
	const works = [];
	const seen = new Set(seenSlugs);
	for (const m of map) {
		if (!m || !m.slug) continue;
		seen.add(m.slug);
	}
	for (const slug of Array.from(seen)) {
		// find best meta
		const fromMap = map.find(e => e && e.slug === slug);
		const title = fromMap?.title || slug;
		const etsyId = fromMap?.etsyId || '';
		const buyUrl = etsyId ? `https://www.etsy.com/listing/${etsyId}?utm_source=site&utm_medium=product&utm_campaign=buy_on_etsy` : '';
		works.push({ slug, title, year: '2024', size: 'Various', price: '—', forSale: true, etsyId, buyUrl, alt: 'Studio figure, backlit, no visible face; paint texture and gesture emphasized.' });
	}
	works.sort((a, b) => a.slug.localeCompare(b.slug));
	await writeJsonBoth(WORKS_JSON_PATH, works);

	console.log(`Ingestion complete. Canvas: ${0} (found ${0}), Mockups: ${0} (found ${0}). Manifest and works.json updated.`);
}

main().catch(err => {
	console.error(err);
	process.exit(1);
});
