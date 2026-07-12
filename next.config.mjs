/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel: SSR/동적 라우트 (정적 export 비활성)
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
