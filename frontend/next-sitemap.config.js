const fs = require('fs');
const path = require('path');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://hireorbitai.in',
  generateRobotsTxt: true, // (optional) Generate robots.txt file
  sitemapSize: 7000,
  exclude: [
    '/api/*',
    '/dashboard',
    '/dashboard/*',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/onboarding',
    '/onboarding/*',
  ],
  additionalPaths: async (config) => {
    const paths = [];

    // ── Static high-priority landing pages ──
    paths.push(await config.transform(config, '/frontend-frameworks'));
    paths.push(await config.transform(config, '/gov'));
    paths.push(await config.transform(config, '/gov/jobs'));

    // ── Blog posts from lib/blog-content ──
    const blogDir = path.join(__dirname, 'lib', 'blog-content');
    if (fs.existsSync(blogDir)) {
      const files = fs.readdirSync(blogDir);
      const slugs = files
        .filter((f) => f.endsWith('.ts'))
        .map((f) => f.replace('.ts', ''));
      for (const slug of slugs) {
        paths.push(await config.transform(config, `/blog/${slug}`));
      }
    }

    return paths;
  },
  // The dynamic gov notices sitemap (/gov-sitemap) is registered separately
  // in Next.js App Router via app/gov-sitemap/sitemap.ts
  // It is auto-referenced by Next.js as a sub-sitemap at /gov-sitemap.xml
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/*',
          '/dashboard',
          '/dashboard/*',
          '/login',
          '/signup',
          '/forgot-password',
          '/reset-password',
          '/onboarding',
          '/onboarding/*',
        ],
      },
    ],
  },
};
