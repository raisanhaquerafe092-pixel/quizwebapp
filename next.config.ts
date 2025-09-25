import type { NextConfig } from "next";
// Enable PWA using next-pwa
// Service worker will be generated in production build only
// and served from the root scope
// public/manifest.json and icons are required
// @ts-expect-error next-pwa has no types for ESM import in Next 15 yet
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  // Keep default configs; PWA settings are applied via plugin below
};

export default withPWA({
  dest: "public",
  // We'll register SW manually via a client component in App Router
  register: false,
  skipWaiting: true,
  // Enable PWA in both development and production
  disable: false,
  // Additional PWA options
  scope: "/",
  sw: "sw.js",
  // Simple fallbacks; we will add an offline page
  fallbacks: {
    document: "/offline",
  },
  // Exclude certain files from being processed
  publicExcludes: ["!noprecache/**/*"],
})(nextConfig);
