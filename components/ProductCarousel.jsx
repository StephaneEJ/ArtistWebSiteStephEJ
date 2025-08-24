'use client';
import React from 'react';
import manifest from '@/data/images.manifest.json';

export default function ProductCarousel({ slug, title }){
	// Load manifest[slug].variants and sort ascending by mock
	const variants = ((manifest?.[slug]?.variants) || [])
		.slice()
		.sort((a, b) => a.mock - b.mock);
	
	// First slide = mock 0 if available; next slides = 1,2,3...
	// Reorder variants to prioritize mock 0
	const reorderedVariants = [];
	const mock0Variant = variants.find(v => v.mock === 0);
	if (mock0Variant) {
		reorderedVariants.push(mock0Variant);
	}
	reorderedVariants.push(...variants.filter(v => v.mock !== 0));
	
	const [index, setIndex] = React.useState(0);
	const count = reorderedVariants.length;
	const safeIndex = index < count ? index : 0;

	const goPrev = () => setIndex(i => (i - 1 + count) % count);
	const goNext = () => setIndex(i => (i + 1) % count);

	if (!count) return null;

	const active = reorderedVariants[safeIndex];

	// Build <picture> srcset exactly like in WorkCard (ensure paths are absolute)
	const webpSet = active?.srcsetWebp?.map(u => `${u.startsWith('/') ? u : '/' + u} ${u.match(/-w(\d+)\./)?.[1]}w`).join(', ');
	const jpgSet = active?.srcsetJpg?.map(u => `${u.startsWith('/') ? u : '/' + u} ${u.match(/-w(\d+)\./)?.[1]}w`).join(', ');
	const base = (active?.srcsetJpg?.find(u => /-w800\.jpg$/i.test(u)) || active?.srcsetJpg?.[0] || '').replace(/^([^/])/, '/$1');

	return (
		<div className="space-y-3" aria-roledescription="carousel" aria-label="Galerie produit">
			<div className="relative">
				{base ? (
					<picture>
						<source type="image/webp" srcSet={webpSet} sizes="(min-width:1024px) 400px, 90vw" />
						<source type="image/jpeg" srcSet={jpgSet} sizes="(min-width:1024px) 400px, 90vw" />
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
				{reorderedVariants.map((v, i) => (
					<button key={i} className={`block border ${i === safeIndex ? 'border-blue-600' : 'border-transparent'}`} onClick={() => setIndex(i)} aria-selected={i === safeIndex}>
						{/* Thumbnails use variant.thumb (ensure leading slash) */}
						<img src={v.thumb.startsWith('/') ? v.thumb : '/' + v.thumb} alt="" className="w-full h-auto" />
					</button>
				))}
			</div>
		</div>
	);
}