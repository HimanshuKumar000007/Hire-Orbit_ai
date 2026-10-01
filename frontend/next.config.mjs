/** @type {import('next').NextConfig} */
const nextConfig = {
  // Raise body size limit for Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // NOTE: The `api` key is Pages Router only — not valid in App Router.
  // For App Router route handlers, body parsing is done manually inside each route.js
  async rewrites() {
    return [
      {
        source: "/blog/frontend-frameworks-in-2026-ranked",
        destination: "/blog/semantic-job-search-vs-keyword-matching",
      },
    ];
  },
};

export default nextConfig;
