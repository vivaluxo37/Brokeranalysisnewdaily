const fs = require('fs');
const path = require('path');

// Base URL for the site
const BASE_URL = 'https://brokeranalysis.com';

// Static pages
const staticPages = [
  '',
  '/brokers',
  '/brokers/compare',
  '/education',
  '/market-news',
  '/trading-tools',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/disclaimer',
  '/login',
  '/register'
];

// Broker regulation pages
const regulationPages = [
  '/brokers/fca',
  '/brokers/cysec',
  '/brokers/asic',
  '/brokers/finma',
  '/brokers/fsca'
];

// Broker country pages
const countryPages = [
  '/brokers/uk',
  '/brokers/usa',
  '/brokers/australia',
  '/brokers/canada',
  '/brokers/eu',
  '/brokers/switzerland',
  '/brokers/uae',
  '/brokers/singapore'
];

// Broker type pages
const typePages = [
  '/brokers/ecn',
  '/brokers/stp',
  '/brokers/market-makers',
  '/brokers/islamic',
  '/brokers/crypto-friendly'
];

// Educational categories
const educationCategories = [
  '/education/forex-basics',
  '/education/technical-analysis',
  '/education/fundamental-analysis',
  '/education/risk-management',
  '/education/trading-strategies',
  '/education/broker-reviews',
  '/education/market-analysis'
];

// Generate sitemap XML
function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>
`;
  });

  // Add broker regulation pages
  regulationPages.forEach(page => {
    sitemap += `  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  });

  // Add broker country pages
  countryPages.forEach(page => {
    sitemap += `  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  });

  // Add broker type pages
  typePages.forEach(page => {
    sitemap += `  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  });

  // Add educational pages
  educationCategories.forEach(page => {
    sitemap += `  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  });

  // Note: Broker individual pages should be dynamically generated
  // from the database and added here

  sitemap += `</urlset>`;

  // Write to public directory
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);

  console.log('Sitemap generated successfully!');
  console.log(`Location: ${sitemapPath}`);
  console.log(`Total URLs: ${staticPages.length + regulationPages.length + countryPages.length + typePages.length + educationCategories.length}`);
}

// Run the generator
generateSitemap();