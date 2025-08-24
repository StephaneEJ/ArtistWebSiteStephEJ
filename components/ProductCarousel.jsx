'use client';
import React from 'react';
import { buildSrcSet, findBaseImage } from '../utils/imageUtils';
import manifest from '@/data/images.manifest.json';

export default function ProductCarousel({ slug, title }){
	// Load manifest[slug].variants and sort ascending by mock
	const variants = ((manifest?.[slug]?.variants) || [])
		.slice()
		.sort((a, b) => a.mock - b.mock);
	
	// Validate: log mock order for debugging
	if (process.env.NODE_ENV === 'development') {
		const mockOrder = variants.map(v => v.mock);
		console.log(`[ProductCarousel] ${slug} variants order:`, mockOrder);
	}
	
	// First slide = mock 0 if available; next slides = 1,2,3...
	// Reorder variants to prioritize mock 0
	const reorderedVariants = [];
	const mock0Variant = variants.find(v => v.mock === 0);
	if (mock0Variant) {
		reorderedVariants.push(mock0Variant);
	}
	reorderedVariants.push(...variants.filter(v => v.mock !== 0));
	
	// Validate: log final order for debugging
	if (process.env.NODE_ENV === 'development') {
		const finalOrder = reorderedVariants.map(v => v.mock);
		console.log(`[ProductCarousel] ${slug} final order:`, finalOrder);
	}
	
	const [index, setIndex] = React.useState(0);
	const count = reorderedVariants.length;
	const safeIndex = index < count ? index : 0;

	const goPrev = () => setIndex(i => (i - 1 + count) % count);
	const goNext = () => setIndex(i => (i + 1) % count);

	if (!count) return null;

	const active = reorderedVariants[safeIndex];

	// Use utility functions for srcset and base image
	const webpSet = buildSrcSet(active?.srcsetWebp);
	const jpgSet = buildSrcSet(active?.srcsetJpg);
	
	// Fallback to thumbnail if no srcset available
	const hasSrcset = webpSet || jpgSet;
	const base = hasSrcset ? findBaseImage(active?.srcsetJpg, '800') : active?.thumb;

	return (
		<div className="space-y-3" aria-roledescription="carousel" aria-label="Galerie produit">
			{/* Stage container: relative w-full max-w-screen-lg mx-auto aspect-[3/4] md:aspect-[4/5] */}
			<div className="relative w-full max-w-screen-lg mx-auto aspect-[3/4] md:aspect-[4/5]">
				{base ? (
					hasSrcset ? (
						<picture className="absolute inset-0 w-full h-full">
							<source type="image/webp" srcSet={webpSet} sizes="(min-width:1280px) 900px, (min-width:768px) 720px, 94vw" />
							<source type="image/jpeg" srcSet={jpgSet} sizes="(min-width:1280px) 900px, (min-width:768px) 720px, 94vw" />
							{/* Slide image: absolute inset-0 w-full h-full object-contain */}
							<img src={base} alt={title} className="absolute inset-0 w-full h-full object-contain" loading="lazy" decoding="async" />
						</picture>
					) : (
						/* Fallback to thumbnail when no srcset available */
						<img src={base} alt={title} className="absolute inset-0 w-full h-full object-contain" loading="lazy" decoding="async" />
					)
				) : null}
				<div className="sr-only">Image {safeIndex + 1}/{count}</div>
				<div className="absolute inset-y-0 left-0 flex items-center">
					<button type="button" className="btn" onClick={goPrev} aria-label="Précédent">‹</button>
				</div>
				<div className="absolute inset-y-0 right-0 flex items-center">
					<button type="button" className="btn" onClick={goNext} aria-label="Suivant">›</button>
				</div>
			</div>
			{/* Thumbnails below remain fixed small */}
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