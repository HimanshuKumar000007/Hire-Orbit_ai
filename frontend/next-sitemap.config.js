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
    additionalSitemaps: [
      // If we have dynamic/server-side sitemaps, we can list them here.
      // E.g., 'https://hireorbitai.in/server-sitemap.xml'
    ],
  },
};
