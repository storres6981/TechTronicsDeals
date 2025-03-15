import { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/TechTronicsDeals' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/TechTronicsDeals' : '',
  images: {
    unoptimized: true,
    domains: ['images-na.ssl-images-amazon.com', 'i.imgur.com'],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === 'production' ? 'https://storr.github.io/TechTronicsDeals' : 'http://localhost:3000',
  },
  trailingSlash: true,
};


export default config;