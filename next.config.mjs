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
  // Enable newer Next.js 15 features
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  typescript: {
    // Enable more strict type checking
    ignoreBuildErrors: false,
  },
  experimental: {
    // Enable new Next.js 15 experimental features
    serverActions: {
      bodySizeLimit: '2mb',
    },
    serverComponentsExternalPackages: [],
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
}

export default nextConfig 