/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.worldcoin.org https://*.worldapp.org https://*.useworldapp.com;",
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://app.worldcoin.org https://app.worldapp.org https://app.useworldapp.com',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
