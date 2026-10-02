import type { NextConfig } from 'next';
const config: NextConfig = {
  transpilePackages: ['@saqr/ui', '@saqr/types', '@saqr/api-client'],
  poweredByHeader: false,
  ...(process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true'
    ? {
        output: 'export',
        basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};
export default config;
