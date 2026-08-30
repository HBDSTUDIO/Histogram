import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Publish.command already creates optimized WebP files, so Vercel does not
  // need to spend Image Optimization quota on them again.
  images: { unoptimized: true },
};

export default nextConfig;
