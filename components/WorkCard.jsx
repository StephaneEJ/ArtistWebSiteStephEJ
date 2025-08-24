'use client';
import React from 'react';
import { trackEtsyClick } from '../utils/analytics';
import EtsyButton from './EtsyButton';
import manifest from '@/data/images.manifest.json';

function pickHero(slug){
  const v = (manifest && manifest[slug] && Array.isArray(manifest[slug].variants)) ? manifest[slug].variants : [];
  return v.find(x => x.mock === 0) || v[0];
}

export default function WorkCard({ work, manifestEntry }){
	const slug = work.slug;
	const title = work.title || slug;
	const etsyId = work.etsyId || '';
	const buyUrl = etsyId ? `https://www.etsy.com/listing/${etsyId}?utm_source=site&utm_medium=product&utm_campaign=buy_on_etsy` : (work.buyUrl || '');

	const hero = pickHero(slug);
	const webpSet = hero?.srcsetWebp?.map(u => `${u.startsWith('/')?u:'/'+u} ${u.match(/-w(\d+)\./)?.[1]}w`).join(', ');
	const jpgSet  = hero?.srcsetJpg ?.map(u => `${u.startsWith('/')?u:'/'+u} ${u.match(/-w(\d+)\./)?.[1]}w`).join(', ');
	const base    = (hero?.srcsetJpg?.find(u=>/-w800\.jpg$/i.test(u)) || hero?.srcsetJpg?.[0] || '').replace(/^([^/])/,'/$1');

	return (
		<figure className="card">
			<a href={`/oeuvre/${slug}`} aria-label={title}>
				{base ? (
					<picture>
						<source type="image/webp" srcSet={webpSet} sizes="(min-width:1024px) 400px, 90vw" />
						<source type="image/jpeg" srcSet={jpgSet}  sizes="(min-width:1024px) 400px, 90vw" />
						<img src={base} alt={work.alt||title} loading="lazy" decoding="async" className="w-full" />
					</picture>
				) : (
					<img src="/placeholder.png" alt={title} loading="lazy" className="w-full" />
				)}
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