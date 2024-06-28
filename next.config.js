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
    BASE_URL_API_TOKOTITOH: 'https://api-sistempakar.tokotitoh.co.id'
  }
}

module.exports = nextConfig
