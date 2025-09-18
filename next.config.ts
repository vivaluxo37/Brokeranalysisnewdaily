import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix lockfile warning by explicitly setting the output tracing root
  outputFileTracingRoot: process.cwd(),

  // Disable ESLint during builds to prevent warnings from failing the build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Clerk-specific optimizations to prevent chunk loading errors
  experimental: {
    // Optimize CSS for Tailwind v4
    optimizeCss: true,

    // Optimize package imports for Clerk
    optimizePackageImports: ['@clerk/nextjs', '@clerk/clerk-react'],
  },

  // Configure images to allow Clerk CDN
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.clerk.accounts.dev',
      },
      {
        protocol: 'https',
        hostname: '**.clerk.com',
      },
    ],
  },

  // Headers configuration for Clerk
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.com https://clerk-telemetry.com",
              "style-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.com",
              "img-src 'self' data: https://*.clerk.accounts.dev https://*.clerk.com https://*.imgix.net https://images.unsplash.com",
              "connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://clerk-telemetry.com",
              "frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com",
              "font-src 'self' data: https://*.clerk.accounts.dev https://*.clerk.com",
              "worker-src 'self' blob: https://*.clerk.accounts.dev https://*.clerk.com",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // Webpack configuration for Clerk optimization
  webpack: (config, { isServer, dev }) => {
    // Optimize Clerk chunk loading
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          cacheGroups: {
            clerk: {
              test: /[\\/]node_modules[\\/]@clerk[\\/]/,
              name: 'clerk',
              chunks: 'all',
              priority: 20,
            },
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
