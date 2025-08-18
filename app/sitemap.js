
import fs from 'fs';
import path from 'path';

export default async function sitemap() {
  const site = process.env.SITE_URL || 'https://example.com';
  const routes = ['', '/contact'].map((r) => ({
    url: `${site}${r || '/'}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8
  }));

  const p = path.join(process.cwd(), 'public', 'gallery.json');
  const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
  const items = Array.isArray(data) ? data : (data.items || []);
  const works = items.map((it) => ({
    url: `${site}/oeuvre/${it.slug}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6
  }));

  return [...routes, ...works];
}
