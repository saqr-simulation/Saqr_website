import type { NextConfig } from 'next';
const config: NextConfig = {
  transpilePackages: ['@saqr/ui', '@saqr/types', '@saqr/api-client'],
  poweredByHeader: false,
  output: 'standalone',
};
export default config;
