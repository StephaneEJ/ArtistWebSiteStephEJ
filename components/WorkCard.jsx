import React from 'react';
import { trackEtsyClick } from '../utils/analytics';
import { buildSrcSet, findBaseImage } from '../utils/imageUtils';
import EtsyButton from './EtsyButton';

function pickHero(slug, manifest){
  // Read manifest[work.slug]?.variants || []
  const variants = manifest?.[slug]?.variants || [];
  
  // Normalize: coerce each mock to a Number
  const normalizedVariants = variants.map(variant => ({
    ...variant,
    mock: Number(variant.mock)
  }));
  
  // Sort ascending by mock
  const sortedVariants = normalizedVariants.sort((a, b) => a.mock - b.mock);
  
  // Validate: log mock order for debugging
  if (process.env.NODE_ENV === 'development') {
    const mockOrder = sortedVariants.map(v => v.mock);
    console.log(`[WorkCard] ${slug} variants order:`, mockOrder);
  }
  
  // Pick the item with mock === 0 if present; otherwise the first one
  return sortedVariants.find(v => v.mock === 0) || sortedVariants[0];
}

export default function WorkCard({ work, manifest = {} }){
	const slug = work.slug;
	const title = work.title || slug;
	const etsyId = work.etsyId || '';
	const buyUrl = etsyId ? `https://www.etsy.com/listing/${etsyId}?utm_source=site&utm_medium=product&utm_campaign=buy_on_etsy` : (work.buyUrl || '');

	const hero = pickHero(slug, manifest);
	
	// Use utility functions for srcset and base image
	const webpSet = buildSrcSet(hero?.srcsetWebp);
	const jpgSet = buildSrcSet(hero?.srcsetJpg);
	
	// Fallback to thumbnail if no srcset available
	const hasSrcset = webpSet || jpgSet;
	const base = hasSrcset ? findBaseImage(hero?.srcsetJpg, '800') : hero?.thumb;

	return (
		<figure className="card">
			<a href={`/oeuvre/${slug}`} aria-label={title}>
				{/* Conteneur: hauteur fixe 400px, largeur variable selon le ratio de l'image */}
				<div className="relative h-[400px] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
					{base ? (
						hasSrcset ? (
							<picture className="h-full flex items-center justify-center">
								<source type="image/webp" srcSet={webpSet} sizes="(min-width:1024px) 400px, 90vw" />
								<source type="image/jpeg" srcSet={jpgSet} sizes="(min-width:1024px) 400px, 90vw" />
								{/* Image: hauteur 100%, largeur auto pour garder le ratio */}
								<img src={base} alt={work.alt||title} loading="lazy" decoding="async" className="h-full w-auto object-contain" />
							</picture>
						) : (
							/* Fallback to thumbnail when no srcset available */
							<img src={base} alt={work.alt||title} loading="lazy" decoding="async" className="h-full w-auto object-contain" />
						)
					) : (
						<img src="/placeholder.png" alt={title} loading="lazy" className="h-full w-auto object-contain" />
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