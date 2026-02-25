import type { NextConfig } from "next";

const remotePatterns = [
  new URL("https://www.sczg.unizg.hr/wp-content/uploads/**"),
];

const cloudinaryHost = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  ? `res.cloudinary.com`
  : null;
if (cloudinaryHost) {
  remotePatterns.push({
    protocol: "https",
    hostname: cloudinaryHost,
    pathname: "/**",
  });
}

const nextConfig: NextConfig = {
  basePath: "/eventi",
  images: {
    remotePatterns,
  },
};

export default nextConfig;
