
import fs from 'fs';
import path from 'path';

function getGallery(){
  const p = path.join(process.cwd(), 'public', 'gallery.json');
  const raw = fs.readFileSync(p, 'utf-8');
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : (data.items || []);
}

export function generateStaticParams(){
  const items = getGallery();
  return items.map((it) => ({ slug: it.slug || 'oeuvre' }));
}

export function generateMetadata({ params }){
  const items = getGallery();
  const it = items.find(i => i.slug === params.slug);
  const title = it?.title ? `${it.title} – Portfolio` : 'Œuvre – Portfolio';
  const description = it?.caption || 'Œuvre du portfolio';
  const url = process.env.SITE_URL || 'https://example.com';
  const image = it?.src ? (it.src.startsWith('http') ? it.src : `${url}${it.src}`) : undefined;
  return {
    title, description,
    openGraph: { title, description, url: `${url}/oeuvre/${params.slug}`, type: 'article', images: image ? [{ url: image }] : undefined },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined }
  };
}

export default function Page({ params }){
  const items = getGallery();
  const it = items.find(i => i.slug === params.slug);

  if(!it){
    return <div className="py-10">Œuvre introuvable.</div>;
  }

  return (
    <article className="grid md:grid-cols-2 gap-6">
      <div>
        <img src={it.src} alt={it.alt || it.title || 'Œuvre'} className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800" />
      </div>
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">{it.title || 'Sans titre'}</h1>
        {it.caption && <p className="text-neutral-600 dark:text-neutral-300">{it.caption}</p>}
        <a href="/" className="btn">← Retour à la galerie</a>
      </div>
    </article>
  );
}
