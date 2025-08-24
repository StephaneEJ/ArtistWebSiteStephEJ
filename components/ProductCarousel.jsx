'use client';
import React from 'react';
import ResponsiveImage from './ResponsiveImage';

export default function ProductCarousel({ manifestEntry, title }){
	const variants = (manifestEntry?.variants || []).slice(0, 6);
	const [index, setIndex] = React.useState(0);
	const count = variants.length;
	const safeIndex = index < count ? index : 0;

	const goPrev = () => setIndex(i => (i - 1 + count) % count);
	const goNext = () => setIndex(i => (i + 1) % count);

	if (!count) return null;

	const active = variants[safeIndex];

	return (
		<div className="space-y-3" aria-roledescription="carousel" aria-label="Galerie produit">
			<div className="relative">
				<ResponsiveImage baseName={active.baseName} alt={title} />
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
						<img src={v.thumb} alt="" className="w-full h-auto" />
					</button>
				))}
			</div>
		</div>
	);
}