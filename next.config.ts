import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/eventi",
  images: {
    remotePatterns: [
      new URL("https://www.sczg.unizg.hr/wp-content/uploads/**"),
    ],
  },
};

export default nextConfig;
