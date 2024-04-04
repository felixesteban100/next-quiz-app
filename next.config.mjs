/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ['cdn.jsdelivr.net', 'upload.wikimedia.org'], //make it 'your-domain.com'
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
