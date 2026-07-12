import type { NextConfig } from "next";

// Static GitHub Pages export is gated behind GITHUB_PAGES so local dev/build
// (which needs the dynamic /api/auth/* route handlers) is unaffected.
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGithubPages && {
    output: "export",
    basePath: "/rich-friend",
    images: { unoptimized: true },
  }),
};

export default nextConfig;
