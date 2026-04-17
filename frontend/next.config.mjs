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
};

export default nextConfig;
