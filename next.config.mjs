/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable Strict Mode
  images: {
    remotePatterns: [
      {
        hostname: "*",
        protocol: "https",
      },
    ],
    unoptimized: true,
    domains: ["web.cricap.com"],
  },
};

export default nextConfig;
