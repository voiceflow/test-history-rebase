/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {
      resolveAlias: {
        cuid: './src/aliases/cuid.alias.ts',
      },
    },
  },
};

export default nextConfig;
