#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

const WORKS_PATH = path.join(process.cwd(), 'data', 'works.json');
const SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap.txt');

async function ensureDir(dirPath) {
	await fs.mkdir(dirPath, { recursive: true });
}

async function readWorks() {
	try {
		const raw = await fs.readFile(WORKS_PATH, 'utf8');
		const data = JSON.parse(raw);
		return Array.isArray(data) ? data : [];
	} catch (err) {
		if (err.code === 'ENOENT') return [];
		throw err;
	}
}

function buildLines(works) {
	const base = [
		'https://auraoncanvas.art/',
		'https://auraoncanvas.art/boutique'
	];
	const slugs = works
		.map(w => w && w.slug)
		.filter(Boolean)
		.map(String)
		.sort((a, b) => a.localeCompare(b));
	const products = slugs.map(slug => `https://auraoncanvas.art/oeuvre/${slug}`);
	return [...base, ...products];
}

async function readExisting(filePath) {
	try {
		return await fs.readFile(filePath, 'utf8');
	} catch (err) {
		if (err.code === 'ENOENT') return '';
		throw err;
	}
}

async function main() {
	const works = await readWorks();
	const lines = buildLines(works);
	const content = lines.join('\n') + '\n';

	await ensureDir(path.dirname(SITEMAP_PATH));
	const existing = await readExisting(SITEMAP_PATH);
	if (existing === content) {
		console.log('sitemap.txt is up-to-date.');
		return;
	}
	await fs.writeFile(SITEMAP_PATH, content, 'utf8');
	console.log(`sitemap.txt written with ${lines.length} entries.`);
}

main().catch(err => {
	console.error(err);
	process.exit(1);
});