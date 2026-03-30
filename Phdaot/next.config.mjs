import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add any standard Next.js config here if needed
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
