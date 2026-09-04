/** @type {import('next').NextConfig} */

const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_URL ?? '',
  output: 'standalone',
  images: { unoptimized: true },
  reactStrictMode: false, // to prevent render twice
  poweredByHeader: false,
  generateEtags: false,
  trailingSlash: false,

  // eslint-disable-next-line require-await
  async headers() {
    return [
      {
        // Static i18n translation files — safe to cache; only change on deploy
        source: '/locales/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'deny',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

