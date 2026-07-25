import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` emits an `out/` folder with plain HTML/CSS/JS.
  // Remove `output`/`trailingSlash` if the project moves to a Node/Vercel deploy.
  output: "export",
  trailingSlash: true,
  // Required by `next/image` under `output: "export"` (no server to optimize images).
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
