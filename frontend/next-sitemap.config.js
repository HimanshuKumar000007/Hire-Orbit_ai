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
    const blogDir = path.join(__dirname, 'lib', 'blog-content');
    if (!fs.existsSync(blogDir)) return [];
    const files = fs.readdirSync(blogDir);
    const slugs = files
      .filter((f) => f.endsWith('.ts'))
      .map((f) => f.replace('.ts', ''));

    const paths = [];
    for (const slug of slugs) {
      paths.push(await config.transform(config, `/blog/${slug}`));
    }
    return paths;
  },
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
