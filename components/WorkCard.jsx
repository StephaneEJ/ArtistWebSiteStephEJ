'use client';
import React from 'react';

export default function WorkCard({ work, manifestEntry }){
	const slug = work.slug;
	const title = work.title || slug;
	const etsyId = work.etsyId || '';
	const buyUrl = etsyId ? `https://www.etsy.com/listing/${etsyId}?utm_source=site&utm_medium=product&utm_campaign=buy_on_etsy` : (work.buyUrl || '');

	const variant = manifestEntry && Array.isArray(manifestEntry.variants) ? manifestEntry.variants[0] : null;
	const thumb = variant && variant.thumb ? variant.thumb : null;

	return (
		<figure className="card">
			<a href={`/oeuvre/${slug}`} aria-label={title}>
				{thumb ? (
					<img src={thumb} alt={title} loading="lazy" className="w-full" />
				) : (
					<img src="/placeholder.png" alt={title} loading="lazy" className="w-full" />
				)}
			</a>
			<figcaption className="caption">
				<div className="font-medium">{title}</div>
				<div className="mt-2 flex gap-3">
					<a href={`/oeuvre/${slug}`} className="btn btn-sm">Voir</a>
					{buyUrl && <a href={buyUrl} className="btn btn-sm" target="_blank" rel="noopener noreferrer">Acheter sur Etsy</a>}
				</div>
			</figcaption>
		</figure>
	);
}