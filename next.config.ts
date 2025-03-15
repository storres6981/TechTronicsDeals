import { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/TechTronicsDeals' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/TechTronicsDeals/' : '',
  images: {
    domains: ['images-na.ssl-images-amazon.com', 'i.imgur.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  trailingSlash: true,
};

export default config;