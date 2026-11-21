import type { NextConfig } from "next";

/**
 * GITHUB_PAGES=true builds a static export served from https://<owner>.github.io/fibr/.
 * The API routes (/api/ask, /api/walkthrough) need a Node server, so the Pages workflow
 * removes them and the client switches to demo mode (NEXT_PUBLIC_STATIC_EXPORT=1).
 */
const pages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.PAGES_BASE_PATH ?? "/fibr";

const nextConfig: NextConfig = pages
  ? { output: "export", basePath, trailingSlash: true, images: { unoptimized: true } }
  : {};

export default nextConfig;
