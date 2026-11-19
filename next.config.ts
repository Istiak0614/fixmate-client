import type { NextConfig } from "next";

/**
 * SERVER_URL = the Express server (no trailing slash), e.g. https://fixmate-server.vercel.app
 * Read at BUILD time, so it must be set in Vercel's env vars before deploying.
 */
// trim() + remove trailing slashes, so a copy-paste mistake in the env var can't break the proxy
const SERVER_URL = (process.env.SERVER_URL ?? "http://localhost:5000").trim().replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // Tailwind CSS v4 via Turbopack (added by create-next-app — keep it).
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // Allow next/image to load ImgBB, Unsplash and Google profile photos.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  /**
   * API proxy: the browser calls /api/... on OUR domain, Next.js forwards it to Express.
   * -> cookies (JWT) are first-party, so they work on reload in every browser (incl. Safari).
   *
   * Why "fallback"? Fallback rewrites run AFTER Next.js' own routes. So BetterAuth's
   * /api/auth/* route handler (inside this app) keeps working, and every OTHER /api/* request
   * goes to Express. (A normal rewrite runs before dynamic routes and would steal /api/auth/*.)
   */
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: "/api/:path*",
          destination: `${SERVER_URL}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;