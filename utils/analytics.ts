export function trackEtsyClick(slug: string, where: 'card'|'product') {
	if (typeof window !== 'undefined' && (window as any).plausible) {
		(window as any).plausible('etsy_click', { props: { slug, where } });
	}
}