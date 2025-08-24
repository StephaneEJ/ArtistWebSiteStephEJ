'use client';
import React from 'react';
import manifest from '@/data/images.manifest.json';

export default function ProductCarousel({ slug, title }){
	const sorted = ((manifest?.[slug]?.variants) || [])
		.slice()
		.sort((a,b)=>a.mock-b.mock);
	const variants = sorted.slice(0, 12);
	const [index, setIndex] = React.useState(0);
	const count = variants.length;
	const safeIndex = index < count ? index : 0;

	const goPrev = () => setIndex(i => (i - 1 + count) % count);
	const goNext = () => setIndex(i => (i + 1) % count);

	if (!count) return null;

	const active = variants[safeIndex];

	const ensureLeadingSlash = (u) => !u ? '' : (u.startsWith('/') ? u : `/${u}`);
	const buildSet = (arr) => (arr||[])
		.map(u => `${ensureLeadingSlash(u)} ${u.match(/-w(\d+)\./)?.[1]}w`)
		.join(', ');
	const webpSet = buildSet(active?.srcsetWebp);
	const jpgSet  = buildSet(active?.srcsetJpg);
	const base    = ensureLeadingSlash((active?.srcsetJpg?.find(u=>/-w800\.jpg$/i.test(u)) || active?.srcsetJpg?.[0] || ''));

	return (
		<div className="space-y-3" aria-roledescription="carousel" aria-label="Galerie produit">
			<div className="relative">
				{base ? (
					<picture>
						<source type="image/webp" srcSet={webpSet} sizes="(min-width:1024px) 400px, 90vw" />
						<source type="image/jpeg" srcSet={jpgSet}  sizes="(min-width:1024px) 400px, 90vw" />
						<img src={base} alt={title} className="w-full h-auto" loading="lazy" decoding="async" />
					</picture>
				) : null}
				<div className="sr-only">Image {safeIndex + 1}/{count}</div>
				<div className="absolute inset-y-0 left-0 flex items-center">
					<button type="button" className="btn" onClick={goPrev} aria-label="Précédent">‹</button>
				</div>
				<div className="absolute inset-y-0 right-0 flex items-center">
					<button type="button" className="btn" onClick={goNext} aria-label="Suivant">›</button>
				</div>
			</div>
			<div className="grid grid-cols-6 gap-2">
				{variants.map((v, i) => (
					<button key={i} className={`block border ${i===safeIndex?'border-blue-600':'border-transparent'}`} onClick={()=>setIndex(i)} aria-selected={i===safeIndex}>
						<img src={ensureLeadingSlash(v.thumb)} alt="" className="w-full h-auto" />
					</button>
				))}
			</div>
		</div>
	);
}