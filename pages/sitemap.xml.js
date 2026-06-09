// pages/sitemap.xml.js
// Next.js génère automatiquement /sitemap.xml à partir de ce fichier

import { PRODUCTS, SITE } from '../lib/products';

function Sitemap() { return null; }

export async function getServerSideProps({ res }) {
  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { url: SITE.url, changefreq: 'weekly', priority: '1.0' },
  ];

  const productPages = PRODUCTS.map(p => ({
    url: `${SITE.url}/produits/${p.id}`,
    changefreq: 'weekly',
    priority: '0.8',
  }));

  const allPages = [...staticPages, ...productPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default Sitemap;
