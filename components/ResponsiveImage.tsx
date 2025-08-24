'use client';

import React from 'react';

type ResponsiveImageProps = {
	baseName: string; // e.g., "<slug>-M1" (without size suffix)
	alt: string;
	widths?: number[];
	sizes?: string;
	folder?: string;
	className?: string;
};

const DEFAULT_WIDTHS = [480, 800, 1200, 1600];
const DEFAULT_SIZES = '(min-width: 1024px) 800px, 90vw';

function ensureTrailingSlash(pathname: string): string {
	if (!pathname) return '/';
	return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export default function ResponsiveImage({
	baseName,
	alt,
	widths = DEFAULT_WIDTHS,
	sizes = DEFAULT_SIZES,
	folder,
	className,
}: ResponsiveImageProps) {
	const slug = React.useMemo(() => {
		const idx = baseName.indexOf('-M');
		return idx > -1 ? baseName.substring(0, idx) : baseName;
	}, [baseName]);

	const baseFolder = React.useMemo(() => {
		const fallback = `/images/works/${slug}/`;
		return ensureTrailingSlash(folder || fallback);
	}, [folder, slug]);

	const srcsetWebp = React.useMemo(
		() => widths.map(w => `${baseFolder}${baseName}-w${w}.webp ${w}w`).join(', '),
		[baseFolder, baseName, widths]
	);

	const srcsetJpg = React.useMemo(
		() => widths.map(w => `${baseFolder}${baseName}-w${w}.jpg ${w}w`).join(', '),
		[baseFolder, baseName, widths]
	);

	const fallbackSrc = `${baseFolder}${baseName}-w800.jpg`;

	return (
		<picture>
			<source type="image/webp" srcSet={srcsetWebp} sizes={sizes} />
			<source type="image/jpeg" srcSet={srcsetJpg} sizes={sizes} />
			<img
				src={fallbackSrc}
				alt={alt}
				loading="lazy"
				decoding="async"
				className={className}
				style={{ width: '100%', height: 'auto' }}
			/>
		</picture>
	);
}