'use client';
import Head from 'next/head';
import { usePathname } from 'next/navigation';

const BASE = 'https://auraoncanvas.art';

export default function CanonicalLink() {
  const pathname = usePathname() || '/';
  const clean = pathname.split('?')[0].split('#')[0];
  const href = `${BASE}${clean === '/' ? '' : clean}`;
  return (
    <Head>
      <link rel="canonical" href={href} />
    </Head>
  );
}