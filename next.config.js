/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    BASE_URL_API_TOKOTITOH: 'http://127.0.0.1:5000'
  }
}

module.exports = nextConfig
