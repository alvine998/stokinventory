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
    BASE_URL_API_TOKOTITOH: 'http://103.245.39.242:5000'
  }
}

module.exports = nextConfig
