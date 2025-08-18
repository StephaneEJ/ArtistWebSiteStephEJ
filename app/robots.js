
export default function robots() {
  const site = process.env.SITE_URL || 'https://example.com';
  return { rules: [{ userAgent: '*', allow: '/' }], sitemap: `${site}/sitemap.xml`, host: site };
}
