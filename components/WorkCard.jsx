'use client';
import React from 'react';
import { trackEtsyClick } from '../utils/analytics';
import { buildSrcSet, findBaseImage } from '../utils/imageUtils';
import EtsyButton from './EtsyButton';
import manifest from '@/data/images.manifest.json';

function pickHero(slug){
  // Read manifest[work.slug]?.variants || []
  const variants = manifest?.[slug]?.variants || [];
  
  // Normalize: coerce each mock to a Number
  const normalizedVariants = variants.map(variant => ({
    ...variant,
    mock: Number(variant.mock)
  }));
  
  // Sort ascending by mock
  const sortedVariants = normalizedVariants.sort((a, b) => a.mock - b.mock);
  
  // Pick the item with mock === 0 if present; otherwise the first one
  return sortedVariants.find(v => v.mock === 0) || sortedVariants[0];
}

export default function WorkCard({ work, manifestEntry }){
	const slug = work.slug;
	const title = work.title || slug;
	const etsyId = work.etsyId || '';
	const buyUrl = etsyId ? `https://www.etsy.com/listing/${etsyId}?utm_source=site&utm_medium=product&utm_campaign=buy_on_etsy` : (work.buyUrl || '');

	const hero = pickHero(slug);
	
	// Use utility functions for srcset and base image
	const webpSet = buildSrcSet(hero?.srcsetWebp);
	const jpgSet = buildSrcSet(hero?.srcsetJpg);
	const base = findBaseImage(hero?.srcsetJpg, '800');

	return (
		<figure className="card">
			<a href={`/oeuvre/${slug}`} aria-label={title}>
				{/* Wrapper: relative aspect-[4/5] w-full overflow-hidden rounded-lg */}
				<div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
					{base ? (
						<picture className="absolute inset-0 w-full h-full">
							<source type="image/webp" srcSet={webpSet} sizes="(min-width:1024px) 400px, 90vw" />
							<source type="image/jpeg" srcSet={jpgSet} sizes="(min-width:1024px) 400px, 90vw" />
							{/* Image inside: absolute inset-0 w-full h-full object-cover */}
							<img src={base} alt={work.alt||title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
						</picture>
					) : (
						<img src="/placeholder.png" alt={title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
					)}
				</div>
			</a>
			<figcaption className="caption">
				<div className="font-medium">{title}</div>
				<div className="mt-2 flex gap-3">
					<a href={`/oeuvre/${slug}`} className="btn btn-sm">Voir</a>
					{buyUrl && <EtsyButton href={buyUrl} slug={slug} where="card" className="btn btn-sm">Acheter sur Etsy</EtsyButton>}
				</div>
			</figcaption>
		</figure>
	);
}