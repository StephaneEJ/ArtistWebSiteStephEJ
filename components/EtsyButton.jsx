'use client';
import React from 'react';
import { trackEtsyClick } from '../utils/analytics';

export default function EtsyButton({ href, slug, where, className, children }){
	return (
		<a href={href} className={className} target="_blank" rel="noopener noreferrer" onClick={()=>trackEtsyClick(slug, where)}>
			{children}
		</a>
	);
}