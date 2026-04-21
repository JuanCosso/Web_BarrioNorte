/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // los que ya tenías, más estos:
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "instagram.fros8-1.fna.fbcdn.net",
      },
    ],
  },
  // resto de tu config existente sin tocar
};

export default nextConfig;  // ← ES module, no module.exports