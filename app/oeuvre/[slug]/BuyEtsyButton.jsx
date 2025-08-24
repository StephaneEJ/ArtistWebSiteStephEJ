'use client';
import React from 'react';
import { trackEtsyClick } from '../../../utils/analytics';

export default function BuyEtsyButton({ href, slug }){
	return (
		<a href={href} className="btn" target="_blank" rel="noopener noreferrer" onClick={()=>trackEtsyClick(slug,'product')}>
			Acheter sur Etsy
		</a>
	);
}