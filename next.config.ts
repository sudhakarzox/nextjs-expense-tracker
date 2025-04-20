import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // disables PWA in dev
});

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // ...
  },
};

export default nextConfig;
module.exports = withPWA(nextConfig);